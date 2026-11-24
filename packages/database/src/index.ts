import type { Database } from "./database.js";

export type { Database };

export type Document = Database["public"]["Tables"]["documents"]["Row"];

export type ParseJobRow = Database["public"]["Tables"]["parse_jobs"]["Row"];

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// fkdamhrimvurtevohfhe