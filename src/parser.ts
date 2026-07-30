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
    const reference = config.toSchemaName(schema._reference);

    if (isZodOptionalSchema(schema)) {
      return `${reference}.optional()`;
    }

    return reference;
  }

  if (!config.flat && isZodSchemaWithReferences(schema)) {
    return isZodOptionalSchema(schema)
      ? "z.unknown().optional()"
      : "z.unknown()";
  }

  if (schema instanceof z.ZodObject) {
    const fields = Object.entries(schema.shape)
      .map(([key, value]) => {
        return `    ${key}: ${zodToString(value, config)}`;
      })
      .join(",\n");
    const objectFactory = config.passthrough ? "z.looseObject" : "z.object";
    return `${objectFactory}({\n${fields}\n  })`;
  }

  if (schema instanceof z.ZodArray) {
    return `z.array(${zodToString(schema.element, config)})`;
  }

  if (schema instanceof z.ZodOptional) {
    return `${zodToString(schema.unwrap(), config)}.optional()`;
  }

  if (schema instanceof z.ZodISODateTime) {
    return schema._zod.def.offset
      ? "z.iso.datetime({ offset: true })"
      : "z.iso.datetime()";
  }

  if (schema instanceof z.ZodString) {
    return "z.string()";
  }

  if (schema instanceof z.ZodNumber) {
    return schema.isInt ? "z.int()" : "z.number()";
  }

  if (schema instanceof z.ZodBoolean) {
    return "z.boolean()";
  }

  if (schema instanceof z.ZodLiteral) {
    const values = [...schema.values];
    return `z.literal(${JSON.stringify(
      values.length === 1 ? values[0] : values
    )})`;
  }

  if (schema instanceof z.ZodRecord) {
    return `z.record(${zodToString(schema.keyType, config)}, ${zodToString(
      schema.valueType,
      config
    )})`;
  }

  if (schema instanceof z.ZodUnknown) {
    return "z.unknown()";
  }

  if (schema instanceof z.ZodUnion) {
    return `z.union([${schema.options
      .map((option) => zodToString(option, config))
      .join(", ")}])`;
  }

  if (schema instanceof z.ZodEnum) {
    return `z.enum(${JSON.stringify(schema.options)})`;
  }

  if (config.abortOnUnknown) {
    throw new Error(`Unsupported Zod type: ${schema.type}`);
  }
  console.error(`Unsupported Zod type: ${schema.type}`);
  return "z.unknown()";
}

function findInternalReferences(schema: unknown): string[] {
  if (!(schema instanceof z.ZodType)) {
    return [];
  }

  if (isZodSchemaWithInternalReference(schema)) {
    return [schema._reference];
  }

  if (schema instanceof z.ZodObject) {
    return Object.values(schema.shape).flatMap(findInternalReferences);
  }

  if (schema instanceof z.ZodArray) {
    return findInternalReferences(schema.element);
  }

  if (schema instanceof z.ZodOptional) {
    return findInternalReferences(schema.unwrap());
  }

  if (schema instanceof z.ZodUnion) {
    return schema.options.flatMap(findInternalReferences);
  }

  return [];
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
          const zodValue = value as z.ZodType;
          const references = isZodSchemaWithReferences(zodValue)
            ? zodValue._references
            : [];
          if (references.length > 0) {
            const isOptional = zodValue instanceof z.ZodOptional;
            const innerType = isOptional ? zodValue.unwrap() : zodValue;
            const isMultiple = innerType instanceof z.ZodArray;

            /**
             * Optional arrays have structure: ZodOptional<ZodArray<T>>
             * Check ZodOptional's inner type to detect arrays when required=false
             * (e.g., Contentful Array fields with required: false)
             */
            acc.set(field, {
              types: references,
              multiple: isMultiple,
              optional: isOptional,
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
