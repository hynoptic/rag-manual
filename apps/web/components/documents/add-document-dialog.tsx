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

export default function AddDocumentDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <DialogContent
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
    // showCloseButton={false}
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
          <TabsTrigger value="file" className="flex-1">
            Uplaod File
          </TabsTrigger>
          <TabsTrigger value="website" className="flex-1">
            Scrape Website
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1">
            Extract Transcript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <UploadFileTab onClose={onClose} />
        </TabsContent>

        <TabsContent value="website">
          <ScrapeWebsiteTab onClose={onClose} />
        </TabsContent>

        <TabsContent value="transcript">
          <ExtractTranscriptTab onClose={onClose} />
        </TabsContent>

      </Tabs>
    </DialogContent>
  );
}
