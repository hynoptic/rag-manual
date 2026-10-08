function getSectionDepth(title: string): number | null {
  const match = title.match(
    /^([A-Z])?\s*\.?\s*(\d+(?:\.\d+)*)\b/i
  );

  if (!match) {
    return null;
  }

  return match[2].split(".").length;
}

function isMajorSection(title: string): boolean {
  return /^APPENDIX\s+[A-Z]\b/i.test(title);
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

      // Major document boundary:
      // APPENDIX A: MACHINES
      // APPENDIX B: MIDI
      if (isMajorSection(title)) {
        activeSectionLevel = null;

        // Force major structural boundaries to H1.
        return `# ${title}`;
      }

      const numberedDepth = getSectionDepth(title);

      if (numberedDepth !== null) {
        /*
         * Numbered sections live below the current major root.
         *
         * A.2     -> ##
         * A.3     -> ##
         * 6.3     -> ###
         * 6.3.1   -> ####
         *
         * The exact mapping isn't sacred; consistency is.
         */
        activeSectionLevel = numberedDepth + 1;

        return `${"#".repeat(activeSectionLevel)} ${title}`;
      }

      /*
       * Non-numbered headings inside a numbered section
       * become children of that numbered section.
       *
       * e.g.
       *
       * ## A.3 ANALOG DRUM MACHINES
       * ### BD HARD
       */
      if (activeSectionLevel !== null) {
        return `${"#".repeat(
          Math.min(activeSectionLevel + 1, 6)
        )} ${title}`;
      }

      return line;
    })
    .join("\n");
}