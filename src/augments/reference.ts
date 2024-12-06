import { z } from "zod";
import { copyWithMetadata } from "../utils/object";

export function augmentSchemaWithReference(
  schema: z.ZodObject<z.ZodRawShape>,
  reference: string
) {
  return copyWithMetadata(schema, { _reference: reference });
}

export type ZodSchemaWithReference = ReturnType<
  typeof augmentSchemaWithReference
>;

export function isZodSchemaWithReference(
  schema: z.ZodType
): schema is ZodSchemaWithReference {
  return "_reference" in schema;
}
