import { describe, expect, it } from "vitest";
import { generateContentfulZodSchemas } from "../src/index.js";
import { printTypescriptSchemas } from "../src/parser.js";
import { ContentfulSchema } from "../src/types.js";
import schema from "./fixtures/contentful.json";
import pages from "./fixtures/pages.json";

describe("contentful-to-zod", () => {
  it("should parse expected output", () => {
    const schemas = generateContentfulZodSchemas(schema as ContentfulSchema);

    expect(schemas.page.array().parse(pages)).toMatchSnapshot();
  });

  it("should print expected output", () => {
    const schemas = generateContentfulZodSchemas(schema as ContentfulSchema, {
      abortOnUnknown: true,
    });
    const typescript = printTypescriptSchemas(schemas, {
      abortOnUnknown: true,
    });
    expect(typescript).toMatchSnapshot();
  });
});
