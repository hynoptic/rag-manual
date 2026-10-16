"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationStore } from "@/lib/stores/application-store";
import type { Document } from "@rag-manual/database";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import DeleteDocumentDialog from "./delete-document-dialog";
import DocumentRowPopover from "./document-row-popover";
import ViewMarkdownDialog from "./view-markdown-document";

type DocumentRowProps = Pick<Document, "id" | "filename">;
type DocumentDialogTypes = "delete" | "view" | null;

export default function DocumentRow({ id, filename }: DocumentRowProps) {
  const selectedDocumentIds = useApplicationStore(
    (state) => state.selectedDocumentIds,
  );

  const toggleDocument = useApplicationStore((state) => state.toggleDocument);

  const checked = selectedDocumentIds.includes(id);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [activeDialog, setActiveDialog] = useState<DocumentDialogTypes>(null);

  function openDialog(dialog: DocumentDialogTypes) {
    setPopoverOpen(false);
    setActiveDialog(dialog);
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <label className="flex items-center gap-2 p-1">
          <Checkbox
            checked={checked}
            onCheckedChange={() => toggleDocument(id)}
          />
          <PopoverTrigger className="min-w-0 flex-1 text-left truncate text-muted-foreground items-end">
            {filename}
          </PopoverTrigger>
        </label>
        <DocumentRowPopover
          closePopover={() => setPopoverOpen(false)}
          onDeleteDocument={() => openDialog("delete")}
          onViewMarkdown={() => openDialog("view")}
          filename={filename}
          id={id}
        />
      </Popover>
      <Dialog
        open={activeDialog === "delete"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      >
        <DeleteDocumentDialog />
      </Dialog>

      <Dialog
        open={activeDialog === "view"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      >
        <ViewMarkdownDialog />
      </Dialog>
    </>
  );
}
