import type { Document } from "@langchain/core/documents";
import type { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

function samePath(a: string[], b: string[]) {
  return (
    a.length === b.length &&
    a.every((part, index) => part === b[index])
  );
}

function isDescendant(
  candidate: string[],
  parent: string[]
) {
  return (
    candidate.length > parent.length &&
    parent.every(
      (part, index) => candidate[index] === part
    )
  );
}

export async function retrieveWithSectionExpansion(
  query: string,
  vectorStore: MemoryVectorStore,
  allDocuments: Document[],
  initialK = 8
) {
  const matches =
    await vectorStore.similaritySearch(query, initialK);

    console.log("\nInitial semantic matches");

  for (const [index, doc] of matches.entries()) {
    console.log(
      index,
      (doc.metadata.headingPath as string[] | undefined)?.join(" > ")
    );
  }
  
  const expansionRoots: string[][] = [];

  for (const match of matches) {
    const path = match.metadata.headingPath as
      | string[]
      | undefined;

    if (!path?.length) {
      continue;
    }

    /*
     * Does THIS matched structural node have descendants?
     *
     * Crucially, we do NOT climb up to its parent.
     */
    const hasDescendants = allDocuments.some((doc) => {
      const candidate = doc.metadata.headingPath as
        | string[]
        | undefined;

      return (
        candidate &&
        isDescendant(candidate, path)
      );
    });

    if (hasDescendants) {
      /*
       * Avoid adding the same root more than once.
       */
      if (
        !expansionRoots.some((root) =>
          samePath(root, path)
        )
      ) {
        expansionRoots.push(path);
      }
    }
  }

  /*
   * If semantic search found no expandable parent,
   * just use the original semantic matches.
   */
  if (expansionRoots.length === 0) {
    return {
      matches,
      expansionRoots: [],
      documents: matches,
    };
  }

  /*
   * Return each matched parent plus all of its descendants.
   */
  const documents = allDocuments.filter((doc) => {
    const path = doc.metadata.headingPath as
      | string[]
      | undefined;

    if (!path) {
      return false;
    }

    return expansionRoots.some(
      (root) =>
        samePath(path, root) ||
        isDescendant(path, root)
    );
  });

  return {
    matches,
    expansionRoots,
    documents,
  };
}