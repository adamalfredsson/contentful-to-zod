import contentful from "contentful";
import * as fs from "node:fs";
import * as path from "node:path";

const { CONTENTFUL_DELIVERY_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env;

// Validate environment variables
if (!CONTENTFUL_DELIVERY_ACCESS_TOKEN || !CONTENTFUL_SPACE_ID) {
  console.error(
    "Error: Missing required environment variables in .env file\n" +
      "Please ensure CONTENTFUL_DELIVERY_ACCESS_TOKEN and CONTENTFUL_SPACE_ID are set"
  );
  process.exit(1);
}

// Validate command line argument
const contentType = process.argv[2];
if (!contentType) {
  console.error("Error: Content type argument is required");
  console.error("Usage: npm run data <content_type>");
  process.exit(1);
}

// Initialize Contentful client
const client = contentful.createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

async function main() {
  try {
    console.log(`Downloading entries for content type: ${contentType}...`);

    const entries = await client.getEntries({
      content_type: contentType,
      limit: 1000, // Maximum allowed by Contentful
    });

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const destPath = path.join(dataDir, `${contentType}.json`);

    // Write the data to file
    fs.writeFileSync(destPath, JSON.stringify(entries, null, 2));

    console.log(`✅ Data downloaded successfully to ${destPath}`);
  } catch (error) {
    console.error(
      "Error downloading data:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
