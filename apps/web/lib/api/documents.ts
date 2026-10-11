import type { Document } from "@rag-manual/database";
import { apiFetch } from "./fetch";

export type DocumentsResponse = {
  documents: Document[];
};

export function getDocuments() {
  return apiFetch<DocumentsResponse>("/api/documents");
}