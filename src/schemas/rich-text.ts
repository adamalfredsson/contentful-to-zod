import { z } from "zod";
import { augmentSchemaWithInternalReference } from "../augments/internal.js";

const _richTextSchema = z.unknown();

export const richTextSchema = augmentSchemaWithInternalReference(
  _richTextSchema,
  { reference: "contentfulRichText", typeCast: "Document" }
);

export type RichText = z.infer<typeof _richTextSchema>;
