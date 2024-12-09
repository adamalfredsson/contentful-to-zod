import { assetSchema } from "./asset.js";
import { imageSchema } from "./image.js";
import { locationSchema } from "./location.js";
import { richTextSchema } from "./rich-text.js";

export const internalSchemas = [
  locationSchema,
  assetSchema,
  imageSchema,
  richTextSchema,
];
