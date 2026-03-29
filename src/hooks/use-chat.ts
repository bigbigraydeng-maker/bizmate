"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/types";

export type SourceCitation = {
  title: string;
  source: string;
  source_url: string | null;
  snippet: string;
};

export type ToolCallEntry = {
  name: string;
  input: unknown;
  output: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[] | null;
  toolCalls?: ToolCallEntry[] | null;
};

export type ConversationListItem = {
  id: string;
  title: string;
  updated_at: string;
};

function parseSources(raw: Json | null | undefined): SourceCitation[] | null {
  if (!raw || !Array.isArray(raw)) return null;
  return raw.filter(
    (x): x is SourceCitation =>
      typeof x === "object" &&
      x !== null &&
      "title" in x &&
      typeof (x as SourceCitation).title === "string",
  ) as SourceCitation[];
}

function parseToolCalls(raw: Json | null | undefined): ToolCallEntry[] | null {
  if (!raw || !Array.isArray(raw)) return null;
  return raw as ToolCallEntry[];
}

async function parseSseStream(
  response: Response,
  onEvent: (data: Record<string, unknown>) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop() ?? "";
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      try {
        onEvent(JSON.parse(json) as Record<string, unknown>);
      } catch {
        /* ignore */
      }
    }
  }
  const tail = buf.trim();
  if (tail.startsWith("data:")) {
    try {
      onEvent(JSON.parse(tail.slice(5).trim()) as Record<string, unknown>);
    } catch {
      /* ignore */
    }
  }
}

export function useChat() {
  const locale = useLocale();
  const language = locale === "zh" ? "zh" : "en";

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [liveToolResults, setLiveToolResults] = useState<{ name: string; result: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const loadCompany = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    setCompanyId(data?.id ?? null);
  }, [supabase]);

  const refreshConversations = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setConversations([]);
      setLoadingList(false);
      return;
    }
    const { data, error: e } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (!e && data) setConversations(data);
    setLoadingList(false);
  }, [supabase]);

  const loadMessages = useCallback(
    async (cid: string) => {
      setLoadingMessages(true);
      setError(null);
      const { data, error: e } = await supabase
        .from("messages")
        .select("id, role, content, sources, tool_calls")
        .eq("conversation_id", cid)
        .order("created_at", { ascending: true });
      setLoadingMessages(false);
      if (e || !data) {
        setError(e?.message ?? "load_failed");
        return;
      }
      setMessages(
        data.map((row) => ({
          id: row.id,
          role: row.role as "user" | "assistant",
          content: row.content,
          sources: parseSources(row.sources),
          toolCalls: parseToolCalls(row.tool_calls),
        })),
      );
    },
    [supabase],
  );

  useEffect(() => {
    void loadCompany();
    void refreshConversations();
  }, [loadCompany, refreshConversations]);

  useEffect(() => {
    if (conversationId) void loadMessages(conversationId);
    else {
      setMessages([]);
      setLiveToolResults([]);
    }
  }, [conversationId, loadMessages]);

  const newChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setStreamingText("");
    setLiveToolResults([]);
    setError(null);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setConversationId(id);
    setStreamingText("");
    setLiveToolResults([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      setSending(true);
      setError(null);
      setStreamingText("");
      setLiveToolResults([]);

      const optimisticUser: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, optimisticUser]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            message: trimmed,
            companyId: companyId ?? undefined,
            language,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error((errBody as { error?: string }).error ?? `HTTP ${res.status}`);
        }

        if (!res.body) throw new Error("No response body");

        let resolvedConvId = conversationId;
        let assistantBuffer = "";

        await parseSseStream(res, (ev) => {
          const t = ev.type as string;
          if (t === "conversation" && typeof ev.id === "string") {
            resolvedConvId = ev.id;
            setConversationId(ev.id);
          }
          if (t === "text" && typeof ev.delta === "string") {
            assistantBuffer += ev.delta;
            setStreamingText(assistantBuffer);
          }
          if (t === "tool_result" && typeof ev.name === "string" && typeof ev.result === "string") {
            const n = ev.name;
            const r = ev.result;
            setLiveToolResults((prev) => [...prev, { name: n, result: r }]);
          }
          if (t === "error") {
            setError(typeof ev.message === "string" ? ev.message : "stream_error");
          }
        });

        setStreamingText("");
        setLiveToolResults([]);
        void refreshConversations();

        if (resolvedConvId) {
          await loadMessages(resolvedConvId);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "send_failed");
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
      } finally {
        setSending(false);
      }
    },
    [conversationId, companyId, language, loadMessages, refreshConversations, sending],
  );

  return {
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
    refreshConversations,
  };
}
