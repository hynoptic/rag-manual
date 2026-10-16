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
    const { data, error } = await supabase
      .from("documents")
      .select()
      .is("deleted_at", null)
      .order("created_at", { ascending: false, nullsFirst: false });

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

router.delete("/:id", async (req, res) => {
  let supabase;

  try {
    ({ supabase } = await getAuthContext(req));
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("documents")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Failed to delete document ${id}`, error);
      return res.status(500).json({
        error: `Failed to delete document ${id} (${error.code})`,
      });
    }

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: `Unknown server error deleting document`,
    });
  }
});

export default router;
