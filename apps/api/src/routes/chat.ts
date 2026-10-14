import { Router } from "express";

import { createAgent } from "langchain";

import { ChatRequestSchema } from "../schemas/chat.js";
import { buildPrompt } from "../lib/chat.js";
import { getAuthContext } from "../lib/auth.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      messages,
      documentIds,
      promptMode,
      allowWebSearch,
    } = ChatRequestSchema.parse(req.body);

    // console.log(promptMode, allowWebSearch);

    const { supabase } = await getAuthContext(req);

    const systemPrompt = await buildPrompt({
      documentIds,
      supabase,
    });

    const agent = createAgent({
      model: "gpt-4.1",
      tools: [],
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
