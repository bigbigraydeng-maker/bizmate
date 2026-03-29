import { NextResponse } from "next/server";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";
import { z } from "zod";

import { getOpenAIClient, AI_MODEL } from "@/lib/ai/client";
import { searchKnowledgeBase, type KnowledgeHit } from "@/lib/ai/rag";
import { BIZMATE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { BIZMATE_TOOLS, executeBizmateToolWithContext } from "@/lib/ai/tools";
import { createClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/lib/supabase/types";

export const maxDuration = 120;

const bodySchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  message: z.string().min(1).max(50_000),
  companyId: z.string().uuid().optional().nullable(),
  language: z.enum(["en", "zh"]).optional(),
});

function buildSystemPrompt(
  language: "en" | "zh" | undefined,
  company: Tables<"companies"> | null,
  ragHits: KnowledgeHit[],
): string {
  let s = BIZMATE_SYSTEM_PROMPT;
  if (language === "zh") {
    s +=
      "\n\n## Language preference\nReply in Simplified Chinese unless the user writes primarily in English.";
  } else {
    s +=
      "\n\n## Language preference\nReply in English unless the user writes primarily in Chinese.";
  }
  if (company) {
    s += `\n\n## Company context (use for tools and explanations)\n${JSON.stringify(
      {
        name: company.name,
        gst_filing_frequency: company.gst_filing_frequency,
        balance_date: company.balance_date,
        employee_count: company.employee_count,
        gst_number: company.gst_number,
      },
      null,
      2,
    )}`;
  }
  if (ragHits.length > 0) {
    s += "\n\n## Retrieved knowledge (cite titles/URLs when relevant)\n";
    ragHits.forEach((h, i) => {
      const cite = h.source_url ? `${h.title} — ${h.source} (${h.source_url})` : `${h.title} — ${h.source}`;
      const body = h.content.length > 800 ? `${h.content.slice(0, 800)}…` : h.content;
      s += `${i + 1}. ${cite}\n${body}\n\n`;
    });
  }
  return s;
}

