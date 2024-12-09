import { z } from "zod";
import { augmentSchemaWithInternalReference } from "../augments/internal.js";
import { assetSchema } from "./asset.js";

const _image = assetSchema.extend({
  fields: assetSchema.shape.fields.extend({
    file: assetSchema.shape.fields.shape.file.extend({
      details: assetSchema.shape.fields.shape.file.shape.details.extend({
        image: z.object({
          width: z.number(),
          height: z.number(),
        }),
      }),
    }),
  }),
});

export const imageSchema = augmentSchemaWithInternalReference(_image, {
  reference: "contentfulImage",
});
