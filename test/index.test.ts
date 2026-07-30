import { describe, expect, it } from "vitest";
import { z } from "zod";
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

  it("should emit Zod 4 APIs", () => {
    const schemas = generateContentfulZodSchemas({
      contentTypes: [
        {
          sys: { id: "example" },
          fields: [
            {
              id: "count",
              name: "Count",
              type: "Integer",
              required: true,
            },
            {
              id: "publishedAt",
              name: "Published at",
              type: "Date",
              required: true,
            },
          ],
        },
      ],
    } as ContentfulSchema);

    const printed = printTypescriptSchemas(schemas, {
      abortOnUnknown: true,
      passthrough: true,
    });
    const printedRecord = printTypescriptSchemas(
      {
        recordExample: z.object({
          fields: z.object({
            labels: z.record(z.string(), z.string()),
          }),
        }),
      },
      { abortOnUnknown: true }
    );

    expect(printed).toContain("z.looseObject({");
    expect(printed).toContain("count: z.int()");
    expect(printed).toContain("publishedAt: z.iso.datetime({ offset: true })");
    expect(printedRecord).toContain("labels: z.record(z.string(), z.string())");
    expect(printed).not.toContain(".passthrough()");
    expect(printed).not.toContain("z.number().int()");
    expect(printed).not.toContain("z.string().datetime(");
  });

  it("should parse expected output", () => {
    const schemas = generateContentfulZodSchemas(
      contentfulSchema as ContentfulSchema
    );
    expect(schemas.page.array().parse(pages)).toMatchSnapshot();
  });
});
