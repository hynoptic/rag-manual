import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@rag-manual/database";

import { s3 } from "./s3.js";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function buildPrompt({
  documentIds,
  supabase,
}: {
  documentIds: string[];
  supabase: SupabaseClient<Database>;
}) {
 
  const documents = await getDocumentContext(documentIds, supabase);

  const systemPrompt = `
    You are an assistant answering questions using the supplied documents (if any).

    DOCUMENTS:\n\n${documents}\n\n`;

  return systemPrompt;
}

export async function getDocumentContext(
  documentIds: string[],
  supabase: SupabaseClient<Database>,
) {
  if (documentIds.length === 0) {
    return "";
  }

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, filename, parsed_s3_key")
    .in("id", documentIds);

  if (error) {
    throw new Error("Failed to fetch documents");
  }

  if (documents.length !== documentIds.length) {
    throw new Error("One or more documents could not be found");
  }

  const markdownDocuments = await Promise.all(
    documents.map(async (document) => {
      if (!document.parsed_s3_key) {
        throw new Error(`Document has not been parsed: ${document.filename}`);
      }

      const response = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_DOCUMENT_BUCKET!,
          Key: document.parsed_s3_key,
        }),
      );

      if (!response.Body) {
        throw new Error(`Failed to load document: ${document.filename}`);
      }

      const markdown = await response.Body.transformToString();

      return `--- DOCUMENT: ${document.filename} ---\n\n${markdown}`;
    }),
  );

  return markdownDocuments.join("\n\n");
}
