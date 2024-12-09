import fs from "node:fs";
import { generateTypeScriptFile } from "./parser.js";
import { generateContentfulZodSchemas } from "./transformer.js";
import type { ContentfulSchema, ContentfulToZodOptions } from "./types.js";

export default function contentfulZodGenerator(
  options: ContentfulToZodOptions
) {
  const contentfulSchema: ContentfulSchema = JSON.parse(
    fs.readFileSync(options.input, "utf-8")
  );

  const schemas = generateContentfulZodSchemas(contentfulSchema, options);
  generateTypeScriptFile(schemas, options);
}

export {
  contentfulZodGenerator,
  generateContentfulZodSchemas,
  type ContentfulToZodOptions,
};
