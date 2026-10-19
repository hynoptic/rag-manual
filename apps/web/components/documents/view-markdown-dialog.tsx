"use client";

import { useEffect, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { getDocumentMarkdown } from "@/lib/api/documents.client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function ViewMarkdownDialog({
  id,
  open,
  filename,
}: {
  id: string;
  open: boolean;
  filename: string;
}) {
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadMarkdown() {
      setIsLoading(true);
      setError(null);
      setMarkdown("");

      try {
        const response = await getDocumentMarkdown(id);
        if (!cancelled) {
          setMarkdown(response.markdown);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load markdown");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMarkdown();

    return () => {
      cancelled = true;
    };
  }, [id, open]);

  return (
    <DialogContent className="sm:max-w-[90vw]" showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>View Markdown</span>
          <Badge className="text-sm self-center">{filename}</Badge>
        </DialogTitle>
      </DialogHeader>
      <div className="-mx-4 no-scrollbar h-[75vh] overflow-y-auto px-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="">{error}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        )}
      </div>
      <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
  );
}
