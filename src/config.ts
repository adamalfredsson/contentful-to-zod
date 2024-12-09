import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ContentfulToZodOptions } from "./types.js";

const CONFIG_FILE_NAMES = [
  "contentful-to-zod.config.js",
  "contentful-to-zod.config.mjs",
];

export async function loadConfig(
  cwd = process.cwd()
): Promise<Partial<ContentfulToZodOptions>> {
  const configPath = CONFIG_FILE_NAMES.map((name) => resolve(cwd, name)).find(
    (name) => existsSync(resolve(cwd, name))
  );

  if (!configPath) {
    return {};
  }

  try {
    const config = (await import(configPath)).default;
    return config;
  } catch (error) {
    console.error(`Error loading config file: ${configPath}`);
    return {};
  }
}