function encodeSse(obj: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const { conversationId: incomingConvId, message: userText, companyId, language } = parsed.data;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let companyRow: Tables<"companies"> | null = null;
  if (companyId) {
    const { data: c } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .eq("user_id", user.id)
      .maybeSingle();
    companyRow = c;
  }

  let ragHits: KnowledgeHit[] = [];
  try {
    ragHits = await searchKnowledgeBase(userText, undefined, 5);
  } catch (e) {
    console.error("[chat] RAG failed:", e);
  }

  const systemPrompt = buildSystemPrompt(language, companyRow, ragHits);

  let conversationId = incomingConvId ?? null;

  if (conversationId) {
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
  } else {
    const { data: created, error: insErr } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        company_id: companyId ?? null,
        title: "New conversation",
      })
      .select("id")
      .single();
    if (insErr || !created) {
      return NextResponse.json({ error: "Could not create conversation" }, { status: 500 });
    }
    conversationId = created.id;
  }

  const { data: historyRows } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId!)
    .order("created_at", { ascending: false })
    .limit(20);

  const historyChrono = (historyRows ?? []).reverse();

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
  ];
  for (const row of historyChrono) {
    if (row.role !== "user" && row.role !== "assistant") continue;
    messages.push({
      role: row.role as "user" | "assistant",
      content: row.content,
    });
  }
  messages.push({ role: "user", content: userText });

  const openai = getOpenAIClient();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(encodeSse(obj));
      };

      send({ type: "conversation", id: conversationId });

      const toolCallsLog: { name: string; input: unknown; output: string }[] = [];
      let assistantFullText = "";
      let totalTokens = 0;

      try {
        let round = 0;
        while (round < 10) {
          round++;

          const completion = await openai.chat.completions.create({
            model: AI_MODEL,
            max_tokens: 8192,
            messages,
            tools: BIZMATE_TOOLS,
            stream: true,
          });

          // Accumulate streamed response
          let finishReason: string | null = null;
          const pendingToolCalls: Map<number, { id: string; name: string; arguments: string }> = new Map();

          for await (const chunk of completion) {
            const choice = chunk.choices[0];
            if (!choice) continue;

            // Track usage from final chunk
            if (chunk.usage) {
              totalTokens += (chunk.usage.prompt_tokens ?? 0) + (chunk.usage.completion_tokens ?? 0);
            }

            const delta = choice.delta;

            // Stream text content
            if (delta?.content) {
              assistantFullText += delta.content;
              send({ type: "text", delta: delta.content });
            }

            // Accumulate tool calls from deltas
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index;
                if (!pendingToolCalls.has(idx)) {
                  pendingToolCalls.set(idx, {
                    id: tc.id ?? "",
                    name: tc.function?.name ?? "",
                    arguments: tc.function?.arguments ?? "",
                  });
                } else {
                  const existing = pendingToolCalls.get(idx)!;
                  if (tc.id) existing.id = tc.id;
                  if (tc.function?.name) existing.name += tc.function.name;
                  if (tc.function?.arguments) existing.arguments += tc.function.arguments;
                }
              }
            }

            if (choice.finish_reason) {
              finishReason = choice.finish_reason;
            }
          }

          // If no tool calls, we're done
          if (finishReason !== "tool_calls" || pendingToolCalls.size === 0) {
            break;
          }

          // Build assistant message with tool calls for conversation history
          const toolCallsForMessage: ChatCompletionMessageToolCall[] = [];
          for (const [, tc] of pendingToolCalls) {
            toolCallsForMessage.push({
              id: tc.id,
              type: "function",
              function: { name: tc.name, arguments: tc.arguments },
            });
          }

          messages.push({
            role: "assistant",
            content: assistantFullText || null,
            tool_calls: toolCallsForMessage,
          });

          // Execute each tool and add results
          for (const [, tc] of pendingToolCalls) {
            let inputObj: Record<string, unknown> = {};
            try {
              inputObj = JSON.parse(tc.arguments);
            } catch {
              inputObj = {};
            }

            send({ type: "tool_start", name: tc.name, input: inputObj });
            const out = await executeBizmateToolWithContext(tc.name, inputObj, companyRow);
            send({ type: "tool_result", name: tc.name, result: out });
            toolCallsLog.push({ name: tc.name, input: inputObj, output: out });

            messages.push({
              role: "tool",
              tool_call_id: tc.id,
              content: out,
            });
          }

          // Reset text for next round (tool response round may produce more text)
          assistantFullText = "";
        }

        // Save user message
        const { error: userInsErr } = await supabase.from("messages").insert({
          conversation_id: conversationId!,
          role: "user",
          content: userText,
        });
        if (userInsErr) console.error("[chat] save user message:", userInsErr);

        // Save assistant message
        const sourcesPayload = ragHits.map((h) => ({
          title: h.title,
          source: h.source,
          source_url: h.source_url,
          snippet: h.content.slice(0, 400),
        }));

        const { error: asstInsErr } = await supabase.from("messages").insert({
          conversation_id: conversationId!,
          role: "assistant",
          content: assistantFullText || "(no text)",
          sources: (sourcesPayload.length ? sourcesPayload : null) as Json | null,
          tool_calls: (toolCallsLog.length
            ? JSON.parse(JSON.stringify(toolCallsLog))
            : null) as Json | null,
          tokens_used: totalTokens || null,
        });
        if (asstInsErr) console.error("[chat] save assistant message:", asstInsErr);

        // Update conversation timestamp
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId!);

        // Auto-title from first message
        const { data: convMeta } = await supabase
          .from("conversations")
          .select("title")
          .eq("id", conversationId!)
          .single();

        if (convMeta?.title === "New conversation") {
          const title =
            userText.trim().length > 56
              ? `${userText.trim().slice(0, 56)}…`
              : userText.trim();
          await supabase.from("conversations").update({ title }).eq("id", conversationId!);
        }

        send({ type: "done" });
      } catch (err) {
        console.error("[chat] stream error:", err);
        send({
          type: "error",
          message: "An error occurred. Please try again.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
