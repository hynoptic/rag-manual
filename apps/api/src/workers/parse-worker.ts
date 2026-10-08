import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { sleep } from "../lib/utils.js";

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

    console.log("Processing job:", job.id);

    // Fake parse for now
    await sleep(30000);

    const { error: completeError } = await supabase
      .from("parse_jobs")
      .update({
        status: "complete",
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (completeError) {
      throw completeError;
    }

    console.log("Completed job:", job.id);
  } catch (error) {
    console.error("Job failed:", job.id, error);

    await supabase
      .from("parse_jobs")
      .update({
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Unknown worker error",
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
  console.log(
    `Parse worker started with concurrency ${MAX_CONCURRENT_JOBS}`,
  );

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