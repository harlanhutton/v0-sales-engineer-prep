import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool
} from "ai"
import { z } from "zod"
import { getSupabaseClient } from "././././lib/supabase/client.ts";

export const maxDuration = 30

// Challenge 1: Map mode keys to system prompts
const SYSTEM_PROMPTS: Record<string, string> = {
  "interview-prep":
    "You are a helpful AI assistant for a software engineer preparing for interviews for the Vercel Sales Engineer position. " +
    "You have deep knowledge of Vercel, Next.js, the AI SDK, serverless architecture, edge computing, " +
    "and frontend development. Help the user practice, learn, and prepare. " +
    "Keep responses concise and actionable.",
  "code-review":
    "You are an expert code reviewer. Analyze code for bugs, performance issues, security concerns, " +
    "and best practices. Give specific, actionable feedback with code examples when helpful. " +
    "Focus on Next.js, React, and TypeScript patterns.",
  "eli5":
    "You explain complex technical concepts in the simplest possible terms, as if explaining to a 5-year-old. " +
    "Use analogies, everyday examples, and avoid jargon. Make it fun and memorable.",
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const addActionItem = tool({
  description: 'A tool to add an action item to the user prep checklist when requested.',
  inputSchema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["vercel", "technical", "sales", "narrative"]),
    priority: z.enum(["high", "medium", "low"])
  }),
  execute: async ({ }) => {
    supabase

    return result;
  },
});

export async function POST(req: Request) {
  const { messages, mode }: { messages: UIMessage[]; mode?: string } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPTS[mode ?? "interview-prep"] ?? SYSTEM_PROMPTS["interview-prep"],
    messages: await convertToModelMessages(messages),
    tools: addActionItem
  })

  return result.toUIMessageStreamResponse()
}
