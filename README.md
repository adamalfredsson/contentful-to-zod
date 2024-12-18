# 🚀 contentful-to-zod

[![npm version](https://img.shields.io/npm/v/contentful-to-zod.svg)](https://www.npmjs.com/package/contentful-to-zod)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> 🔄 Generate type-safe [Zod](https://github.com/colinhacks/zod) schemas from your Contentful content types with ease!

## 💡 Why?

By validating our contentful data with zod, we can catch any unhandled schema changes and protect ourselves from unexpected runtime errors.

## 🚀 Quick Start

### 📦 Install

```bash
# npm
npm install -D contentful-to-zod

# yarn
yarn add -D contentful-to-zod

# pnpm
pnpm install -D contentful-to-zod
```

### 📤 Export Your Contentful Schema

```bash
contentful space export \
  --space-id <SPACE_ID> \
  --management-token <MANAGEMENT_TOKEN> \
  --content-file ./contentful.json \
  --content-model-only=true
```

### ⚡️ Generate Schemas

```bash
npx contentful-to-zod --input ./contentful.json --output ./schemas.ts
```

Browse a sample output [here](https://github.com/adamalfredsson/contentful-to-zod/blob/main/test/generated/schemas.ts)

### 📝 Configuration

You can customize the generator behavior by creating a `contentful-to-zod.config.js` or `contentful-to-zod.config.mjs` file in your project root:

```js
// contentful-to-zod.config.js
/** @type {import('contentful-to-zod').ContentfulToZodConfig} */
export default {
  // Generate flat schemas without references
  flat: true,

  // Allow unknown keys in objects
  passthrough: true,

  // Throw error for unsupported types
  abortOnUnknown: false,

  // Custom naming functions
  toTypeName: (entity) => `${entity}Type`,
  toSchemaName: (entity) => `${entity}Schema`,
};
```

The configuration file supports all generator options. CLI arguments take precedence over config file options.

### 🚀 Use Schemas

```typescript
import contentful from "contentful";
import { pageSchema } from "./schemas";

const client = contentful.createClient({
  // ...
});

const response = await client.getEntries({
  content_type: "page",
});

const pages = response.items.map((item) => pageSchema.parse(item));
```

## 🛠 CLI Options

| Option                   | Description                                                    | Default  |
| ------------------------ | -------------------------------------------------------------- | -------- |
| `-i, --input <path>`     | Path to Contentful schema JSON file                            | Required |
| `-o, --output <path>`    | Output path for generated TypeScript file                      | Required |
| `--passthrough`          | Allow unknown keys in objects                                  | `false`  |
| `-a, --abort-on-unknown` | Throw error for unsupported types instead of using z.unknown() | `false`  |
| `-f, --flat`             | Generate flat schemas without references                       | `false`  |

## 📝 License

MIT

## Contributing

### Release

```bash
npm version major|minor|patch
```

```bash
git push origin main
```

```bash
VERSION=v$(npm version | grep contentful-to-zod | cut -d"'" -f 4)
git push origin $VERSION
gh release create $VERSION --title $VERSION --generate-notes
```
