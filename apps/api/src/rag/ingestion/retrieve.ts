import type { Document } from "@langchain/core/documents";
import type { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

function getPath(doc: Document): string[] {
  return (doc.metadata.headingPath as string[] | undefined) ?? [];
}

function isSamePath(a: string[], b: string[]) {
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

function commonPrefix(paths: string[][]): string[] {
  if (paths.length === 0) return [];

  const result: string[] = [];

  for (let i = 0; i < paths[0].length; i++) {
    const value = paths[0][i];

    if (paths.every((path) => path[i] === value)) {
      result.push(value);
    } else {
      break;
    }
  }

  return result;
}

export async function retrieveExhaustive(
  query: string,
  vectorStore: MemoryVectorStore,
  allDocuments: Document[],
  initialK = 8
) {
  const matches =
    await vectorStore.similaritySearch(query, initialK);

  console.log("\nInitial semantic matches");

  for (const [index, doc] of matches.entries()) {
    console.log(index, getPath(doc).join(" > "));
  }

  /*
   * Use the strongest few semantic hits to establish scope.
   *
   * Starting with 3 is deliberately conservative.
   */
  const strongestPaths = matches
    .slice(0, 3)
    .map(getPath)
    .filter((path) => path.length > 0);

  const scope = commonPrefix(strongestPaths);

  console.log(
    "\nDetected exhaustive scope:",
    scope.join(" > ")
  );

  /*
   * Find the immediate structural children of that scope.
   *
   * Example:
   *
   * APPENDIX A
   *   A.1
   *   A.2
   *   A.3
   *   A.4
   */
  const childPaths: string[][] = [];

  for (const doc of allDocuments) {
    const path = getPath(doc);

    if (!isDescendant(path, scope)) {
      continue;
    }

    const childPath = path.slice(0, scope.length + 1);

    if (
      !childPaths.some((existing) =>
        isSamePath(existing, childPath)
      )
    ) {
      childPaths.push(childPath);
    }
  }

  /*
   * Which of those immediate children look relevant to
   * the query?
   *
   * For now, use the initial semantic hits as evidence.
   */
  const relevantChildren = childPaths.filter((childPath) =>
    matches.some((match) => {
      const matchPath = getPath(match);

      return (
        isSamePath(matchPath, childPath) ||
        isDescendant(matchPath, childPath)
      );
    })
  );

  console.log("\nRelevant child sections");

  for (const path of relevantChildren) {
    console.log(path.join(" > "));
  }

  /*
   * Expand every relevant child completely.
   */
  const documents = allDocuments.filter((doc) => {
    const path = getPath(doc);

    return relevantChildren.some(
      (childPath) =>
        isSamePath(path, childPath) ||
        isDescendant(path, childPath)
    );
  });

  return {
    matches,
    scope,
    relevantChildren,
    documents,
  };
}

