import { PromptMode } from "../stores/application-store";

export type UsageResponse = {
  tokenCount: number;
};

export type ChatRequest = {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  documentIds: string[];
  promptMode: PromptMode;
};

export type ChatResponse = {
  reply: string;
};