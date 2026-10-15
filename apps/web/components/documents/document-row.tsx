"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationStore } from "@/lib/stores/application-store";
import type { Document } from "@rag-manual/database";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DocumentRowTooltip from "./document-row-tooltip";

type DocumentRowProps = Pick<Document, "id" | "filename">;

export default function DocumentRow({ id, filename }: DocumentRowProps) {
  const selectedDocumentIds = useApplicationStore(
    (state) => state.selectedDocumentIds,
  );

  const toggleDocument = useApplicationStore((state) => state.toggleDocument);

  const checked = selectedDocumentIds.includes(id);

  return (
    <Tooltip>
      <label className="flex items-center gap-2 p-1">
        <Checkbox
          checked={checked}
          onCheckedChange={() => toggleDocument(id)}
        />
        <TooltipTrigger className="min-w-0 flex-1 text-left truncate text-muted-foreground items-end">
          {filename}
        </TooltipTrigger>
      </label>
      <DocumentRowTooltip filename={filename} id={id}/>
    </Tooltip>
  );
}