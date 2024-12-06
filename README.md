# contentful-to-zod

## Usage

### 1. Install

```bash
pnpm install contentful-to-zod
```

### 2. Export contentful schema

```bash
contentful space export --space-id <SPACE_ID> --management-token <MANAGEMENT_TOKEN> --content-file ./contentful.json --content-model-only=true
```

### 3. Generate zod schemas

```bash
npx contentful-to-zod --input ./contentful.json --output ./zod.ts
```
