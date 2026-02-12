import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  UIMessage,
  tool
} from "ai"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase/server"

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

// Challenge 2: Define a tool the AI can call to add action items
const addActionItem = tool({
  description: "Add an action item to the user's SE interview prep checklist. Use this when the user asks to create a task, reminder, or action item.",
  inputSchema: z.object({
    title: z.string().describe("Short title for the action item"),
    description: z.string().describe("Detailed description of what needs to be done"),
    category: z.enum(["vercel", "technical", "sales", "narrative"]).describe("Category of the action item"),
    priority: z.enum(["high", "medium", "low"]).describe("Priority level"),
  }),
  // Challenge 2: The execute function receives the validated args and runs your logic
  execute: async ({ title, description, category, priority }) => {
    console.log("[v0] Tool called - addActionItem:", { title, category, priority })
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      console.error("[v0] Supabase client creation failed")
      return { success: false, error: "Database not available" }
    }

    const id = `${category[0]}${Date.now()}`
    const { error } = await supabase.from("action_items").insert({
      id,
      category,
      title,
      description,
      priority,
      due_context: null,
      is_completed: false,
      sort_order: Date.now(), // puts it at the end
    })

    if (error) {
      console.error("[v0] Supabase insert error:", error.message)
      return { success: false, error: error.message }
    }

    console.log("[v0] Action item inserted successfully:", id)
    // The return value is what the AI "sees" as the tool result
    return { success: true, id, title, category, priority }
  },
});

export async function POST(req: Request) {
  const { messages, mode }: { messages: UIMessage[]; mode?: string } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPTS[mode ?? "interview-prep"] ?? SYSTEM_PROMPTS["interview-prep"],
    messages: await convertToModelMessages(messages),
    tools: { addActionItem },
    // Allow the AI to call tools and then respond with text (up to 3 steps)
    stopWhen: stepCountIs(3),
  })

  return result.toUIMessageStreamResponse()
}
