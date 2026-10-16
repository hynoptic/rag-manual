import { clientApiFetch } from "./client";
import { DeleteDocumentResponse } from "./types";

export function deleteDocumentById(id: string) {
  return clientApiFetch<DeleteDocumentResponse>(`/api/documents/${id}`, {
    method: "DELETE",
  });
}

