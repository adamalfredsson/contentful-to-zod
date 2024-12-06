import { z } from "zod";
import {
  ContentfulContentType,
  ContentfulField,
  GeneratorConfig,
} from "./types";
import { copyWithMetadata } from "./utils/object";

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
  const contentTypes: string[] = [];

  if (field.validations?.[0]?.linkContentType) {
    contentTypes.push(...field.validations[0].linkContentType);
  }
  if (field.items?.validations?.[0]?.linkContentType) {
    contentTypes.push(...field.items.validations[0].linkContentType);
  }

  return contentTypes;
}

/**
 * Creates a Zod schema for a referenced content type field
 * @param contentType - Content type ID
 * @param schema - Zod schema for the content type
 * @returns A Zod schema for the referenced field
 */
function createReferencedFieldSchema<TKey extends string>(
  contentType: TKey,
  schema: z.ZodObject<z.ZodRawShape>
): z.ZodType {
  return z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal(contentType),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: copyWithMetadata(schema, {
      _reference: contentType,
    }),
  });
}

export type ZodTypeWithReference = z.ZodObject<z.ZodRawShape> & {
  _reference: string;
};

/**
 * Creates a union schema for content type references
 * @param contentTypes - Array of content type IDs
 * @param schemas - Record of already generated Zod schemas
 * @returns A Zod union schema
 */
function createContentTypeUnion<TKey extends string>(
  contentTypes: TKey[],
  schemas: Record<TKey, z.ZodObject<z.ZodRawShape>>
): z.ZodType {
  if (contentTypes.length < 2) {
    throw new Error(
      "Cannot create union schema with less than 2 content types"
    );
  }
  const unionSchemas = contentTypes.map((type) =>
    createReferencedFieldSchema(type, schemas[type])
  );
  return z.union([unionSchemas[0], unionSchemas[1], ...unionSchemas.slice(2)]);
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
  config: GeneratorConfig,
  schemas: Record<string, z.ZodObject<z.ZodRawShape>>
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
      schema = z.object({
        nodeType: z.literal("document"),
        content: z.array(z.unknown()),
        data: z.record(z.unknown()).optional(),
      });
      break;
    case "location":
      schema = z.object({
        lat: z.number(),
        lon: z.number(),
      });
      break;
    case "asset":
      schema = z.object({
        sys: z.object({
          type: z.literal("Link"),
          linkType: z.literal("Asset"),
          id: z.string(),
        }),
      });
      break;
    default:
      if (fieldType.startsWith("array:")) {
        const itemType = fieldType.split(":")[1];
        if (itemType === "entry") {
          const contentTypes = getReferencedContentTypes(field);
          if (contentTypes.length > 1) {
            schema = z.array(createContentTypeUnion(contentTypes, schemas));
          } else if (contentTypes.length === 1) {
            schema = z.array(
              createReferencedFieldSchema(
                contentTypes[0],
                schemas[contentTypes[0]]
              )
            );
          } else {
            schema = z.array(
              z.object({
                sys: z.object({
                  type: z.literal("Link"),
                  linkType: z.literal("Entry"),
                  id: z.string(),
                }),
              })
            );
          }
        } else if (field.items) {
          const itemSchema = getZodSchemaForFieldType(
            {
              ...field.items,
              id: `${field.id}Item`,
              name: `${field.name}Item`,
            },
            config,
            schemas
          );
          schema = z.array(itemSchema);
        } else {
          throw new Error("Unknown array field");
        }
      } else if (fieldType === "entry") {
        const contentTypes = getReferencedContentTypes(field);
        if (
          contentTypes.length > 0 &&
          contentTypes.every((type) => schemas[type])
        ) {
          schema =
            contentTypes.length === 1
              ? createReferencedFieldSchema(
                  contentTypes[0],
                  schemas[contentTypes[0]]
                )
              : createContentTypeUnion(contentTypes, schemas);
        } else {
          schema = z.object({
            sys: z.object({
              type: z.literal("Link"),
              linkType: z.literal("Entry"),
              id: z.string(),
            }),
          });
        }
      } else {
        if (!config.allowUnknown) {
          throw new Error(`Unsupported field type: ${fieldType}`);
        }
        schema = z.unknown();
      }
      break;
  }

  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Creates a Zod object schema with the specified shape
 * @param shape - Record of field names to their Zod schemas
 * @param config - Generator configuration options
 * @returns A Zod object schema
 */
function createZodObject(
  shape: Record<string, z.ZodType>,
  config: GeneratorConfig
): z.ZodObject<z.ZodRawShape> {
  const baseObject = z.object(shape);
  return config.passthrough ? baseObject.passthrough() : baseObject.strict();
}

/**
 * Gets the content type dependencies for a given content type
 * @param contentType - Contentful content type configuration
 * @returns Array of content type IDs that this content type depends on
 */
function getDependencies(contentType: ContentfulContentType): string[] {
  const dependencies: string[] = [];
  for (const field of contentType.fields) {
    const contentTypeId = getReferencedContentTypes(field);
    if (contentTypeId.length > 0) {
      dependencies.push(...contentTypeId);
    }
  }
  return dependencies;
}

/**
 * Sorts content types based on their dependencies
 * @param contentTypes - Array of Contentful content types
 * @returns Sorted array of content types where dependencies come before dependents
 */
function sortContentTypes(
  contentTypes: ContentfulContentType[]
): ContentfulContentType[] {
  const contentTypeMap = new Map<string, ContentfulContentType>();
  const dependencies = new Map<string, string[]>();

  // Build maps
  for (const contentType of contentTypes) {
    const id = contentType.sys.id;
    contentTypeMap.set(id, contentType);
    dependencies.set(id, getDependencies(contentType));
  }

  // Sort based on dependencies
  const sorted: ContentfulContentType[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(id: string) {
    if (visiting.has(id)) {
      throw new Error(`Circular dependency detected: ${id}`);
    }
    if (visited.has(id)) {
      return;
    }

    visiting.add(id);
    const deps = dependencies.get(id) || [];
    for (const dep of deps) {
      visit(dep);
    }
    visiting.delete(id);
    visited.add(id);

    const contentType = contentTypeMap.get(id);
    if (contentType) {
      sorted.push(contentType);
    }
  }

  // Visit all nodes
  for (const id of contentTypeMap.keys()) {
    visit(id);
  }

  return sorted;
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
  config: GeneratorConfig,
  schemas: Record<string, z.ZodObject<z.ZodRawShape>>
): z.ZodObject<z.ZodRawShape> {
  const shape: Record<string, z.ZodType> = {};

  for (const field of contentType.fields) {
    shape[field.id] = getZodSchemaForFieldType(field, config, schemas);
  }

  return createZodObject(shape, config);
}

/**
 * Generates Zod schemas for all content types
 * @param contentTypes - Array of Contentful content types
 * @param config - Generator configuration options
 * @returns Record of content type IDs to their generated Zod schemas
 */
export function generateAllZodSchemas(
  contentTypes: ContentfulContentType[],
  config: GeneratorConfig
): Record<string, z.ZodObject<z.ZodRawShape>> {
  // Sort content types based on dependencies
  const sortedContentTypes = sortContentTypes(contentTypes);

  // Generate schemas in dependency order
  const schemas: Record<string, z.ZodObject<z.ZodRawShape>> = {};
  for (const contentType of sortedContentTypes) {
    schemas[contentType.sys.id] = generateZodSchema(
      contentType,
      config,
      schemas
    );
  }

  return schemas;
}
