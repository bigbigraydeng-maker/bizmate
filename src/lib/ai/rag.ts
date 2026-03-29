import { createClient } from "@supabase/supabase-js";

import { embedText } from "./embeddings";
import type { Database } from "@/lib/supabase/types";

function getSupabaseForRag() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (service) {
    return createClient<Database>(url, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  console.warn("[RAG] SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon key. RAG results may be empty.");
  return createClient<Database>(url, anon);
}

export type KnowledgeHit = {
  id: string;
  source: string;
  source_url: string | null;
  title: string;
  content: string;
  content_zh: string | null;
  category: string | null;
  similarity: number;
};

/**
 * Semantic search over knowledge_documents (pgvector cosine via RPC).
 * Server-side only — requires OPENAI_API_KEY and SUPABASE_SERVICE_ROLE_KEY.
 */
export async function searchKnowledgeBase(
  query: string,
  category?: string | null,
  limit = 5,
): Promise<KnowledgeHit[]> {
  const q = query.trim();
  if (!q) return [];

  const embedding = await embedText(q);
  const supabase = getSupabaseForRag();

  const { data, error } = await supabase.rpc("match_knowledge_documents", {
    query_embedding: JSON.stringify(embedding),
    match_count: limit,
    filter_category: category ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Array<{
    id: string;
    source: string;
    source_url: string | null;
    title: string;
    content: string;
    content_zh: string | null;
    category: string | null;
    similarity: number;
  }>;

  return rows.map((r) => ({
    id: r.id,
    source: r.source,
    source_url: r.source_url,
    title: r.title,
    content: r.content,
    content_zh: r.content_zh,
    category: r.category,
    similarity: r.similarity,
  }));
}
