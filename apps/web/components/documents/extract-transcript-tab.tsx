import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";

export default function ExtractTranscriptTab({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 mb-4">
        <i className="text-muted-foreground text-sm">todo: extract transcripts from video</i>
      </div>
      <DialogFooter>
        <div className="flex items-center justify-between w-full">
          <span className="text-muted-foreground">&nbsp;</span>
          <Button
            className="text-muted-foreground"
            variant="outline"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
