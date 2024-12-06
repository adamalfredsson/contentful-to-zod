#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import { generateAllZodSchemas } from "./transformer";
import type {
  ContentfulSchema,
  GeneratorConfig,
  GeneratorOptions,
} from "./types";

function toPascalCase(str: string): string {
  // Split on common delimiters and camelCase boundaries
  const words = str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
    .split(/[-_\s]+/);

  // Special case for common abbreviations
  const commonAbbreviations = ["seo", "cta", "url", "id"];

  return words
    .map((word) => {
      const lower = word.toLowerCase();
      if (commonAbbreviations.includes(lower)) {
        return lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function zodToString(schema: any): string {
  if (!schema._def) return "z.any()";

  let result = "";
  switch (schema._def.typeName) {
    case "ZodObject": {
      const shape = schema._def.shape();
      const fields = Object.entries(shape)
        .map(([key, value]) => `    ${key}: ${zodToString(value)}`)
        .join(",\n");
      result = `z.object({\n${fields}\n  })`;
      if (schema._def.catchall?._def.typeName === "ZodAny") {
        result += ".passthrough()";
      }
      break;
    }

    case "ZodArray":
      result = `z.array(${zodToString(schema._def.type)})`;
      break;

    case "ZodOptional":
      result = `${zodToString(schema._def.innerType)}.optional()`;
      break;

    case "ZodString":
      result = "z.string()";
      if (schema._def.checks?.some((check: any) => check.kind === "datetime")) {
        result += ".datetime()";
      }
      break;

    case "ZodNumber":
      result = "z.number()";
      if (schema._def.checks?.some((check: any) => check.kind === "int")) {
        result += ".int()";
      }
      break;

    case "ZodBoolean":
      result = "z.boolean()";
      break;

    case "ZodLiteral":
      result = `z.literal(${JSON.stringify(schema._def.value)})`;
      break;

    case "ZodRecord":
      result = `z.record(${zodToString(schema._def.valueType)})`;
      break;

    case "ZodAny":
      result = "z.any()";
      break;

    default:
      result = "z.any()";
  }

  return result;
}

function generateTypeScriptFile(
  schemas: Record<string, any>,
  config: GeneratorConfig
) {
  const imports = `import { z } from "zod";\n\n`;

  const schemaDefinitions = Object.entries(schemas)
    .map(([name, schema]) => {
      const pascalName = toPascalCase(name);
      const schemaString = zodToString(schema);

      return (
        `export const ${name}Schema = ${schemaString};\n\n` +
        `export type ${pascalName} = z.infer<typeof ${name}Schema>;\n`
      );
    })
    .join("\n");

  const content = imports + schemaDefinitions;

  fs.writeFileSync(config.output, content, "utf-8");
}

function getDefaultConfig(options: GeneratorOptions): GeneratorConfig {
  return {
    input: options.input,
    output: options.output,
    passthrough: options.passthrough ?? false,
  };
}

function main() {
  const program = new Command()
    .name("contentful-to-zod")
    .description("Generate Zod schemas from Contentful content types")
    .requiredOption(
      "-i, --input <path>",
      "Path to the Contentful schema JSON file"
    )
    .requiredOption(
      "-o, --output <path>",
      "Path where the generated TypeScript file should be written"
    )
    .option("--passthrough", "Allow unknown keys in objects", false)
    .version("1.0.0");

  program.parse();

  const config = getDefaultConfig(program.opts());

  try {
    const contentfulSchema: ContentfulSchema = JSON.parse(
      fs.readFileSync(config.input, "utf-8")
    );

    const schemas = generateAllZodSchemas(
      contentfulSchema.contentTypes,
      config
    );
    generateTypeScriptFile(schemas, config);

    console.log(`Successfully generated Zod schemas at ${config.output}`);
  } catch (error) {
    console.error("Error generating schemas:", error);
    process.exit(1);
  }
}

main();
