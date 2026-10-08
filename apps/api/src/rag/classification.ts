import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const intentSchema = z.object({
  intent: z.enum(["focused", "exhaustive", "comparison"]),
  reason: z.string(),
});

const intentModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
}).withStructuredOutput(intentSchema);

export async function classifyIntent(query: string) {
  return intentModel.invoke([
    {
      role: "system",
      content: `
Classify the user's question into exactly one retrieval intent.

focused:
The question asks for a specific fact, parameter, procedure, feature, setting, or explanation.
Examples:
- What does SWEP do on BD MODERN?
- How do I change the MIDI channel?
- What are the parameters of SY CHIP?

exhaustive:
The question asks for all, every, a complete list, or comprehensive coverage.
Examples:
- Name all the analogue machines.
- What are all the LFO types?
- List every parameter available on the machine.

comparison:
The question asks to compare, contrast, distinguish, or explain differences between two or more things.
Examples:
- What's the difference between BD HARD and BD MODERN?
- Compare SY RAW and SY CHIP.

Return the intent and a short reason.
`,
    },
    {
      role: "user",
      content: query,
    },
  ]);
}