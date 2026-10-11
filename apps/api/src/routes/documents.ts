import { Router } from "express";
import { getAuthContext } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { supabase } = await getAuthContext(req);

    const { data, error } = await supabase.from("documents").select();

    if (error || !data) {
      console.error("Failed to fetch documents", error);

      return res.status(500).json({
        error: "Failed to fetch documents",
      });
    }

    console.log(data);

    return res.json({
      documents: data,
    });
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
});

export default router;
