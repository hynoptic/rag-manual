import { Spinner } from "../ui/spinner";

export default function Loading({ text = "Loading" }: { text?: string }) {
  return (
    <div className="flex items-center">
      <span className="text-sm text-muted-foreground">{text}</span>&nbsp;
      <Spinner className="inline-block" data-icon="inline-start" />
    </div>
  );
}
