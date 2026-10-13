import { PromptMode } from "../stores/application-store";
import type { Document, Profile } from "@rag-manual/database";

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

export type DocumentsResponse = Document[];

export type ProfileResponse = Profile;