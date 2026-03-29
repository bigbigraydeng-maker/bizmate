"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Menu, MessageSquarePlus, PanelLeftClose, PanelLeft } from "lucide-react";

import { ChatDisclaimer } from "@/components/shared/disclaimer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";

import { ChatInput } from "./chat-input";
import { MessageBubble } from "./message-bubble";

function LiveToolCards({
  items,
}: {
  items: { name: string; result: string }[];
}) {
  if (!items.length) return null;
  return (
    <div className="mt-3 space-y-2">
      {items.map((tc, i) => (
        <div
          key={`${tc.name}-${i}`}
          className="border-primary/20 bg-muted/40 rounded-lg border p-3 text-left"
        >
          <div className="font-mono text-xs font-semibold text-primary">{tc.name}</div>
          <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-background/80 p-2 text-[11px] leading-relaxed whitespace-pre-wrap">
            {(() => {
              try {
                return JSON.stringify(JSON.parse(tc.result), null, 2);
              } catch {
                return tc.result;
              }
            })()}
          </pre>
        </div>
      ))}
    </div>
  );
}

export function ChatInterface() {
  const t = useTranslations("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    conversations,
    conversationId,
    messages,
    loadingList,
    loadingMessages,
    sending,
    streamingText,
    liveToolResults,
    error,
    newChat,
    selectConversation,
    sendMessage,
  } = useChat();

  const showStreamPanel = sending;
  const showSuggestions =
    !conversationId && messages.length === 0 && !sending && !loadingMessages;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] max-h-[900px] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-background md:h-[calc(100vh-4rem)]">
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "border-border bg-muted/20 flex flex-col border-r transition-[width] duration-200",
            sidebarOpen ? "w-56 shrink-0 md:w-64" : "w-0 overflow-hidden border-0",
          )}
        >
          <div className="flex flex-col gap-2 p-2">
            <Button
              variant="default"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={newChat}
            >
              <MessageSquarePlus className="size-4" />
              {t("newChat")}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {loadingList ? (
              <p className="text-muted-foreground px-2 text-xs">{t("loadingConversations")}</p>
            ) : (
              <ul className="space-y-1">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectConversation(c.id)}
                      className={cn(
                        "hover:bg-muted w-full rounded-lg px-2 py-2 text-left text-xs leading-snug transition-colors",
                        conversationId === c.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
                      )}
                    >
                      <span className="line-clamp-2">{c.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border px-2 py-2 md:px-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label={sidebarOpen ? t("collapseSidebar") : t("expandSidebar")}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeft className="size-4" />
              )}
            </Button>
            {!sidebarOpen ? (
              <Button variant="outline" size="sm" className="gap-1" onClick={newChat}>
                <Menu className="size-4" />
                {t("newChat")}
              </Button>
            ) : null}
            <h2 className="text-muted-foreground truncate text-sm font-medium">{t("chatHeading")}</h2>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6">
            {loadingMessages ? (
              <p className="text-muted-foreground text-sm">{t("loadingMessages")}</p>
            ) : null}
            {error ? (
              <p className="text-destructive mb-4 text-sm">{error}</p>
            ) : null}
            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {showStreamPanel ? (
                <div className="flex justify-start">
                  <div className="bg-card text-card-foreground max-w-[min(100%,42rem)] rounded-2xl border border-border px-4 py-3 text-sm shadow-sm">
                    {streamingText ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{streamingText}</ReactMarkdown>
                      </div>
                    ) : !liveToolResults.length ? (
                      <span className="text-muted-foreground text-xs">{t("thinking")}</span>
                    ) : null}
                    <LiveToolCards items={liveToolResults} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <ChatInput
            onSend={sendMessage}
            disabled={sending || loadingMessages}
            streaming={sending}
            showSuggestions={showSuggestions}
          />
        </div>
      </div>
      <ChatDisclaimer />
    </div>
  );
}
