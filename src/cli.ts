#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import { z } from "zod";
import { generateAllZodSchemas, ZodTypeWithReference } from "./transformer";
import type {
  ContentfulSchema,
  GeneratorConfig,
  GeneratorOptions,
} from "./types";
import { toPascalCase } from "./utils/string";

function isZodTypeWithReference(
  schema: z.ZodType
): schema is ZodTypeWithReference {
  return "_reference" in schema;
}

/**
 * Converts a Zod schema to its string representation for code generation
 * @param schema - The Zod schema to convert
 * @param useUnknownInsteadOfThrow - Whether to use z.unknown() for unsupported types instead of throwing an error
 * @returns A string representation of the schema that can be used in generated code
 */
function zodToString(schema: unknown, config: GeneratorConfig): string {
  if (!(schema instanceof z.ZodType)) return "z.unknown()";

  if (!config.flat && isZodTypeWithReference(schema)) {
    return `${createSchemaName(schema._reference)}`;
  }

  let result = "";
  switch (schema._def.typeName) {
    case "ZodObject": {
      const shape = schema._def.shape();
      const fields = Object.entries(shape)
        .map(([key, value]) => {
          return `    ${key}: ${zodToString(value, config)}`;
        })
        .join(",\n");
      result = `z.object({\n${fields}\n  })`;
      if (schema._def.catchall?._def.typeName === "ZodUnknown") {
        result += ".passthrough()";
      }
      break;
    }

    case "ZodArray":
      result = `z.array(${zodToString(schema._def.type, config)})`;
      break;

    case "ZodOptional":
      result = `${zodToString(schema._def.innerType, config)}.optional()`;
      break;

    case "ZodString":
      result = "z.string()";
      if (
        schema._def.checks?.some(
          (check: z.ZodStringCheck) => check.kind === "datetime"
        )
      ) {
        result += ".datetime()";
      }
      break;

    case "ZodNumber":
      result = "z.number()";
      if (
        schema._def.checks?.some(
          (check: z.ZodNumberCheck) => check.kind === "int"
        )
      ) {
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
      result = `z.record(${zodToString(schema._def.valueType, config)})`;
      break;

    case "ZodUnknown":
      result = "z.unknown()";
      break;

    case "ZodUnion":
      result = `z.union([${schema._def.options
        .map((option: z.ZodType) => zodToString(option, config))
        .join(", ")}])`;
      break;

    default:
      if (config.allowUnknown) {
        return "z.unknown()";
      }
      throw new Error(`Unsupported Zod type: ${schema._def.typeName}`);
  }

  return result;
}

/**
 * Generates a TypeScript file containing Zod schema definitions and their types
 * @param schemas - Record of schema names to their Zod schema objects
 * @param config - Generator configuration options
 */
function generateTypeScriptFile(
  schemas: Record<string, z.ZodType>,
  config: GeneratorConfig
): void {
  const imports = `import { z } from "zod";\n\n`;

  const schemaDefinitions = Object.entries(schemas)
    .map(
      ([name, schema]) =>
        `export const ${createSchemaName(name)} = ${zodToString(schema, config)};\n\n` +
        `export type ${toPascalCase(name)} = z.infer<typeof ${createSchemaName(name)}>;\n`
    )
    .join("\n");

  const content = imports + schemaDefinitions;

  fs.writeFileSync(config.output, content, "utf-8");
}

function createSchemaName(contentTypeId: string): string {
  return `${contentTypeId}Schema`;
}

/**
 * Creates a default configuration by merging user options with defaults
 * @param options - User-provided generator options
 * @returns Complete generator configuration
 */
function getDefaultConfig(options: GeneratorOptions): GeneratorConfig {
  return {
    input: options.input,
    output: options.output,
    passthrough: options.passthrough ?? false,
    allowUnknown: options.allowUnknown ?? false,
    flat: options.flat ?? false,
  };
}

/**
 * Main entry point for the CLI application
 * Parses command line arguments and generates Zod schemas from Contentful content types
 */
function main(): void {
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
    .option(
      "-a, --allow-unknown",
      "Use z.unknown() for unsupported types instead of throwing an error",
      false
    )
    .option(
      "-f, --flat",
      "Generate flat Zod schemas without references to other schemas",
      false
    )
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
    console.error(
      "Error generating schemas:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main();
