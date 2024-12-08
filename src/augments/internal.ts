import { z } from "zod";
import { copyWithMetadata } from "../utils/object.js";

export function augmentSchemaWithInternalReference(
  schema: z.ZodObject<z.ZodRawShape>,
  reference: string
) {
  return copyWithMetadata(schema, { _reference: reference, _internal: true });
}

export type ZodSchemaWithInternalReference = ReturnType<
  typeof augmentSchemaWithInternalReference
>;

export function isZodSchemaWithInternalReference(
  schema: z.ZodType
): schema is ZodSchemaWithInternalReference {
  return "_internal" in schema;
}
