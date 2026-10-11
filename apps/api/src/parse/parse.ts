import { s3 } from "../lib/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import LlamaCloud from "@llamaindex/llama-cloud";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@rag-manual/database";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

const llamaCloud = new LlamaCloud({
  apiKey: process.env.LLAMA_CLOUD_API_KEY,
  baseURL: process.env.LLAMA_CLOUD_BASE_URL,
});

export async function parseDocument(documentId: string) {
  if (!documentId) {
    throw new Error("Missing document id");
  }

  const { data: document, error } = await supabase
    .from("documents")
    .select("source_s3_key")
    .eq("id", documentId)
    .single();

  if (error) {
    throw error;
  }

  // retrieve document to parse
  const object = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.S3_DOCUMENT_BUCKET!,
      Key: document.source_s3_key,
    }),
  );

  if (!object.Body) {
    throw new Error("S3 object has no body");
  }

  const tempPath = path.join(os.tmpdir(), `${crypto.randomUUID()}.pdf`);

  try {
    await pipeline(object.Body as Readable, fs.createWriteStream(tempPath));

    // parse document
    const file = await llamaCloud.files.create({
      file: fs.createReadStream(tempPath),
      purpose: "parse",
    });

    const result = await llamaCloud.parsing.parse({
      file_id: file.id,
      tier: "fast",
      version: "latest",
      expand: ["markdown"],
    });
    return result;
  } finally {
    await fs.promises.unlink(tempPath).catch(() => {});
  }
}
