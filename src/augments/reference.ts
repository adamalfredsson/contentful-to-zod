import { z } from "zod";
import { copyWithMetadata } from "../utils/object.js";

export function augmentSchemaWithReferences(
  schema: z.ZodType,
  references: string[]
) {
  return copyWithMetadata(schema, { _references: references });
}

export type ZodSchemaWithReferences = ReturnType<
  typeof augmentSchemaWithReferences
>;

export function isZodSchemaWithReferences(
  schema: z.ZodType
): schema is ZodSchemaWithReferences {
  return "_references" in schema;
}
