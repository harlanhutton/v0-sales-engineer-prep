"use client"

import { Triangle } from "lucide-react"

interface PrepHeaderProps {
  completedCount: number
  totalCount: number
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = [
  { id: "checklist", label: "Action Items" },
  { id: "knowledge", label: "Knowledge Base" },
  { id: "practice", label: "Mock Q&A" },
]

export function PrepHeader({
  completedCount,
  totalCount,
  activeTab,
  onTabChange,
}: PrepHeaderProps) {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Triangle className="h-5 w-5 fill-foreground text-foreground" />
                <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                  Interview Prep
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Sales Engineer, Startups
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-3xl font-bold tabular-nums text-foreground">
                {progressPercent}%
              </span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalCount} completed
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-1.5 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <nav className="flex gap-1" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
