import type { Document, ProfileRow } from "@rag-manual/database";
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

export type DeleteDocumentResponse = Document;

export type DocumentMarkdownResponse = {
  markdown: string;
};

export type DocumentsResponse = Document[];

export type Profile = {
  id: ProfileRow["id"];
  createdAt: ProfileRow["created_at"];
  firstName: ProfileRow["first_name"];
  lastName: ProfileRow["last_name"];
  role: ProfileRow["role"];
};

export type ParseJob = {
  id: string;
  status: string;
  error: string | null;
  userId: string;
  createdAt: string;
  startedAt: string;
  completedAt: string;
  documentId: string;
};
