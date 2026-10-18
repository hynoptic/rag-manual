import { Router } from "express";
import { getAuthContext } from "../lib/auth.js";
import { s3 } from "../lib/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

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

router.get("/:id/markdown", async (req, res) => {
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
    const { data: document, error } = await supabase
      .from("documents")
      .select("parsed_s3_key")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      console.error(`Failed to fetch document markdown ${id}`, error);
      return res.status(500).json({
        error: `Failed to fetch document markdown ${id} (${error.code})`,
      });
    }

    if (!document?.parsed_s3_key) {
      console.error(`Document markdown ${id} not found`);
      return res
        .status(404)
        .json({ error: `Document markdown ${id} not found` });
    }

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_DOCUMENT_BUCKET!,
        Key: document.parsed_s3_key,
      }),
    );

    if (!response.Body) {
      console.error(`Document markdown ${id} malformed`);
      return res
        .status(400)
        .json({ error: `Document markdown ${id} malformed` });
    }

    const markdown = await response.Body.transformToString();

    return res.json({ markdown });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: `Unknown server error fetching document markdown`,
    });
  }
});

export default router;
