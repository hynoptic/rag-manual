"use client";

import { CloudAlert, CloudCheck, CloudUpload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  DialogFooter
} from "../ui/dialog";

import { Spinner } from "@/components/ui/spinner";
import { ApiError, clientApiFetch } from "@/lib/api/client";

import { createClient } from "@/lib/supabase/client";
import { postgresChangesFilter } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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

export default function UploadFileTab({ onClose }: { onClose: () => void }) {
  // file selection state
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // file processing state
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<ParseJobStatus | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  // file selection handlers
  function handleFileSelection(file: File) {
    if (isFileSelectionDisabled) return;
    if (file.type !== "application/pdf") return;
    setFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) handleFileSelection(droppedFile);
  }

  // file processing handlers
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
          const job = payload.new as ParseJob;
          if (job.status === "completed") {
            setJobId(null);
            router.refresh();
          }
          if (job.status === "failed") {
            setErrMsg("Error, processing document failed!");
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
        return;
      }

      if (error instanceof ApiError) {
        console.error(error.status, error.data);
        setErrMsg(`Error, file upload failed!`);
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const reset = () => {
    setFile(null);
    setJobStatus(null);
    setJobId(null);
    setErrMsg(null);
  };

  const handleButtonClick = () => {
    if (errMsg !== null) {
      reset();
      onClose();
      return;
    }

    if (isUploading) {
      abortControllerRef.current?.abort();
      reset();
      return;
    }

    if (jobStatus === "completed") {
      reset();
      onClose();
      return;
    }

    if (file) {
      void handleFileUpload(file);
    }
  };

  const isProcessing = jobStatus === "queued" || jobStatus === "processing";
  const buttonlabel = isUploading
    ? "Cancel Upload"
    : isProcessing
      ? "Processing"
      : jobStatus === "completed"
        ? "Done"
        : errMsg === null
          ? "Process Document"
          : "Cancel";

  const isFileSelectionDisabled =
    isUploading || isProcessing || jobStatus === "completed" || errMsg !== null;

  return (
    <>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isFileSelectionDisabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          if (!isFileSelectionDisabled) handleDrop(event);
        }}
        onClick={() => {
          if (!isFileSelectionDisabled) fileInputRef.current?.click();
        }}
        className={`
    flex min-h-48 flex-col items-center justify-center gap-3
    rounded-lg border-2 border-dashed p-6 transition-colors mb-4
    ${
      isFileSelectionDisabled
        ? "cursor-default opacity-60"
        : isDragging
          ? "cursor-pointer border-primary bg-primary/10"
          : "cursor-pointer border-muted-foreground/30 hover:bg-muted/50"
    }
  `}
      >
        {jobStatus === "completed" ? (
          <CloudCheck className="size-12 text-muted-foreground" />
        ) : errMsg !== null ? (
          <CloudAlert className="size-12 text-muted-foreground" />
        ) : (
          <CloudUpload className="size-12 text-muted-foreground" />
        )}

        {file ? (
          <p className="text-sm font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium">Drag and drop a PDF here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          disabled={isFileSelectionDisabled}
          className="hidden"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) handleFileSelection(selected);
          }}
        />
      </div>
      <DialogFooter>
        <div className="flex items-center justify-between w-full">
          <span className="text-muted-foreground">{errMsg}</span>
          <Button
            className="text-muted-foreground"
            variant="outline"
            disabled={isProcessing || !file}
            onClick={handleButtonClick}
          >
            {buttonlabel}&nbsp;
            {isUploading || isProcessing ? (
              <Spinner className="inline-block" data-icon="inline-start" />
            ) : null}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
