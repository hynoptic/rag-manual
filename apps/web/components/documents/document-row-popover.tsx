import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, Copy, ExternalLink, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { PopoverContent } from "../ui/popover";

type DocumentRowPopoverProps = {
  filename: string;
  id: string;
  closePopover: () => void;
  onDeleteDocument: () => void;
  onViewMarkdown: () => void;
};

const popoverSmallIconProps = { size: 14 };
const popoverLargeIconProps = { size: 16 };

export default function DocumentRowPopover({
  filename,
  id,
  closePopover,
  onViewMarkdown,
  onDeleteDocument,
}: DocumentRowPopoverProps) {
  const [confirmCopyId, setConfirmCopyId] = useState(false);
  const [confirmCopyFilename, setConfirmCopyFilename] = useState(false);
  const timeoutCopyIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutCopyFilenameRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  async function copyIdToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setConfirmCopyId(true);
    if (timeoutCopyIdRef.current) {
      clearTimeout(timeoutCopyIdRef.current);
    }
    timeoutCopyIdRef.current = setTimeout(() => {
      setConfirmCopyId(false);
    }, 125);
  }

  async function copyFilenameToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setConfirmCopyFilename(true);
    if (timeoutCopyFilenameRef.current) {
      clearTimeout(timeoutCopyFilenameRef.current);
    }
    timeoutCopyFilenameRef.current = setTimeout(() => {
      setConfirmCopyFilename(false);
    }, 125);
  }

  // const deleteDocument = (id: string) => {
  //   closePopover();
  //   console.log("// delete", id);
  // };

  // const showDocument = (id: string) => {
  //   closePopover();
  //   console.log("// show", id);
  // };

  return (
    <PopoverContent className="dark w-fit px-2 py-1" side="right">
      <PopoverPrimitive.Arrow />
      <p className="select-none text-base flex gap-2 items-center">
        {filename}
        <span className="flex gap-1">
          <ExternalLink
            className="cursor-pointer"
            onClick={onViewMarkdown}
            {...popoverLargeIconProps}
          />
          <Trash
            className="cursor-pointer"
            onClick={onDeleteDocument}
            {...popoverLargeIconProps}
          />
          {confirmCopyFilename ? (
            <Check {...popoverLargeIconProps} className="pointer-events-none" />
          ) : (
            <Copy
              onClick={() => copyFilenameToClipboard(filename)}
              {...popoverLargeIconProps}
              className="cursor-pointer"
            />
          )}
        </span>
      </p>
      <p className="text-muted-foreground flex gap-2 items-center select-none">
        {id}
        {confirmCopyId ? (
          <Check {...popoverSmallIconProps} className="pointer-events-none" />
        ) : (
          <Copy
            onClick={() => copyIdToClipboard(id)}
            {...popoverSmallIconProps}
            className="cursor-pointer"
          />
        )}
      </p>
    </PopoverContent>
  );
}
