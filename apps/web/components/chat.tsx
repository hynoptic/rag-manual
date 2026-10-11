"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcwIcon, SendIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Textarea } from "./ui/textarea";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tmp, setTmp] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = prompt.trim();

    if (!content) {
      return;
    }

    const role = tmp ? "user" : "assistant";
    setTmp(!tmp);

    setMessages((messages) => [
      ...messages,
      {
        id: crypto.randomUUID(),
        role: role,
        content,
      },
    ]);

    setPrompt("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  return (
    <Card className="flex h-full min-h-0 flex-col">
      <CardContent className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[80%] rounded-xl bg-muted px-4 py-3 mb-4 whitespace-pre-wrap"
                  : "mr-auto max-w-[80%] px-4 py-3 mb-4 whitespace-pre-wrap"
              }
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-end">
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            onInput={(event) => {
              const textarea = event.currentTarget;
              textarea.style.height = "auto";
              textarea.style.height = `${Math.min(
                textarea.scrollHeight,
                160,
              )}px`;
            }}
            placeholder="Ask a question..."
            rows={1}
            className="!text-base min-h-10 max-h-40 flex-1 resize-none overflow-y-auto focus-visible:border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none"
          />

          <Button
            type="submit"
            // size="icon"
            variant="ghost"
            disabled={!prompt.trim()}
            aria-label="Send message"
            className="shrink-0 size-12 [&_svg]:!size-6"
          >
            <SendIcon className="shrink-0 text-muted-foreground" />
          </Button>
          <Button
            type="button"
            // size="icon"
            variant="ghost"
            aria-label="Send message"
            className="shrink-0 size-12 [&_svg]:!size-6"
            onClick={() => setMessages([])}
          >
            <RotateCcwIcon className="shrink-0 text-muted-foreground" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
