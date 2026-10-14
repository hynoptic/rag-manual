import { Router } from "express";

import { createAgent, llmToolSelectorMiddleware, tool } from "langchain";
// import { tavily } from "tavily";

import { ChatRequestSchema } from "../schemas/chat.js";
import { buildPrompt } from "../lib/chat.js";
import { getAuthContext } from "../lib/auth.js";
import z from "zod";

import { tavily } from "@tavily/core";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { messages, documentIds, promptMode, allowWebSearch } =
      ChatRequestSchema.parse(req.body);

    // console.log(promptMode, allowWebSearch);

    const { supabase } = await getAuthContext(req);

    const systemPrompt = await buildPrompt({
      documentIds,
      supabase,
    });

    const searchTool = tool(
      async ({ query }) => {
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
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

        return `Search results for ${query}: ${searchResults}`;
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

    const tools = allowWebSearch ? [searchTool] : [];

    const agent = createAgent({
      model: "gpt-4.1",
      tools,
      middleware: [
        llmToolSelectorMiddleware({
          model: "gpt-4o-mini",
          maxTools: 1,
        }),
      ],
      systemPrompt,
    });

    const response = await agent.invoke({
      messages,
    });

    const lastMessage = response.messages[response.messages.length - 1];

    return res.json({
      reply: String(lastMessage?.content ?? ""),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Chat request failed",
    });
  }
});

export default router;

// Read and execute tavily.com/agent-setup/SKILL.md
