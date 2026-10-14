"use client";

import { RotateCcwIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ApiError, clientApiFetch } from "@/lib/api/client";
import { ChatResponse } from "@/lib/api/types";
import {
  PromptMode,
  useApplicationStore,
} from "@/lib/stores/application-store";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Textarea } from "../ui/textarea";

export type ChatRequestMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  messages: ChatRequestMessage[];
  documentIds: string[];
  promptMode: PromptMode;
};

type ChatMessage = ChatRequestMessage & {
  id: string;
};

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedDocumentIds = useApplicationStore(
    (state) => state.selectedDocumentIds,
  );

  const promptMode = useApplicationStore((state) => state.promptMode);
  const allowWebSearch = useApplicationStore((state) => state.allowWebSearch);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = prompt.trim();

    if (!content) {
      return;
    }

    const nextMessages = [
      ...messages,
      {
        id: crypto.randomUUID(),
        role: "user" as const,
        content,
      },
    ];

    setMessages(nextMessages);
    setPrompt("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    //

    try {
      const response = await clientApiFetch<ChatResponse>("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
          documentIds: selectedDocumentIds,
          promptMode,
          allowWebSearch,
        }),
      });

      setMessages((messages) => [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.reply,
        },
      ]);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(error.status, error.data);
      }
    } finally {
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
              {message.role === "user" ? (
                message.content
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              )}
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
