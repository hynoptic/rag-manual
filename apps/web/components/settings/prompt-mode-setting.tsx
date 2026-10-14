"use client";

import {
  PromptMode,
  useApplicationStore,
} from "@/lib/stores/application-store";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function PromptModeSetting() {
  const promptMode = useApplicationStore((state) => state.promptMode);
  const setPromptMode = useApplicationStore((state) => state.setPromptMode);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground">Prompt with</p>
      <RadioGroup
        value={promptMode}
        onValueChange={(value) => setPromptMode(value as PromptMode)}
        className="w-fit text-muted-foreground"
      >
        <div className="flex items-center gap-3">
          <RadioGroupItem value="full" id="prompt-full" />
          <Label htmlFor="prompt-full">Full context</Label>
        </div>

        <div className="flex items-center gap-3">
          <RadioGroupItem disabled={true} value="rag" id="prompt-rag" />
          <Label className="opacity-50" htmlFor="prompt-rag">
            RAG (coming soon)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
