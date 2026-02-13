"use client"

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
  { id: "chat", label: "AI Chat" },
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
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-0">
        <div className="flex flex-col gap-10">
          {/* Title block */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <svg width="28" height="24" viewBox="0 0 76 65" fill="currentColor" aria-hidden="true">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span className="text-sm font-pixel tracking-widest uppercase">Vercel</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground font-mono sm:text-5xl">
                {"Harlan Hutton's"}
                <br />
                <span className="text-muted-foreground">Interview Prep</span>
              </h1>
              <p className="text-base text-muted-foreground font-pixel">
                Sales Engineer, Startups
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-5xl font-bold tabular-nums text-foreground font-mono tracking-tighter sm:text-6xl">
                {progressPercent}
                <span className="text-muted-foreground text-3xl sm:text-4xl ml-1">%</span>
              </span>
              <span className="text-xs text-muted-foreground font-mono tabular-nums">
                {completedCount}/{totalCount} completed
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-3">
            <div className="h-px w-full bg-border" />
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-1 bg-foreground rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-0 -mb-px" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-5 py-3 text-sm font-mono font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
