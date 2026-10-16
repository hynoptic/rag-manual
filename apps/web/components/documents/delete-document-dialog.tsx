"use client";

import { TriangleAlert } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";

type DeleteDocumentDialogProps = {
  filename: string;
  onCancel: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  errMsg: string | null;
};

export default function DeleteDocumentDialog({
  filename,
  onCancel,
  onDelete,
  isDeleting,
  errMsg,
}: DeleteDocumentDialogProps) {
  return (
    <DialogContent
      onPointerDownOutside={
        isDeleting ? (event) => event.preventDefault() : () => {}
      }
      onEscapeKeyDown={
        isDeleting ? (event) => event.preventDefault() : () => {}
      }
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogDescription className="border-b pb-4 mb-2">
          Lorem ipsum dolor sit amet consectetur adipiscing elit distinctio nisi
          iusto dolor dolor do pariatur vero.
        </DialogDescription>
        <div className="text-muted-foreground flex flex-col gap-4 border-b pb-4 mb-2">
          <p>
            You are deleting the following document. This action cannot be
            undone.
          </p>
          <Badge className="text-base self-center">{filename}</Badge>
          {errMsg && <p>{errMsg}</p>}
        </div>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isDeleting} onClick={onDelete}>
          {isDeleting ? "Deleting" : "Delete"}
          {isDeleting && (
            <Spinner className="inline-block" data-icon="inline-start" />
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
