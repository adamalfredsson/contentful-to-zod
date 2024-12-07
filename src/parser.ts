import fs from "node:fs";
import { z } from "zod";
import { isZodSchemaWithInternalReference } from "./augments/internal.js";
import { isZodSchemaWithReference } from "./augments/reference.js";
import { internalSchemas } from "./schemas/index.js";
import { richTextSchema } from "./schemas/rich-text.js";
import { GeneratorOptions } from "./types.js";
import { unique } from "./utils/array.js";
import { toPascalCase } from "./utils/string.js";

/**
 * Converts a Zod schema to its string representation for code generation
 * @param schema - The Zod schema to convert
 * @param options - Generator options
 * @returns A string representation of the schema that can be used in generated code
 */
function zodToString(schema: unknown, options: GeneratorOptions): string {
  if (!(schema instanceof z.ZodType)) {
    if (options.abortOnUnknown) {
      throw new Error("Attempted to transform a non-Zod type");
    }
    console.error("Attempted to transform a non-Zod type");
    return "z.unknown()";
  }

  if (!options.flat && isZodSchemaWithReference(schema)) {
    return `${createSchemaName(schema._reference)}`;
  }

  let result = "";
  switch (schema._def.typeName) {
    case "ZodObject": {
      const shape = schema._def.shape();
      const fields = Object.entries(shape)
        .map(([key, value]) => {
          return `    ${key}: ${zodToString(value, options)}`;
        })
        .join(",\n");
      result = `z.object({\n${fields}\n  })`;
      if (options.passthrough) {
        result += ".passthrough()";
      }
      break;
    }

    case "ZodArray":
      result = `z.array(${zodToString(schema._def.type, options)})`;
      break;

    case "ZodOptional":
      result = `${zodToString(schema._def.innerType, options)}.optional()`;
      break;

    case "ZodString":
      result = "z.string()";
      if (
        schema._def.checks?.some(
          (check: z.ZodStringCheck) => check.kind === "datetime"
        )
      ) {
        result += ".datetime()";
      }
      break;

    case "ZodNumber":
      result = "z.number()";
      if (
        schema._def.checks?.some(
          (check: z.ZodNumberCheck) => check.kind === "int"
        )
      ) {
        result += ".int()";
      }
      break;

    case "ZodBoolean":
      result = "z.boolean()";
      break;

    case "ZodLiteral":
      result = `z.literal(${JSON.stringify(schema._def.value)})`;
      break;

    case "ZodRecord":
      result = `z.record(${zodToString(schema._def.valueType, options)})`;
      break;

    case "ZodUnknown":
      result = "z.unknown()";
      break;

    case "ZodUnion":
      result = `z.union([${schema._def.options
        .map((option: z.ZodType) => zodToString(option, options))
        .join(", ")}])`;
      break;

    default:
      if (options.abortOnUnknown) {
        throw new Error(`Unsupported Zod type: ${schema._def.typeName}`);
      }
      console.error(`Unsupported Zod type: ${schema._def.typeName}`);
      return "z.unknown()";
  }

  return result;
}

function findInternalReferences(schema: unknown): string[] {
  if (!(schema instanceof z.ZodType)) {
    return [];
  }

  if (isZodSchemaWithInternalReference(schema)) {
    return [schema._reference];
  }

  switch (schema._def.typeName) {
    case "ZodObject": {
      return Object.values(schema._def.shape()).flatMap(findInternalReferences);
    }

    case "ZodArray":
      return findInternalReferences(schema._def.type);

    case "ZodOptional":
      return findInternalReferences(schema._def.innerType);

    case "ZodUnion":
      return schema._def.options.flatMap(findInternalReferences);

    default:
      return [];
  }
}

/**
 * Generates a TypeScript file containing Zod schema definitions and their types
 * @param schemas - Record of schema names to their Zod schema objects
 * @param options - Generator configuration options
 */
export function generateTypeScriptFile(
  schemas: Record<string, z.ZodType>,
  options: GeneratorOptions
): void {
  const internalReferences = unique(
    Object.values(schemas).flatMap(findInternalReferences)
  );

  const imports = [
    `import { z } from "zod";`,
    ...(internalReferences.includes(richTextSchema._reference)
      ? ["import type { Document } from '@contentful/rich-text-types';"]
      : []),
  ].join("\n");

  const internalDefinitions = internalReferences
    .map((reference) => {
      const schema = internalSchemas.find(
        (schema) => schema._reference === reference
      );

      if (!schema) {
        throw new Error(`Could not find internal schema for ${reference}`);
      }

      return [
        `export const ${createSchemaName(reference)} = ${zodToString(schema, {
          ...options,
          flat: true,
        })}${schema._typeCast ? ` as z.ZodType<${schema._typeCast}>` : ""};`,
        `export type ${toPascalCase(reference)} = z.infer<typeof ${createSchemaName(reference)}>;`,
      ].join("\n\n");
    })
    .join("\n\n");

  const schemaDefinitions = Object.entries(schemas)
    .map(([name, schema]) =>
      [
        `export const ${createSchemaName(name)} = ${zodToString(schema, options)};`,
        `export type ${toPascalCase(name)} = z.infer<typeof ${createSchemaName(name)}>;`,
      ].join("\n\n")
    )
    .join("\n\n");

  const content = [imports, internalDefinitions, schemaDefinitions].join(
    "\n\n"
  );

  fs.writeFileSync(options.output, content, "utf-8");
}

function createSchemaName(contentTypeId: string): string {
  return `${contentTypeId}Schema`;
}
