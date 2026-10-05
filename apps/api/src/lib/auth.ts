// src/lib/auth.ts

import type { Request } from "express";
import { createUserClient } from "./supabase.js";

export async function getAuthContext(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const accessToken = authHeader.slice(7).trim();

  if (!accessToken) {
    throw new Error("Missing bearer token");
  }

  const supabase = createUserClient(accessToken);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return {
    user,
    supabase,
    accessToken,
  };
}