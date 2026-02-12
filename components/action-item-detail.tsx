"use client"

import { ArrowLeft, Check } from "lucide-react"
import { CATEGORIES } from "@/lib/prep-data"
import type { ActionItemWithStatus } from "@/hooks/use-action-items"
import { useBlocks } from "@/hooks/use-blocks"
import { BlockList } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const PRIORITY_STYLES: Record<string, string> = {
  high: "border-red-500/30 text-red-400",
  medium: "border-yellow-500/30 text-yellow-400",
  low: "border-muted-foreground/30 text-muted-foreground",
}

interface ActionItemDetailProps {
  item: ActionItemWithStatus
  onBack: () => void
  onToggle: (id: string) => void
}

export function ActionItemDetail({ item, onBack, onToggle }: ActionItemDetailProps) {
  const {
    blocks,
    isLoading: blocksLoading,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    uploadFile,
  } = useBlocks(item.id)

  const categoryLabel =
    CATEGORIES[item.category as keyof typeof CATEGORIES]?.label ?? item.category

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back nav */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to checklist
      </button>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(item.id)}
            className={`mt-1 shrink-0 flex h-5 w-5 items-center justify-center rounded border font-mono text-xs transition-colors ${
              item.isCompleted
                ? "border-foreground bg-foreground text-background"
                : "border-muted-foreground/40 hover:border-foreground"
            }`}
            aria-label={item.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {item.isCompleted && <Check className="h-3 w-3" />}
          </button>
          <div className="flex-1">
            <h1
              className={`text-2xl font-bold font-mono tracking-tight ${
                item.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {item.title}
            </h1>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {categoryLabel}
          </Badge>
          <Badge
            variant="outline"
            className={`font-mono text-xs ${PRIORITY_STYLES[item.priority]}`}
          >
            {item.priority}
          </Badge>
          {item.dueContext && (
            <span className="text-xs font-mono text-muted-foreground">
              {item.dueContext}
            </span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-6" />

      {/* Blocks */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Building Blocks
        </h2>

        {blocksLoading ? (
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground py-8">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            Loading...
          </div>
        ) : (
          <BlockList
            blocks={blocks}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
            onReorder={reorderBlocks}
            onAdd={addBlock}
            onUploadFile={uploadFile}
          />
        )}
      </div>
    </div>
  )
}
