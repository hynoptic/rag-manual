"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UploadFileTab from "./upload-file-tab";
import ScrapeWebsiteTab from "./scrape-website-tab";
import ExtractTranscriptTab from "./extract-transcript-tab";
import { useState } from "react";

export default function AddDocumentDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const [isBusy, setIsBusy] = useState(false);
  return (
    <DialogContent
      onPointerDownOutside={(event) => {
        if (isBusy) event.preventDefault();
      }}
      onEscapeKeyDown={(event) => {
        if (isBusy) event.preventDefault();
      }}
      // onCloseAutoFocus={() => reset()}
      // onPointerDownOutside={
      //   isProcessing || isUploading
      //     ? (event) => event.preventDefault()
      //     : () => {}
      // }
      // onEscapeKeyDown={
      //   isProcessing || isUploading
      //     ? (event) => event.preventDefault()
      //     : () => {}
      // }
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle>Add Document</DialogTitle>
        <DialogDescription>
          Lorem ipsum dolor sit amet consectetur adipiscing elit distinctio nisi
          iusto dolor dolor do pariatur vero.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="file" className="flex-1" disabled={isBusy}>
            Uplaod File
          </TabsTrigger>
          <TabsTrigger value="website" className="flex-1" disabled={isBusy}>
            Scrape Website
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1" disabled={isBusy}>
            Extract Transcript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <UploadFileTab onBusyChange={setIsBusy} onClose={onClose} />
        </TabsContent>

        <TabsContent value="website">
          <ScrapeWebsiteTab onBusyChange={setIsBusy} onClose={onClose} />
        </TabsContent>

        <TabsContent value="transcript">
          <ExtractTranscriptTab onBusyChange={setIsBusy} onClose={onClose} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
