import { apiFetch } from "./fetch";
import { DocumentsResponse } from "./types";

export function getDocuments() {
  return apiFetch<DocumentsResponse>("/api/documents");
}