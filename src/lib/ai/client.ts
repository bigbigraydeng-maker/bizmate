import OpenAI from "openai";

let client: OpenAI | null = null;

export const AI_MODEL = "gpt-4o";

export function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (!client) {
    client = new OpenAI({ apiKey: key });
  }
  return client;
}
