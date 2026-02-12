import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

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

export async function POST(req: Request) {
  try {
    // Challenge 1: Destructure mode alongside messages from the request body
    const { messages, mode }: { messages: UIMessage[]; mode?: string } = await req.json()

    const result = streamText({
      model: "openai/gpt-4o-mini",
      // Challenge 1: Look up the system prompt by mode, with a fallback
      system: SYSTEM_PROMPTS[mode ?? "interview-prep"] ?? SYSTEM_PROMPTS["interview-prep"],
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred"
    console.error("[chat] Error:", message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
