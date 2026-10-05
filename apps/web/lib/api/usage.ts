// apps/web/lib/api/usage.ts
import { apiFetch } from "./fetch";

type Usage = {
  tokenCount: number;
};

export function getUsage() {
  return apiFetch<Usage>("/api/usage");
}