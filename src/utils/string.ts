export function toPascalCase(str: string): string {
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
