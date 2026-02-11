"use client"

import { Check, Circle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { ACTION_ITEMS, CATEGORIES, type ActionItem } from "@/lib/prep-data"

interface ActionItemsProps {
  completedIds: Set<string>
  onToggle: (id: string) => void
}

const CATEGORY_ORDER = ["vercel", "technical", "sales", "narrative"] as const

function PriorityBadge({ priority }: { priority: ActionItem["priority"] }) {
  const styles = {
    high: "bg-primary/15 text-primary",
    medium: "bg-warning/15 text-warning",
    low: "bg-muted text-muted-foreground",
  }
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  )
}

function ActionItemRow({
  item,
  isCompleted,
  onToggle,
}: {
  item: ActionItem
  isCompleted: boolean
  onToggle: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`group border-b border-border last:border-b-0 transition-colors ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          className="mt-0.5 flex-shrink-0"
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium leading-snug ${
                isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {item.title}
            </span>
            <PriorityBadge priority={item.priority} />
          </div>

          {item.dueContext && (
            <span className="text-xs text-muted-foreground">
              {item.dueContext}
            </span>
          )}

          {isExpanded && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-0.5 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Action Items</h2>
        <div className="flex gap-1">
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
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([category, items]) => {
        const catKey = category as keyof typeof CATEGORIES
        const catInfo = CATEGORIES[catKey]
        const completed = items.filter((i) => completedIds.has(i.id)).length

        return (
          <div key={category} className="flex flex-col gap-0">
            <div className="flex items-center justify-between px-4 py-2">
              <span className={`text-xs font-semibold tracking-wide uppercase ${catInfo.color}`}>
                {catInfo.label}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {completed}/{items.length}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-card">
              {items.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  isCompleted={completedIds.has(item.id)}
                  onToggle={() => onToggle(item.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
