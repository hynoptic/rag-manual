import { Router } from "express";
import multer from "multer";
import { sleep } from "../lib/utils.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3.js";
import fs from "fs";
import { getAuthContext } from "../lib/auth.js";

const router = Router();

const upload = multer({
  dest: "/tmp",
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      callback(new Error("Only PDF files are supported"));
      return;
    }

    callback(null, true);
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file received",
    });
  }
  try {
    const { supabase, user } = await getAuthContext(req);

    const { data: activeJob, error: activeJobError } = await supabase
      .from("parse_jobs")
      .select("id, status")
      .eq("user_id", user.id)
      .in("status", ["queued", "processing"])
      .maybeSingle();

    if (activeJobError) {
      throw activeJobError;
    }

    if (activeJob) {
      return res.status(409).json({
        error: "A parse job is already in progress",
        jobId: activeJob.id,
        status: activeJob.status,
      });
    }

    const documentId = crypto.randomUUID();
    const sourceKey = `documents/${documentId}/source.pdf`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_DOCUMENT_BUCKET,
        Key: sourceKey,
        Body: fs.createReadStream(req.file.path),
        ContentType: req.file.mimetype,
      }),
    );

    console.log("Uploaded to S3:", {
      bucket: process.env.S3_DOCUMENT_BUCKET,
      key: sourceKey,
      size: req.file.size,
    });

    const { data: document, error: documentError } = await supabase
      .from("documents")
      .insert({
        id: documentId,
        user_id: user.id,
        filename: req.file.originalname,
        source_s3_key: sourceKey,
      })
      .select()
      .single();

    if (documentError) throw documentError;

    const { data: job, error } = await supabase
      .from("parse_jobs")
      .insert({
        user_id: user.id,
        document_id: document.id,
        status: "queued",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    await sleep(1000);

    return res.status(202).json({
      jobId: job.id,
      status: job.status,
    });
  } catch (error) {
    console.error("Upload/job creation failed:", error);
    return res.status(500).json({
      error: "Upload/job creation failed",
    });
  } finally {
    await fs.promises.unlink(req.file.path).catch(() => {});
  }
});

export default router;
