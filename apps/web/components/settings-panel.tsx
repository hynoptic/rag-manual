"use client";

import { PromptMode, useApplicationStore } from "@/lib/stores/application-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export default function SettingsPanel() {
  const promptMode = useApplicationStore((state) => state.promptMode);
  const setPromptMode = useApplicationStore((state) => state.setPromptMode);

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Settings</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-small">
        <p className="text-muted-foreground">Prompt with</p>

        <RadioGroup
          value={promptMode}
          onValueChange={(value) =>
            setPromptMode(value as PromptMode)
          }
          className="w-fit text-muted-foreground"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="full" id="prompt-full" />
            <Label htmlFor="prompt-full">Full context</Label>
          </div>

          <div className="flex items-center gap-3">
            <RadioGroupItem value="rag" id="prompt-rag" />
            <Label htmlFor="prompt-rag">RAG</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}