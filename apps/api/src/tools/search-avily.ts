import { tavily } from "@tavily/core";
import { tool } from "langchain";
import { z } from "zod";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const searchAvily = tool(
  async ({ query }) => {
    const response = await tvly.search(query, {
      maxResults: 5,
      searchDepth: "advanced",
    });

    const searchResults = response.results
      .map((result, index) =>
        `
## Search result ${index + 1}

**Title:** ${result.title}
**Source:** ${result.url}
${result.publishedDate ? `**Published:** ${result.publishedDate}` : ""}

${result.content}
`.trim(),
      )
      .join("\n\n---\n\n");

    return `Search results for ${query}:\n\n${searchResults}`;
  },
  {
    name: "search",
    description:
      "Search the web for current or external information relevant to the user's query when the supplied documents are insufficient.",
    schema: z.object({
      query: z.string(),
    }),
  },
);
