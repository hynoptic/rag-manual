import { ParseJob } from "@rag-manual/database";
import { apiFetch } from "./fetch";

export async function getJobs() {
  const jobs = await apiFetch<ParseJob[]>("/api/jobs");
  return jobs.map((job) => ({
    id: job.id,
    status: job.status,
    error: job.error,
    userId: job.user_id,
    createdAt: job.created_at,
    startedAt: job.started_at,
    completedAt: job.completed_at,
    documentId: job.document_id,
  }));
}
