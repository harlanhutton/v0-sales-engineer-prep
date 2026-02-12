import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system:
      "You are a helpful AI assistant for a software engineer  preparing for interviews for the Vercel Sales Engineer position. " +
      "You have deep knowledge of Vercel, Next.js, the AI SDK, serverless architecture, edge computing, " +
      "and frontend development. Help the user practice, learn, and prepare. " +
      "Keep responses concise and actionable.",
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
