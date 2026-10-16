"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationStore } from "@/lib/stores/application-store";
import type { Document } from "@rag-manual/database";

import {
  Popover,
  PopoverTrigger
} from "@/components/ui/popover";
import DocumentRowPopover from "./document-row-popover";

type DocumentRowProps = Pick<Document, "id" | "filename">;

export default function DocumentRow({ id, filename }: DocumentRowProps) {
  const selectedDocumentIds = useApplicationStore(
    (state) => state.selectedDocumentIds,
  );

  const toggleDocument = useApplicationStore((state) => state.toggleDocument);

  const checked = selectedDocumentIds.includes(id);

  return (
    <Popover>
      <label className="flex items-center gap-2 p-1">
        <Checkbox
          checked={checked}
          onCheckedChange={() => toggleDocument(id)}
        />
        <PopoverTrigger className="min-w-0 flex-1 text-left truncate text-muted-foreground items-end">
          {filename}
        </PopoverTrigger>
      </label>
      <DocumentRowPopover filename={filename} id={id}/>
    </Popover>
  );
}