"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError, clientApiFetch } from "@/lib/api/client";

import { postgresChangesFilter } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "./ui/separator";

type ParseJobStatus = "queued" | "processing" | "completed" | "failed";

type UploadResponse = {
  jobId: string;
  status: ParseJobStatus;
};

type ParseJob = {
  id: string;
  user_id: string;
  s3_key: string;
  filename: string;
  status: ParseJobStatus;
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
};

export default function UploadButton() {
  const supabase = useMemo(() => createClient(), []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<ParseJobStatus | null>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel(`parse-job:${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "parse_jobs",
          filter: postgresChangesFilter().eq("id", jobId),
        },
        (payload) => {
          console.log(payload);
          const job = payload.new as ParseJob;
          if (job.status === "completed") {
            setProgressMsg("Completed");
            setJobId(null);
          }
          if (job.status === "failed") {
            setErrMsg("Processing failed");
            setJobId(null);
          }
          setJobStatus(job.status);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [jobId]);

  async function handleFileUpload(file: File): Promise<void> {
    setSelectedFile(file.name);
    setIsUploading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await clientApiFetch<UploadResponse>("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      setJobId(response.jobId);
      setJobStatus("queued");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrMsg("Cancelled");
        return;
      }

      if (error instanceof ApiError) {
        console.error(error.status, error.data);
        setErrMsg(`Error code ${error.status}`);
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleButtonClick = () => {
    setSelectedFile(null);
    setErrMsg(null);
    setProgressMsg(null);
    if (isUploading) {
      abortControllerRef.current?.abort();
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isProcessing = jobStatus === "queued" || jobStatus === "processing";
  const buttonlabel = isUploading
    ? "Cancel"
    : isProcessing
      ? "Processing"
      : "Upload PDF";

  return (
    <div className="flex flex-col items-center gap-4 text-muted-foreground">
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFileUpload(file);
          }
        }}
      />
      <Button className="text-muted-foreground" variant="outline" disabled={isProcessing} onClick={handleButtonClick}>
        {buttonlabel}&nbsp;
        {isUploading || isProcessing ? (
          <Spinner className="inline-block" data-icon="inline-start" />
        ) : null}
      </Button>
      {isUploading || isProcessing ? selectedFile : null}
      {errMsg}
      {progressMsg}
    </div>
  );
}
