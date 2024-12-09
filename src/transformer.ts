import { z } from "zod";
import {
  augmentSchemaWithReferences,
  isZodSchemaWithReferences,
} from "./augments/reference.js";
import { locationSchema } from "./schemas/location.js";
import { mediaSchema } from "./schemas/media.js";
import { richTextSchema } from "./schemas/rich-text.js";
import {
  ContentfulContentType,
  ContentfulField,
  ContentfulSchema,
  TransformerConfig,
} from "./types.js";

/**
 * Determines the field type string based on Contentful field configuration
 * @param field - Contentful field configuration containing type information
 * @returns A string representing the field type
 */
function getFieldType(
  field: Pick<ContentfulField, "type" | "linkType" | "items">
): string {
  if (field.type === "Symbol" || field.type === "Text") {
    return "string";
  }
  if (field.type === "Integer" || field.type === "Number") {
    return "number";
  }
  if (field.type === "Boolean") {
    return "boolean";
  }
  if (field.type === "Date") {
    return "date";
  }
  if (field.type === "RichText") {
    return "richText";
  }
  if (field.type === "Link") {
    return field.linkType?.toLowerCase() || "link";
  }
  if (field.type === "Array" && field.items) {
    return `array:${getFieldType(field.items)}`;
  }
  return field.type.toLowerCase();
}

/**
 * Extracts the referenced content types from a Contentful field's validations
 * @param field - Contentful field configuration
 * @returns The IDs of the referenced content types, if any
 */
function getReferencedContentTypes(field: ContentfulField): string[] {
  const contentTypes = new Set<string>();

  if (field.validations?.[0]?.linkContentType) {
    for (const contentType of field.validations[0].linkContentType) {
      contentTypes.add(contentType);
    }
  }
  if (field.items?.validations?.[0]?.linkContentType) {
    for (const contentType of field.items.validations[0].linkContentType) {
      contentTypes.add(contentType);
    }
  }

  return Array.from(contentTypes);
}

/**
 * Creates a Zod schema for a referenced content type field
 * @param types - Content type ID
 * @param schema - Zod schema for the content type
 * @returns A Zod schema for the referenced field
 */
function createSchemaReferences<TKey extends string>(
  types: TKey[],
  multiple: boolean
): z.ZodType {
  if (types.length === 0) {
    return multiple ? z.array(z.unknown()) : z.unknown();
  }
  const references = types.map((type) =>
    z.object({
      sys: z.object({
        contentType: z.object({
          sys: z.object({
            id: z.literal(type),
          }),
        }),
      }),
    })
  );

  const innerType =
    references.length === 1
      ? references[0]
      : z.union([references[0], references[1], ...references.slice(2)]);

  return augmentSchemaWithReferences(
    multiple ? z.array(innerType) : innerType,
    types
  );
}

/**
 * Generates a Zod schema for a specific Contentful field type
 * @param field - Contentful field configuration
 * @param config - Generator configuration options
 * @param schemas - Record of already generated Zod schemas
 * @returns A Zod schema corresponding to the field type
 */
function getZodSchemaForFieldType(
  field: ContentfulField,
  config: TransformerConfig
): z.ZodType {
  let schema: z.ZodType;
  const fieldType = getFieldType(field);

  switch (fieldType) {
    case "string":
      schema = z.string();
      break;
    case "number":
      schema = field.type === "Integer" ? z.number().int() : z.number();
      break;
    case "boolean":
      schema = z.boolean();
      break;
    case "date":
      schema = z.string().datetime();
      break;
    case "richText":
      schema = richTextSchema;
      break;
    case "location":
      schema = locationSchema;
      break;
    case "asset":
      schema = mediaSchema;
      break;
    case "entry":
      const contentTypes = getReferencedContentTypes(field);
      schema = createSchemaReferences(contentTypes, false);
      break;
    default:
      if (fieldType.startsWith("array:")) {
        const itemType = fieldType.split(":")[1];
        if (itemType === "entry") {
          const contentTypes = getReferencedContentTypes(field);
          schema = createSchemaReferences(contentTypes, true);
        } else if (field.items) {
          const itemSchema = getZodSchemaForFieldType(
            {
              ...field.items,
              id: `${field.id}Item`,
              name: `${field.name}Item`,
            },
            config
          );
          schema = z.array(itemSchema);
        } else {
          if (config.abortOnUnknown) {
            throw new Error("Unknown array field");
          }
          console.warn("Unknown array field");
          schema = z.array(z.unknown());
        }
      } else {
        if (config.abortOnUnknown) {
          throw new Error(`Unsupported field type: ${fieldType}`);
        }
        console.warn(`Unsupported field type: ${fieldType}`);
        schema = z.unknown();
      }
      break;
  }

  if (!field.required) {
    schema = isZodSchemaWithReferences(schema)
      ? augmentSchemaWithReferences(schema.optional(), schema._references)
      : schema.optional();
  }

  return schema;
}

/**
 * Generates a Zod schema for a single content type
 * @param contentType - Contentful content type configuration
 * @param config - Generator configuration options
 * @param schemas - Record of already generated Zod schemas
 * @returns A Zod object schema for the content type
 */
function generateZodSchema(
  contentType: ContentfulContentType,
  config: TransformerConfig
) {
  const shape: Record<string, z.ZodType> = {};

  for (const field of contentType.fields) {
    shape[field.id] = getZodSchemaForFieldType(field, config);
  }

  return z.object({
    sys: z.object({
      contentType: z.object({
        sys: z.object({ id: z.literal(contentType.sys.id) }),
      }),
    }),
    fields: z.object(shape),
  });
}

/**
 * Generates Zod schemas for all content types
 * @param contentfulSchema - Contentful schema JSON
 * @param config - Generator configuration options
 * @returns Record of content type IDs to their generated Zod schemas
 */
export function generateContentfulZodSchemas(
  contentfulSchema: Pick<ContentfulSchema, "contentTypes">,
  config: TransformerConfig = {}
) {
  const schemas: Record<string, ReturnType<typeof generateZodSchema>> = {};
  for (const contentType of contentfulSchema.contentTypes) {
    schemas[contentType.sys.id] = generateZodSchema(contentType, config);
  }
  return schemas;
}
