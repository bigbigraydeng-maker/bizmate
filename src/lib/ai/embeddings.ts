import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

/** text-embedding-3-small — 1536 dimensions (matches knowledge_documents.embedding). */
export async function embedText(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("embedText: empty input");
  }
  const res = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: trimmed,
  });
  const vec = res.data[0]?.embedding;
  if (!vec || vec.length !== 1536) {
    throw new Error("Unexpected embedding dimensions");
  }
  return vec;
}
