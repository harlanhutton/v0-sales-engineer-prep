"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
} from "lucide-react"
import { MOCK_QUESTIONS, CATEGORIES } from "@/lib/prep-data"

export function MockQuestions() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGuidance, setShowGuidance] = useState(false)
  const [showFramework, setShowFramework] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  const filteredQuestions =
    filter === "all"
      ? MOCK_QUESTIONS
      : MOCK_QUESTIONS.filter((q) => q.category === filter)

  const current = filteredQuestions[currentIndex]

  const goNext = () => {
    setShowGuidance(false)
    setShowFramework(false)
    setCurrentIndex((i) => (i + 1) % filteredQuestions.length)
  }

  const goPrev = () => {
    setShowGuidance(false)
    setShowFramework(false)
    setCurrentIndex(
      (i) => (i - 1 + filteredQuestions.length) % filteredQuestions.length
    )
  }

  const reset = () => {
    setShowGuidance(false)
    setShowFramework(false)
  }

  if (!current) return null

  const catInfo = CATEGORIES[current.category as keyof typeof CATEGORIES]
  const categories = ["all", "hr", "behavioral", "technical", "sales"] as const
  const categoryLabels: Record<string, string> = {
    all: "All",
    hr: "HR Screen",
    behavioral: "Behavioral",
    technical: "Technical",
    sales: "Sales",
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Filter */}
      <div className="flex items-center gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat)
              setCurrentIndex(0)
              setShowGuidance(false)
              setShowFramework(false)
            }}
            className={`rounded-sm px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
              filter === cat
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className="border border-border rounded-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
              {catInfo.label}
            </span>
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {currentIndex + 1}/{filteredQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-0">
            <button
              onClick={goPrev}
              className="rounded-sm p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Previous question"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goNext}
              className="rounded-sm p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Next question"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question body */}
        <div className="px-6 py-10">
          <p className="text-2xl font-mono font-medium leading-snug text-foreground tracking-tight sm:text-3xl">
            {`"${current.question}"`}
          </p>
        </div>

        {/* Action bar */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className={`flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-mono font-medium transition-colors ${
                showGuidance
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {showGuidance ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              Guidance
            </button>
            <button
              onClick={() => setShowFramework(!showFramework)}
              className={`flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-mono font-medium transition-colors ${
                showFramework
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Framework
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-mono font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Guidance panel */}
        {showGuidance && (
          <div className="border-t border-border px-6 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
                Guidance Notes
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                {current.guidanceNotes}
              </p>
            </div>
          </div>
        )}

        {/* Framework panel */}
        {showFramework && (
          <div className="border-t border-border px-6 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
                Answer Framework
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                {current.sampleFramework}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Question list */}
      <div className="flex flex-col gap-0">
        <div className="px-4 py-2">
          <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
            All Questions
          </span>
        </div>
        <div className="border border-border rounded-sm overflow-hidden">
          {filteredQuestions.map((q, i) => {
            const qCatInfo =
              CATEGORIES[q.category as keyof typeof CATEGORIES]
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(i)
                  setShowGuidance(false)
                  setShowFramework(false)
                }}
                className={`flex w-full items-center gap-4 border-b border-border last:border-b-0 px-4 py-3 text-left text-sm transition-colors ${
                  i === currentIndex
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span className="w-6 text-right text-xs font-mono tabular-nums flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-shrink-0 text-xs font-mono font-semibold tracking-widest uppercase w-20">
                  {qCatInfo.label}
                </span>
                <span className="truncate font-mono text-sm">{q.question}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
