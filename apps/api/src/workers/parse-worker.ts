import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { sleep } from "../lib/utils.js";
import { parseDocument } from "../parse/parse.js";
import { s3 } from "../lib/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

const MAX_CONCURRENT_JOBS = 5;
const POLL_INTERVAL_MS = 2000;

const activeJobs = new Set<string>();

async function getNextQueuedJob() {
  const { data, error } = await supabase
    .from("parse_jobs")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function processJob(job: any) {
  activeJobs.add(job.id);

  // mark job as processing
  try {
    const { error: processingError } = await supabase
      .from("parse_jobs")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .eq("status", "queued");

    if (processingError) {
      throw processingError;
    }

    console.log("Processing job:", job.id, job.document_id);

    // parse
    const result = await parseDocument(job.document_id);

    const pages = result.markdown?.pages;

    if (!pages) {
      throw new Error("LlamaParse returned no Markdown pages");
    }

    const markdown = pages
      .filter((page) => page.success)
      .map((page) => `<!-- page ${page.page_number} -->\n\n${page.markdown}`)
      .join("\n\n");

    if (!markdown) {
      throw new Error("LlamaParse returned no successful Markdown content");
    }

    const parsedKey = `documents/${job.document_id}/parsed.md`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_DOCUMENT_BUCKET,
        Key: parsedKey,
        Body: markdown,
        ContentType: "text/markdown; charset=utf-8",
      }),
    );

    const { error: documentUpdateError } = await supabase
      .from("documents")
      .update({
        parsed_s3_key: parsedKey,
      })
      .eq("id", job.document_id);

    if (documentUpdateError) {
      throw documentUpdateError;
    }

    // mark job as complete
    const { error: completeError } = await supabase
      .from("parse_jobs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (completeError) {
      throw completeError;
    }

    console.log("Completed job:", job.id);
  } catch (error) {
    console.error("Job failed:", job.id, error);

    // mark job as failed
    await supabase
      .from("parse_jobs")
      .update({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown worker error",
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);
  } finally {
    activeJobs.delete(job.id);
  }
}

async function fillAvailableSlots() {
  while (activeJobs.size < MAX_CONCURRENT_JOBS) {
    const job = await getNextQueuedJob();

    if (!job) {
      break;
    }

    if (activeJobs.has(job.id)) {
      break;
    }

    void processJob(job);
  }
}

async function runWorker() {
  console.log(`Parse worker started with concurrency ${MAX_CONCURRENT_JOBS}`);

  while (true) {
    try {
      await fillAvailableSlots();
    } catch (error) {
      console.error("Worker loop error:", error);
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

void runWorker();

// await sleep(5000);
// throw new Error("fake parse failure");
