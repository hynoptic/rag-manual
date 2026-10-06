export type SectionMetadata = {
  headingPath: string[];
  parentPath: string[];
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
};

export type Section = {
  content: string;
  metadata: SectionMetadata;
};

export function splitByHeadings(markdown: string): Section[] {
  const lines = markdown.split("\n");

  const headings: Array<string | undefined> = [];
  const sections: Section[] = [];

  let buffer: string[] = [];

  function getMetadata(): SectionMetadata {
    const headingPath = headings.filter(
      (heading): heading is string => Boolean(heading)
    );

    return {
      headingPath,
      parentPath: headingPath.slice(0, -1),
      h1: headings[0],
      h2: headings[1],
      h3: headings[2],
      h4: headings[3],
    };
  }

  function flush() {
    const content = buffer.join("\n").trim();

    if (content) {
      sections.push({
        content,
        metadata: getMetadata(),
      });
    }

    buffer = [];
  }

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);

    if (!match) {
      buffer.push(line);
      continue;
    }

    flush();

    const level = match[1].length;
    const title = match[2].trim();

    headings[level - 1] = title;
    headings.length = level;
  }

  flush();

  return sections;
}