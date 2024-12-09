import { z } from "zod";
import {
  augmentSchemaWithReferences,
  isZodSchemaWithReferences,
} from "./augments/reference.js";
import { assetSchema } from "./schemas/asset.js";
import { imageSchema } from "./schemas/image.js";
import { locationSchema } from "./schemas/location.js";
import { richTextSchema } from "./schemas/rich-text.js";
import {
  ContentfulContentType,
  ContentfulField,
  ContentfulSchema,
  TransformerConfig,
} from "./types.js";

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
function getZodSchemaForFieldType({
  field,
  config,
  type = field.type,
}: {
  field: ContentfulField;
  config: TransformerConfig;
  type?: string;
}): z.ZodType {
  let schema: z.ZodType;

  switch (type) {
    case "Symbol":
    case "Text":
      schema = z.string();
      break;
    case "Integer":
    case "Number":
      schema = z.number().int();
      break;
    case "Boolean":
      schema = z.boolean();
      break;
    case "Date":
      schema = z.string().datetime();
      break;
    case "RichText":
      schema = richTextSchema;
      break;
    case "Location":
      schema = locationSchema;
      break;
    case "Asset":
      const isImageOnly = field.validations?.[0]?.linkMimetypeGroup?.every(
        (mime: unknown) => mime === "image"
      );
      schema = isImageOnly ? imageSchema : assetSchema;
      break;
    case "Link":
      return getZodSchemaForFieldType({ field, type: field.linkType, config });
    case "Entry":
      const contentTypes = getReferencedContentTypes(field);
      schema = createSchemaReferences(contentTypes, false);
      break;
    case "Array":
      if (!field.items) {
        if (config.abortOnUnknown) {
          throw new Error("Unknown array field");
        }
        console.warn("Unknown array field");
        schema = z.array(z.unknown());
        break;
      }
      const itemSchema = getZodSchemaForFieldType({
        field: {
          ...field.items,
          id: `${field.id}Item`,
          name: `${field.name}Item`,
          required: true,
        },
        type: field.items.type,
        config,
      });
      schema = z.array(itemSchema);
      break;
    default:
      if (config.abortOnUnknown) {
        throw new Error(`Unsupported field type: ${type}`);
      }
      console.warn(`Unsupported field type: ${type}`);
      schema = z.unknown();
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
    shape[field.id] = getZodSchemaForFieldType({ field, config });
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
