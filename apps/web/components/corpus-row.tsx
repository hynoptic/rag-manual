"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationStore } from "@/lib/stores/application-store";
import type { Document } from "@rag-manual/database";

type CorpusRowProps = Pick<Document, "id" | "filename">;

export default function CorpusRow({ id, filename }: CorpusRowProps) {
  const selectedDocumentIds = useApplicationStore(
    (state) => state.selectedDocumentIds,
  );

  const toggleDocument = useApplicationStore(
    (state) => state.toggleDocument,
  );

  const checked = selectedDocumentIds.includes(id);

  return (
    <label className="flex items-center gap-2 p-1">
      <Checkbox
        checked={checked}
        onCheckedChange={() => toggleDocument(id)}
      />
      <span className="text-muted-foreground /truncate">{filename}</span>
    </label>
  );
}