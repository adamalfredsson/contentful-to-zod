import { z } from "zod";
import { augmentSchemaWithInternalReference } from "../augments/internal.js";

const fileDetailsSchema = z.object({
  size: z.number(),
});

const fileSchema = z.object({
  url: z.string(),
  details: fileDetailsSchema,
  fileName: z.string(),
  contentType: z.string(),
});

const _assetSchema = z.object({
  sys: z.object({
    type: z.literal("Asset"),
  }),
  fields: z.object({
    title: z.string(),
    description: z.string().optional(),
    file: fileSchema,
  }),
});

export const assetSchema = augmentSchemaWithInternalReference(_assetSchema, {
  reference: "contentfulAsset",
});

export type Asset = z.infer<typeof assetSchema>;
