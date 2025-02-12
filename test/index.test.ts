import { describe, expect, it } from "vitest";
import { generateContentfulZodSchemas } from "../src/index.js";
import { printTypescriptSchemas } from "../src/parser.js";
import { ContentfulSchema } from "../src/types.js";
import contentfulSettingsSchema from "./fixtures/contentful-settings.json" assert { type: "json" };
import contentfulSchema from "./fixtures/contentful.json" assert { type: "json" };
import pages from "./fixtures/pages.json" assert { type: "json" };

describe("contentful-to-zod", () => {
  it.for([
    { name: "contentful", fixture: contentfulSchema },
    { name: "contentful-settings", fixture: contentfulSettingsSchema },
  ])("should generate schema for $name", ({ fixture }) => {
    const schema = generateContentfulZodSchemas(
      fixture as unknown as ContentfulSchema
    );

    const printed = printTypescriptSchemas(schema, {
      abortOnUnknown: true,
    });

    expect(printed).toMatchSnapshot();
  });

  it("should parse expected output", () => {
    const schemas = generateContentfulZodSchemas(
      contentfulSchema as ContentfulSchema
    );
    expect(schemas.page.array().parse(pages)).toMatchSnapshot();
  });
});
