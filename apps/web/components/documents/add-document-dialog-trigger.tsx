"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import AddDocumentDialog from "./add-document-dialog";

export default function AddDocumentDialogTrigger() {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Document</Button>
      </DialogTrigger>
      <AddDocumentDialog onClose={onClose}/>
    </Dialog>
  );
}
