import { z } from "zod";
import {
  ContentfulContentType,
  ContentfulField,
  GeneratorConfig,
} from "./types";

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

function getReferencedContentType(field: ContentfulField): string | undefined {
  if (field.validations?.[0]?.linkContentType?.[0]) {
    return field.validations[0].linkContentType[0];
  }
  if (field.items?.validations?.[0]?.linkContentType?.[0]) {
    return field.items.validations[0].linkContentType[0];
  }
  return undefined;
}

function getZodSchemaForFieldType(
  field: ContentfulField,
  config: GeneratorConfig,
  schemas: Record<string, z.ZodObject<any>>
): z.ZodType<any> {
  let schema: z.ZodType<any>;
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
        nodeType: z.string(),
        content: z.array(z.any()),
        data: z.record(z.any()).optional(),
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
          const contentType = getReferencedContentType(field);
          if (contentType && schemas[contentType]) {
            schema = z.array(schemas[contentType]);
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
          schema = z.array(
            getZodSchemaForFieldType(
              {
                ...field.items,
                id: `${field.id}Item`,
                name: `${field.name}Item`,
              },
              config,
              schemas
            )
          );
        } else {
          schema = z.array(z.any());
        }
      } else if (fieldType === "entry") {
        const contentType = getReferencedContentType(field);
        if (contentType && schemas[contentType]) {
          schema = schemas[contentType];
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
        schema = z.any();
      }
      break;
  }

  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

function createZodObject(
  shape: Record<string, z.ZodType<any>>,
  config: GeneratorConfig
): z.ZodObject<any> {
  const baseObject = z.object(shape);
  return config.passthrough ? baseObject.passthrough() : baseObject.strict();
}

function getDependencies(contentType: ContentfulContentType): string[] {
  const dependencies: string[] = [];
  for (const field of contentType.fields) {
    const contentTypeId = getReferencedContentType(field);
    if (contentTypeId) {
      dependencies.push(contentTypeId);
    }
  }
  return dependencies;
}

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

export function generateZodSchema(
  contentType: ContentfulContentType,
  config: GeneratorConfig,
  schemas: Record<string, z.ZodObject<any>>
) {
  const shape: Record<string, z.ZodType<any>> = {};

  for (const field of contentType.fields) {
    shape[field.id] = getZodSchemaForFieldType(field, config, schemas);
  }

  return createZodObject(shape, config);
}

export function generateAllZodSchemas(
  contentTypes: ContentfulContentType[],
  config: GeneratorConfig
) {
  // Sort content types based on dependencies
  const sortedContentTypes = sortContentTypes(contentTypes);

  // Generate schemas in dependency order
  const schemas: Record<string, z.ZodObject<any>> = {};
  for (const contentType of sortedContentTypes) {
    schemas[contentType.sys.id] = generateZodSchema(
      contentType,
      config,
      schemas
    );
  }

  return schemas;
}
