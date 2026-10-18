"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationStore } from "@/lib/stores/application-store";
import type { Document } from "@rag-manual/database";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import DeleteDocumentDialog from "./delete-document-dialog";
import DocumentRowPopover from "./document-row-popover";
import ViewMarkdownDialog from "./view-markdown-dialog";
import { deleteDocumentById } from "@/lib/api/documents.client";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";

type DocumentRowProps = Pick<Document, "id" | "filename">;
type DocumentDialogTypes = "delete" | "view" | null;

export default function DocumentRow({ id, filename }: DocumentRowProps) {
  const router = useRouter();
  const selectedDocumentIds = useApplicationStore(
    (state) => state.selectedDocumentIds,
  );

  const toggleDocument = useApplicationStore((state) => state.toggleDocument);

  const checked = selectedDocumentIds.includes(id);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DocumentDialogTypes>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  function openDialog(dialog: DocumentDialogTypes) {
    setErrMsg(null);
    setPopoverOpen(false);
    setActiveDialog(dialog);
  }

  function cancelDialog() {
    setActiveDialog(null);
    setIsDeleting(false);
  }

  async function deleteDocument() {
    setErrMsg(null);
    setIsDeleting(true);
    try {
      await deleteDocumentById(id);
      setActiveDialog(null);
      router.refresh();
    } catch (error) {
      setErrMsg("Error deleting document. Try again!");
      if (error instanceof ApiError) {
        console.error(`Error deleting document ${id}`, error);
        return;
      }
      console.error(`Unexpected error deleting document ${id}`, error);
    } finally {
      setIsDeleting(false);
    }
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
        <DeleteDocumentDialog
          isDeleting={isDeleting}
          onDelete={deleteDocument}
          onCancel={cancelDialog}
          filename={filename}
          errMsg={errMsg}
        />
      </Dialog>

      <Dialog
        open={activeDialog === "view"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      >
        <ViewMarkdownDialog id={id} open={activeDialog === "view"} />
      </Dialog>
    </>
  );
}
