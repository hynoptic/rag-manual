import { Router } from "express";

import { createAgent, llmToolSelectorMiddleware } from "langchain";


import { getAuthContext } from "../lib/auth.js";
import { buildPrompt } from "../lib/chat.js";
import { ChatRequestSchema } from "../schemas/chat.js";

import { searchAvily } from "../tools/search-avily.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { messages, documentIds, promptMode, allowWebSearch } =
      ChatRequestSchema.parse(req.body);

    const { supabase } = await getAuthContext(req);

    const systemPrompt = await buildPrompt({
      documentIds,
      supabase,
    });

    const tools = allowWebSearch ? [searchAvily] : [];

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
