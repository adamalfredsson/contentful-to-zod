import { z } from "zod";
import { augmentSchemaWithInternalReference } from "../augments/internal";

const imageDetailsSchema = z.object({
  width: z.number(),
  height: z.number(),
});

const fileDetailsSchema = z.object({
  size: z.number(),
  image: imageDetailsSchema.optional(),
});

const fileSchema = z.object({
  url: z.string(),
  details: fileDetailsSchema,
  fileName: z.string(),
  contentType: z.string(),
});

const _mediaSchema = z.object({
  title: z.string(),
  description: z.string(),
  file: fileSchema,
});

export const mediaSchema = augmentSchemaWithInternalReference(
  _mediaSchema,
  "contentfulMedia"
);

export type Media = z.infer<typeof mediaSchema>;
