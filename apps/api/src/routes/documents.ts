import { Router } from "express";
import { getAuthContext } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  let supabase;

  try {
    ({ supabase } = await getAuthContext(req));
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const { data, error } = await supabase.from("documents").select();

    if (error) {
      console.error("Failed to fetch documents", error);

      return res.status(500).json({
        error: "Failed to fetch documents",
      });
    }

    return res.json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unknown server error",
    });
  }
});

export default router;
