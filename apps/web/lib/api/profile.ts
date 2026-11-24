import { ProfileRow } from "@rag-manual/database";
import { apiFetch } from "./fetch";

export async function getProfile() {
  const profile = await apiFetch<ProfileRow>("/api/profile");
  return {
    id: profile.id,
    createdAt: profile.created_at,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role,
  };
}
