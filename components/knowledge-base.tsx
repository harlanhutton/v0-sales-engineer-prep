"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MessageSquare, BookOpen } from "lucide-react"
import { KNOWLEDGE_CARDS, CATEGORIES, type KnowledgeCard } from "@/lib/prep-data"

interface KnowledgeCardComponentProps {
  card: KnowledgeCard
}

function KnowledgeCardComponent({ card }: KnowledgeCardComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTalkingPoints, setShowTalkingPoints] = useState(false)

  const catInfo = CATEGORIES[card.category as keyof typeof CATEGORIES]

  return (
    <div className="rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between px-5 py-4 text-left"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold tracking-wide uppercase ${catInfo.color}`}
            >
              {catInfo.label}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {card.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {card.summary}
          </p>
        </div>
        <div className="ml-4 mt-1 flex-shrink-0 text-muted-foreground">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-5 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BookOpen className="h-4 w-4" />
                Key Details
              </div>
              <ul className="flex flex-col gap-1.5 pl-6">
                {card.details.map((detail, i) => (
                  <li
                    key={i}
                    className="list-disc text-sm leading-relaxed text-muted-foreground"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {card.talkingPoints && card.talkingPoints.length > 0 && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTalkingPoints(!showTalkingPoints)
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <MessageSquare className="h-4 w-4" />
                  {showTalkingPoints
                    ? "Hide Talking Points"
                    : "Show Talking Points"}
                </button>
                {showTalkingPoints && (
                  <div className="rounded-md bg-primary/5 border border-primary/10 px-4 py-3">
                    <ul className="flex flex-col gap-2">
                      {card.talkingPoints.map((point, i) => (
                        <li
                          key={i}
                          className="text-sm leading-relaxed text-foreground"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function KnowledgeBase() {
  const [filter, setFilter] = useState<string>("all")

  const filteredCards =
    filter === "all"
      ? KNOWLEDGE_CARDS
      : KNOWLEDGE_CARDS.filter((card) => card.category === filter)

  const categories = ["all", "vercel", "technical", "sales"] as const
  const categoryLabels: Record<string, string> = {
    all: "All",
    vercel: "Vercel Knowledge",
    technical: "Next.js & React",
    sales: "Sales & Startups",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Knowledge Base
        </h2>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
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

      <div className="flex flex-col gap-3">
        {filteredCards.map((card) => (
          <KnowledgeCardComponent key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
