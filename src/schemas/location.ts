import { z } from "zod";
import { augmentSchemaWithInternalReference } from "../augments/internal";

const _locationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export const locationSchema = augmentSchemaWithInternalReference(
  _locationSchema,
  "contentfulLocation"
);
