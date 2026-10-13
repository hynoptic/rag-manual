import { apiFetch } from "./fetch";
import { ProfileResponse } from "./types";

export function getProfile() {
  return apiFetch<ProfileResponse>("/api/profile");
}