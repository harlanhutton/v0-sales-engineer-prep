"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { KNOWLEDGE_CARDS, CATEGORIES, type KnowledgeCard } from "@/lib/prep-data"

interface KnowledgeCardComponentProps {
  card: KnowledgeCard
  index: number
}

function KnowledgeCardComponent({ card, index }: KnowledgeCardComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTalkingPoints, setShowTalkingPoints] = useState(false)

  const catInfo = CATEGORIES[card.category as keyof typeof CATEGORIES]

  return (
    <div className="border border-border rounded-sm overflow-hidden transition-colors hover:border-muted-foreground/40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-4 px-4 py-4 text-left bg-transparent"
      >
        <span className="w-6 text-right text-xs font-mono text-muted-foreground tabular-nums flex-shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
              {catInfo.label}
            </span>
          </div>
          <h3 className="text-base font-mono font-semibold text-foreground">
            {card.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {card.summary}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0 text-muted-foreground">
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-4 pl-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
                Key Details
              </span>
              <ul className="flex flex-col gap-1.5">
                {card.details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="text-border mt-1 flex-shrink-0">{">"}</span>
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
                  className="flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase text-foreground transition-colors hover:text-muted-foreground bg-transparent"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {showTalkingPoints
                    ? "Hide Talking Points"
                    : "Show Talking Points"}
                </button>
                {showTalkingPoints && (
                  <div className="rounded-sm bg-secondary border border-border px-4 py-3">
                    <ul className="flex flex-col gap-2">
                      {card.talkingPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
                        >
                          <span className="text-muted-foreground flex-shrink-0 font-mono">{`${i + 1}.`}</span>
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
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

      <div className="flex flex-col gap-3">
        {filteredCards.map((card, i) => (
          <KnowledgeCardComponent key={card.id} card={card} index={i} />
        ))}
      </div>
    </div>
  )
}
