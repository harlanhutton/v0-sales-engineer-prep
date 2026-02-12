"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Bot, User, Loader2 } from "lucide-react"

// Challenge 1: The three modes and their labels
const MODES = [
  { value: "interview-prep", label: "Interview Prep" },
  { value: "code-review", label: "Code Review" },
  { value: "eli5", label: "Explain Like I'm 5" },
]

export function Chat() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Challenge 1: useState returns [value, setter] - destructure both!
  const [mode, setMode] = useState("interview-prep")
  const modeRef = useRef(mode)
  modeRef.current = mode

  // Stabilize transport so it doesn't re-create on every render
  // Use prepareSendMessagesRequest to inject `mode` into every request body
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: {
            id,
            messages,
            mode: modeRef.current,
          },
        }),
      }),
    []
  )

  const { messages, sendMessage, status, error } = useChat({ transport })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    // Challenge 1: mode is injected via prepareSendMessagesRequest in the transport
    sendMessage({ text: input })
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-320px)] min-h-[400px]">
      {/* Challenge 1: Mode selector - just inline JSX, no nested component needed */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">Mode:</span>
        <div className="flex gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                mode === m.value
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-sm font-mono text-destructive">
          {error.message || error.cause?.toString() || "Something went wrong. Please try again."}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
              <Bot className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-mono text-foreground">AI Chat</h3>
              <p className="text-sm text-muted-foreground font-mono max-w-sm">
                Ask me anything about Vercel, Next.js, the AI SDK, or interview prep.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user"
          const textContent = message.parts
            ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
            .map((part) => part.text)
            .join("") || ""
          const hasContent = textContent.length > 0

          // Skip rendering assistant messages with no content yet (still loading)
          if (!isUser && !hasContent && isLoading) {
            return (
              <div key={message.id} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="bg-secondary border border-border rounded-lg px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )
          }

          if (!isUser && !hasContent) return null

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm font-mono leading-relaxed ${isUser
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground border border-border"
                  }`}
              >
                <span className="whitespace-pre-wrap">{textContent}</span>
              </div>
              {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-foreground mt-0.5">
                  <User className="h-3.5 w-3.5 text-background" />
                </div>
              )}
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border pt-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Vercel, Next.js, AI SDK..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-30"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground font-mono text-center">
          Powered by AI SDK 6 + Vercel AI Gateway
        </p>
      </div>
    </div>
  )
}
