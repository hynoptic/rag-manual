import { Router } from "express";
import { getAuthContext } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { supabase } = await getAuthContext(req);

    const { data, error } = await supabase
      .from("usage")
      .select("token_count")
      .single();

    if (error || !data) {
      console.error("Failed to fetch usage", error);

      return res.status(500).json({
        error: "Failed to fetch usage",
      });
    }

    return res.json({
      tokenCount: data.token_count,
    });
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
});

export default router;