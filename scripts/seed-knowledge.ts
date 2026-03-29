/**
 * Seed knowledge_documents with bilingual NZ business snippets + OpenAI embeddings.
 * Run: npm run seed:knowledge
 * Requires: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { resolve } from "path";

import { config } from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import { KNOWLEDGE_SEED_ENTRIES } from "./knowledge-entries";
import type { Database } from "../src/lib/supabase/types";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

async function main() {
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!openaiKey) {
    console.error("Missing OPENAI_API_KEY — add it to .env.local");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const supabase = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let ok = 0;
  for (const row of KNOWLEDGE_SEED_ENTRIES) {
    const embedInput = `${row.title}\n${row.content}\n${row.content_zh}`;
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: embedInput,
    });
    const vec = emb.data[0]?.embedding;
    if (!vec || vec.length !== 1536) {
      console.error("Bad embedding for:", row.title);
      process.exit(1);
    }

    const vectorLiteral = `[${vec.join(",")}]`;
    const { error } = await supabase.from("knowledge_documents").insert({
      source: row.source,
      source_url: row.source_url,
      title: row.title,
      content: row.content,
      content_zh: row.content_zh,
      category: row.category,
      effective_date: row.effective_date,
      embedding: vectorLiteral,
    });

    if (error) {
      console.error("Insert failed:", row.title, error.message);
      process.exit(1);
    }
    ok++;
    console.log("Inserted:", row.title);
  }

  console.log(`Done. ${ok} documents.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
