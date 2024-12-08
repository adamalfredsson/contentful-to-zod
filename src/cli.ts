#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import contentfulZodGenerator from "./index.js";
import { GeneratorOptions } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const { version } = require(join(__dirname, "../package.json"));

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
      "-a, --abort-on-unknown",
      "Throw error for unsupported types instead of using z.unknown()",
      false
    )
    .option(
      "-f, --flat",
      "Generate flat Zod schemas without references to other schemas",
      false
    )
    .version(version);

  program.parse();

  const options = program.opts<GeneratorOptions>();

  try {
    contentfulZodGenerator(options);

    console.log(`Successfully generated Zod schemas at ${options.output}`);
  } catch (error) {
    console.error(
      "Error generating schemas:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main();
