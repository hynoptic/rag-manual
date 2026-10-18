import { clientApiFetch } from "./client";
import { DeleteDocumentResponse, DocumentMarkdownResponse } from "./types";

export function deleteDocumentById(id: string) {
  return clientApiFetch<DeleteDocumentResponse>(`/api/documents/${id}`, {
    method: "DELETE",
  });
}

export function getDocumentMarkdown(id: string) {
  return clientApiFetch<DocumentMarkdownResponse>(
    `/api/documents/${id}/markdown`,
  );
}