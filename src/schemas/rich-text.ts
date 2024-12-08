import { z } from "zod";
import { augmentSchemaWithInternalReference } from "../augments/internal.js";

const markSchema = z.object({
  type: z.string(),
});

const textNodeSchema = z.object({
  data: z.record(z.unknown()),
  marks: z.array(markSchema),
  value: z.string(),
  nodeType: z.literal("text"),
});

const paragraphNodeSchema = z.object({
  data: z.record(z.unknown()),
  content: z.array(textNodeSchema),
  nodeType: z.literal("paragraph"),
});

const _richTextSchema = z.object({
  data: z.record(z.unknown()),
  content: z.array(paragraphNodeSchema),
  nodeType: z.literal("document"),
});

export const richTextSchema = augmentSchemaWithInternalReference(
  _richTextSchema,
  "contentfulRichText"
);

export type RichText = z.infer<typeof _richTextSchema>;
