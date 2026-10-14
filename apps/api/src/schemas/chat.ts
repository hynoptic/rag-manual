import { z } from "zod";

export const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1),
    }),
  ),
  documentIds: z.array(z.string().uuid()),
  promptMode: z.enum(["full", "rag"]),
  allowWebSearch: z.boolean(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;