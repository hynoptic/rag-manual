import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";

export default function ScrapeWebsiteTab({
  onClose,
  onBusyChange,
}: {
  onClose: () => void;
  onBusyChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isBusy, setIsBusy] = useState(false); // dev only
  useEffect(() => {
    onBusyChange(isBusy);
  }, [isBusy, onBusyChange]);
  return (
    <>
      <div
        onClick={() => setIsBusy(!isBusy)}
        className="flex min-h-48 flex-col items-center justify-center gap-3 mb-4"
      >
        <i className="text-muted-foreground text-sm">todo: scrape websites</i>
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
