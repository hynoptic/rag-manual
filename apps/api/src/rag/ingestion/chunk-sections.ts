import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import type { Section } from "./split-by-headings.js";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
});

export async function chunkSections(
  sections: Section[],
  source: string
): Promise<Document[]> {
  const documents: Document[] = [];

  for (const section of sections) {
    const chunks = await splitter.splitText(section.content);

    for (const chunk of chunks) {
      const headingContext =
        section.metadata.headingPath.join(" > ");

      const pageContent = headingContext
        ? `${headingContext}\n\n${chunk}`
        : chunk;

      documents.push(
        new Document({
          pageContent,
          metadata: {
            source,
            ...section.metadata,
          },
        })
      );
    }
  }

  return documents;
}