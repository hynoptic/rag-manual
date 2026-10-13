import { Router } from "express";
import { getAuthContext } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  let supabase;
  let user;

  try {
    ({ supabase, user } = await getAuthContext(req));
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Failed to fetch profile", error);

      return res.status(500).json({
        error: "Failed to fetch profile",
      });
    }

    return res.json({
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unknown server error",
    });
  }
});

export default router;
