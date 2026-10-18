"use client";

import { useEffect, useState } from "react";
import { DialogContent } from "../ui/dialog";
import { getDocumentMarkdown } from "@/lib/api/documents.client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ViewMarkdownDialog({
  id,
  open,
}: {
  id: string;
  open: boolean;
}) {
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    if (!open) return;
    async function loadMarkdown() {
      const response = await getDocumentMarkdown(id);
      setMarkdown(response.markdown);
    }
    loadMarkdown();
  }, [id, open]);
  return (
    <DialogContent>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </DialogContent>
  );
}
