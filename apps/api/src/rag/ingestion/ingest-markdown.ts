// src/rag/ingestion/ingest-markdown.ts

import { readFile } from "node:fs/promises";
import { splitByHeadings } from "./split-by-headings.js";
import { chunkSections } from "./chunk-sections.js";
import { normalizeHeadingLevels } from "./nornalize-heading-levels.js";

export async function ingestMarkdown(path: string) {
  const rawMarkdown = await readFile(path, "utf8");

  const markdown = normalizeHeadingLevels(rawMarkdown);
  
  const sections = splitByHeadings(markdown);

  // console.log(`Structural sections: ${sections.length}`);

  const documents = await chunkSections(sections, path);

  // console.log(`Final chunks: ${documents.length}`);

  return documents;
}