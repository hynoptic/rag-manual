import { Check, Copy, ExternalLink, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { TooltipContent } from "../ui/tooltip";

type DocumentRowTooltipProps = {
  filename: string;
  id: string;
};

const tooltipSmallIconProps = { size: 14 };
const tooltipLargeIconProps = { size: 16 };

export default function DocumentRowTooltip({
  filename,
  id,
}: DocumentRowTooltipProps) {
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

  const deleteDocument = (id: string) => {
    console.log("// delete", id);
  };

  const showDocument = (id: string) => {
    console.log("// show", id);
  };

  return (
    <TooltipContent side="right">
      <p className="select-none text-base flex gap-2 items-center">
        {filename}s
        <span className="flex gap-1">
          <ExternalLink
            className="cursor-pointer"
            onClick={() => showDocument(id)}
            {...tooltipLargeIconProps}
          />
          <Trash
            className="cursor-pointer"
            onClick={() => deleteDocument(id)}
            {...tooltipLargeIconProps}
          />
          {confirmCopyFilename ? (
            <Check {...tooltipLargeIconProps} className="pointer-events-none" />
          ) : (
            <Copy
              onClick={() => copyFilenameToClipboard(filename)}
              {...tooltipLargeIconProps}
              className="cursor-pointer"
            />
          )}
        </span>
      </p>
      <p className="text-muted-foreground flex gap-2 items-center select-none">
        {id}
        {confirmCopyId ? (
          <Check {...tooltipSmallIconProps} className="pointer-events-none" />
        ) : (
          <Copy
            onClick={() => copyIdToClipboard(id)}
            {...tooltipSmallIconProps}
            className="cursor-pointer"
          />
        )}
      </p>
    </TooltipContent>
  );
}
