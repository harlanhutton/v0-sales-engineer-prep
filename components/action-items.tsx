"use client"

import { Check, Circle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { ACTION_ITEMS, CATEGORIES, type ActionItem } from "@/lib/prep-data"

interface ActionItemsProps {
  completedIds: Set<string>
  onToggle: (id: string) => void
}

const CATEGORY_ORDER = ["vercel", "technical", "sales", "narrative"] as const

function PriorityIndicator({ priority }: { priority: ActionItem["priority"] }) {
  const styles = {
    high: "bg-foreground",
    medium: "bg-muted-foreground",
    low: "bg-border",
  }
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${styles[priority]}`}
      title={`${priority} priority`}
    />
  )
}

function ActionItemRow({
  item,
  index,
  isCompleted,
  onToggle,
}: {
  item: ActionItem
  index: number
  isCompleted: boolean
  onToggle: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`group transition-colors border-b border-border last:border-b-0 hover:bg-secondary/50 ${
        isCompleted ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Row number */}
        <span className="w-6 text-right text-xs font-mono text-muted-foreground tabular-nums flex-shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Checkbox */}
        <button
          onClick={onToggle}
          className="flex-shrink-0"
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-foreground bg-foreground">
              <Check className="h-2.5 w-2.5 text-background" />
            </div>
          ) : (
            <div className="h-4 w-4 rounded-sm border border-border transition-colors group-hover:border-muted-foreground" />
          )}
        </button>

        {/* Content */}
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <span
            className={`text-sm font-medium font-mono leading-snug truncate ${
              isCompleted
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {item.title}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <PriorityIndicator priority={item.priority} />
          {item.dueContext && (
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {item.dueContext}
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-3 pl-[4.5rem]">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      )}
    </div>
  )
}

export function ActionItems({ completedIds, onToggle }: ActionItemsProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredItems =
    filter === "all"
      ? ACTION_ITEMS
      : ACTION_ITEMS.filter((item) => item.category === filter)

  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const items = filteredItems.filter((item) => item.category === cat)
      if (items.length > 0) acc[cat] = items
      return acc
    },
    {} as Record<string, ActionItem[]>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: "all", label: "All" },
            ...CATEGORY_ORDER.map((c) => ({
              id: c,
              label: CATEGORIES[c].label,
            })),
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-sm px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                filter === f.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category groups */}
      {Object.entries(grouped).map(([category, items]) => {
        const catKey = category as keyof typeof CATEGORIES
        const catInfo = CATEGORIES[catKey]
        const completed = items.filter((i) => completedIds.has(i.id)).length
        let runningIndex = 0

        return (
          <div key={category} className="flex flex-col gap-0">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
                {catInfo.label}
              </span>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {completed}/{items.length}
              </span>
            </div>
            <div className="border border-border rounded-sm overflow-hidden">
              {items.map((item) => {
                runningIndex++
                return (
                  <ActionItemRow
                    key={item.id}
                    item={item}
                    index={runningIndex}
                    isCompleted={completedIds.has(item.id)}
                    onToggle={() => onToggle(item.id)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
