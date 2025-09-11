import { z } from "zod";
import { isZodSchemaWithInternalReference } from "./augments/internal.js";
import { isZodSchemaWithReferences } from "./augments/reference.js";
import { internalSchemas } from "./schemas/index.js";
import { richTextSchema } from "./schemas/rich-text.js";
import { PrintConfig } from "./types.js";
import { unique } from "./utils/array.js";
import { toPascalCase } from "./utils/string.js";
import { isZodOptionalSchema } from "./utils/zod.js";

/**
 * Converts a Zod schema to its string representation for code generation
 * @param schema - The Zod schema to convert
 * @param config - Resolved generator config
 * @returns A string representation of the schema that can be used in generated code
 */
function zodToString(schema: unknown, config: ResolvedGeneratorConfig): string {
  if (!(schema instanceof z.ZodType)) {
    if (config.abortOnUnknown) {
      throw new Error("Attempted to transform a non-Zod type");
    }
    console.error("Attempted to transform a non-Zod type");
    return "z.unknown()";
  }

  if (!config.flat && isZodSchemaWithInternalReference(schema)) {
    const reference = config.toSchemaName(schema._reference)

    if (isZodOptionalSchema(schema)) {
      return `${reference}.optional()`;
    }

    return reference;
  }

  if (!config.flat && isZodSchemaWithReferences(schema)) {
    return "z.unknown()";
  }

  let result = "";
  switch (schema._def.typeName) {
    case "ZodObject": {
      const shape = schema._def.shape();
      const fields = Object.entries(shape)
        .map(([key, value]) => {
          return `    ${key}: ${zodToString(value, config)}`;
        })
        .join(",\n");
      result = `z.object({\n${fields}\n  })`;
      if (config.passthrough) {
        result += ".passthrough()";
      }
      break;
    }

    case "ZodArray":
      result = `z.array(${zodToString(schema._def.type, config)})`;
      break;

    case "ZodOptional":
      result = `${zodToString(schema._def.innerType, config)}.optional()`;
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
      result = `z.record(${zodToString(schema._def.valueType, config)})`;
      break;

    case "ZodUnknown":
      result = "z.unknown()";
      break;

    case "ZodUnion":
      result = `z.union([${schema._def.options
        .map((option: z.ZodType) => zodToString(option, config))
        .join(", ")}])`;
      break;

    default:
      if (config.abortOnUnknown) {
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
 * Combines default options with user-specified options
 * @param options
 * @returns
 */
function resolveConfig(options: PrintConfig) {
  return {
    toTypeName(contentTypeId: string): string {
      return toPascalCase(contentTypeId);
    },
    toSchemaName(contentTypeId: string): string {
      return `${contentTypeId}Schema`;
    },
    flat: false,
    ...options,
  };
}

type ResolvedGeneratorConfig = ReturnType<typeof resolveConfig>;

/**
 * Generates TypeScript file content containing Zod schema definitions and their types
 * @param schemas - Record of schema names to their Zod schema objects
 * @param config - Print configuration options
 */
export function printTypescriptSchemas(
  schemas: Record<
    string,
    z.ZodObject<{
      fields: z.ZodObject<z.ZodRawShape>;
    }>
  >,
  config: PrintConfig
): string {
  const resolvedConfig = resolveConfig(config);

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
        `export const ${resolvedConfig.toSchemaName(reference)} = ${zodToString(
          schema,
          {
            ...resolvedConfig,
            flat: true,
          }
        )}${schema._typeCast ? ` as z.ZodType<${schema._typeCast}>` : ""};`,

        `export type ${resolvedConfig.toTypeName(reference)} = z.infer<typeof ${resolvedConfig.toSchemaName(reference)}>;`,
      ].join("\n\n");
    })
    .join("\n\n");

  const schemaDefinitions = Object.entries(schemas)
    .map(([name, schema]) => {
      const fieldReferences = Object.entries(schema.shape.fields.shape).reduce(
        (acc, [field, value]) => {
          const references = isZodSchemaWithReferences(value)
            ? value._references
            : [];
          if (references.length > 0) {
            acc.set(field, {
              types: references,
              multiple:
                "typeName" in value._def && value._def.typeName === "ZodArray",
              optional:
                "typeName" in value._def &&
                value._def.typeName === "ZodOptional",
            });
          }
          return acc;
        },
        new Map<
          string,
          { types: string[]; multiple: boolean; optional: boolean }
        >()
      );

      return [
        `const ${toBaseSchemaName(name)} = ${zodToString(schema, resolvedConfig)};`,

        `export type ${resolvedConfig.toTypeName(name)} = z.infer<typeof ${toBaseSchemaName(
          name
        )}> & { fields: {${[...fieldReferences.entries()]
          .map(
            ([field, reference]) =>
              `${field}${reference.optional ? "?" : ""}: (${reference.types
                .map(resolvedConfig.toTypeName)
                .concat(reference.optional ? ["undefined"] : [])
                .join(" | ")})${reference.multiple ? "[]" : ""}`
          )
          .join(",\n")}} };`,

        `export const ${resolvedConfig.toSchemaName(name)}: z.ZodType<${resolvedConfig.toTypeName(
          name
        )}> = ${toBaseSchemaName(name)}.extend({
          fields: ${toBaseSchemaName(name)}.shape.fields.extend({
            ${[...fieldReferences.entries()]
          .map(
            ([field, reference]) =>
              `${field}: z.lazy(() => ${reference.multiple ? "z.array(" : ""}${reference.types.length === 1
                ? resolvedConfig.toSchemaName(reference.types[0])
                : `z.union([${reference.types
                  .map(resolvedConfig.toSchemaName)
                  .join(", ")}])`
              }${reference.multiple ? ")" : ""})${reference.optional ? ".optional()" : ""}`
          )
          .join(",\n")}
          })
        });`,
      ].join("\n\n");
    })
    .join("\n\n");

  const content = [imports, internalDefinitions, schemaDefinitions].join(
    "\n\n"
  );

  return content;
}

function toBaseSchemaName(contentTypeId: string): string {
  return `_base${toPascalCase(contentTypeId)}`;
}
