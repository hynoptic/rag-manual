"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { clientApiFetch } from "@/lib/api/client";

enum ButtonLabel {
  UploadPDF = "Upload PDF",
  CancelUpload = "Cancel Upload",
}

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [monitor, setMonitor] = useState<React.ReactNode>();

  const [buttonLabel, setButtonLabel] = useState<ButtonLabel>(
    ButtonLabel.UploadPDF,
  );
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileUpload(file: File): Promise<void> {
    setSelectedFile(file.name);
    setButtonLabel(ButtonLabel.CancelUpload);
    setIsUploading(true);

    setMonitor(
      <span>
        Uploading <span className="italic">{file.name}</span>
      </span>,
    );

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await clientApiFetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      setButtonLabel(ButtonLabel.UploadPDF);
      setMonitor(
        <span>
          Success, uploaded <span className="italic">{file.name}</span>
        </span>,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setButtonLabel(ButtonLabel.UploadPDF);
        setMonitor(<span>Upload cancelled</span>);
        return;
      }
      setMonitor(
        <span>
          Error uploading <span className="italic">{file.name}</span>
        </span>,
      );
      setButtonLabel(ButtonLabel.UploadPDF);
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleButtonClick = () => {
    if (isUploading) {
      abortControllerRef.current?.abort();
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-4">
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
      <Button
        // size="lg"
        // variant="outline"
        onClick={handleButtonClick}
        // disabled={isUploading}
      >
        {buttonLabel}
      </Button>
      <span>
        {monitor}{" "}
        {isUploading && (
          <Spinner className="inline-block" data-icon="inline-start" />
        )}
      </span>
    </div>
  );
}
