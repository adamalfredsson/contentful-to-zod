import { z } from "zod";

export function isZodOptionalSchema(
  zodSchema: z.ZodType
): zodSchema is z.ZodOptional<z.ZodType> {
  return zodSchema instanceof z.ZodOptional;
}
