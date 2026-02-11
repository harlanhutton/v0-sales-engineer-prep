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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Mock Interview Q&A
        </h2>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat)
                setCurrentIndex(0)
                setShowGuidance(false)
                setShowFramework(false)
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {/* Question header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold tracking-wide uppercase ${catInfo.color}`}
              >
                {catInfo.label}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {currentIndex + 1} of {filteredQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={goPrev}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Previous question"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goNext}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Next question"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="px-6 py-8">
          <p className="text-xl font-medium leading-relaxed text-foreground">
            {`"${current.question}"`}
          </p>
        </div>

        {/* Actions */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              {showGuidance ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showGuidance ? "Hide Guidance" : "Show Guidance"}
            </button>
            <button
              onClick={() => setShowFramework(!showFramework)}
              className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              <Lightbulb className="h-4 w-4" />
              {showFramework ? "Hide Framework" : "Answer Framework"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Guidance */}
        {showGuidance && (
          <div className="border-t border-border px-6 py-4">
            <div className="rounded-md bg-primary/5 border border-primary/10 px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-2">
                Guidance Notes
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {current.guidanceNotes}
              </p>
            </div>
          </div>
        )}

        {/* Framework */}
        {showFramework && (
          <div className="border-t border-border px-6 py-4">
            <div className="rounded-md bg-secondary px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
                Sample Answer Framework
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {current.sampleFramework}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* All questions list */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          All Questions
        </h3>
        <div className="flex flex-col gap-1">
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
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  i === currentIndex
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`flex-shrink-0 text-xs font-medium ${qCatInfo.color}`}
                >
                  {qCatInfo.label}
                </span>
                <span className="truncate">{q.question}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
