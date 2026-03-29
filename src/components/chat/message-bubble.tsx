"use client";

import ReactMarkdown from "react-markdown";

import type { ChatMessage, ToolCallEntry } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SourceCitationList } from "./source-citation";

function formatToolPayload(result: string): string {
  try {
    const parsed = JSON.parse(result) as unknown;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return result;
  }
}

function ToolResultCards({ tools }: { tools: ToolCallEntry[] }) {
  if (!tools.length) return null;
  return (
    <div className="mt-3 space-y-2">
      {tools.map((tc, i) => (
        <Card key={`${tc.name}-${i}`} className="border-primary/20 bg-muted/40 text-left">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="font-mono text-xs font-semibold text-primary">
              {tc.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <pre className="max-h-64 overflow-auto rounded-md bg-background/80 p-2 text-[11px] leading-relaxed whitespace-pre-wrap">
              {formatToolPayload(tc.output)}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type Props = {
  message: ChatMessage;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border border-border",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-2 prose-ul:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            {message.toolCalls && message.toolCalls.length > 0 ? (
              <ToolResultCards tools={message.toolCalls} />
            ) : null}
            {message.sources && message.sources.length > 0 ? (
              <SourceCitationList sources={message.sources} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
