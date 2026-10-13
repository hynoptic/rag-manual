import type { Database } from "./database.js";

export type { Database };

export type Document = Database["public"]["Tables"]["documents"]["Row"];

export type ParseJob = Database["public"]["Tables"]["parse_jobs"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
