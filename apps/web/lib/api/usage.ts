// apps/web/lib/api/usage.ts
import { apiFetch } from "./fetch";
import { UsageResponse } from "./types";

export function getUsage() {
  return apiFetch<UsageResponse>("/api/usage");
}