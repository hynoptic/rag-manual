// normalize-heading-levels.ts

function getSectionDepth(title: string): number | null {
  const match = title.match(
    /^([A-Z])?\s*\.?\s*(\d+(?:\.\d+)*)\b/i
  );

  if (!match) {
    return null;
  }

  return match[2].split(".").length;
}

export function normalizeHeadingLevels(markdown: string): string {
  const lines = markdown.split("\n");

  let activeSectionLevel: number | null = null;

  return lines
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);

      if (!match) {
        return line;
      }

      const title = match[2].trim();
      const numberedDepth = getSectionDepth(title);

      if (numberedDepth !== null) {
        // A.2 / 6.3 -> ##
        // 6.3.1     -> ###
        activeSectionLevel = numberedDepth + 1;

        return `${"#".repeat(activeSectionLevel)} ${title}`;
      }

      // Non-numbered headings inside a numbered section
      // become children of that section.
      if (activeSectionLevel !== null) {
        return `${"#".repeat(
          Math.min(activeSectionLevel + 1, 6)
        )} ${title}`;
      }

      return line;
    })
    .join("\n");
}