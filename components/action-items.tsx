"use client"

import { Check, ChevronDown, ChevronUp, MoreHorizontal, Plus, GripVertical, Pencil, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CATEGORIES, type ActionItem } from "@/lib/prep-data"
import type { ActionItemWithStatus } from "@/hooks/use-action-items"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ActionItemsProps {
  items: ActionItemWithStatus[]
  completedIds: Set<string>
  isLoading: boolean
  onToggle: (id: string) => void
  onAdd: (item: {
    category: ActionItem["category"]
    title: string
    description: string
    priority: ActionItem["priority"]
    dueContext?: string
  }) => Promise<void>
  onUpdate: (
    id: string,
    updates: Partial<{
      title: string
      description: string
      priority: ActionItem["priority"]
      category: ActionItem["category"]
      dueContext: string
    }>
  ) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReorder: (reorderedItems: ActionItemWithStatus[], category: string) => Promise<void>
  onItemClick?: (item: ActionItemWithStatus) => void
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

function SortableActionItemRow({
  item,
  index,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
  onItemClick,
}: {
  item: ActionItemWithStatus
  index: number
  isCompleted: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onItemClick?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group transition-colors border-b border-border last:border-b-0 hover:bg-secondary/50 ${
        isCompleted ? "opacity-40" : ""
      } ${isDragging ? "opacity-60 bg-secondary z-10 relative shadow-sm" : ""}`}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Drag handle */}
        <button
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors touch-none"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

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
          <button
            onClick={onItemClick}
            className={`text-sm font-medium font-mono leading-snug truncate text-left hover:underline underline-offset-2 ${
              isCompleted
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {item.title}
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <PriorityIndicator priority={item.priority} />
          {item.dueContext && (
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {item.dueContext}
            </span>
          )}

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Item actions"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        <div className="px-4 pb-3 pl-[5.5rem]">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      )}
    </div>
  )
}

function SortableCategoryGroup({
  category,
  catItems,
  completedIds,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  onItemClick,
  globalStartIndex,
}: {
  category: string
  catItems: ActionItemWithStatus[]
  completedIds: Set<string>
  onToggle: (id: string) => void
  onEdit: (item: ActionItemWithStatus) => void
  onDelete: (id: string) => void
  onReorder: (reorderedItems: ActionItemWithStatus[], category: string) => Promise<void>
  onItemClick?: (item: ActionItemWithStatus) => void
  globalStartIndex: number
}) {
  const catKey = category as keyof typeof CATEGORIES
  const catInfo = CATEGORIES[catKey]
  const completed = catItems.filter((i) => completedIds.has(i.id)).length

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = catItems.findIndex((i) => i.id === active.id)
    const newIndex = catItems.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(catItems, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }))

    onReorder(reordered, category)
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
          {catInfo.label}
        </span>
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          {completed}/{catItems.length}
        </span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={catItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="border border-border rounded-sm overflow-hidden">
            {catItems.map((item, idx) => (
              <SortableActionItemRow
                key={item.id}
                item={item}
                index={globalStartIndex + idx}
                isCompleted={completedIds.has(item.id)}
                onToggle={() => onToggle(item.id)}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
                onItemClick={onItemClick ? () => onItemClick(item) : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

interface ItemFormData {
  title: string
  description: string
  category: ActionItem["category"]
  priority: ActionItem["priority"]
  dueContext: string
}

function ItemFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ItemFormData
  onSubmit: (data: ItemFormData) => Promise<void>
  mode: "add" | "edit"
}) {
  const [form, setForm] = useState<ItemFormData>(
    initialData ?? {
      title: "",
      description: "",
      category: "vercel",
      priority: "medium",
      dueContext: "",
    }
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setIsSaving(true)
    try {
      await onSubmit(form)
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {mode === "add" ? "Add Action Item" : "Edit Action Item"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === "add"
              ? "Fill in the details to create a new action item."
              : "Update the details of this action item."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-xs font-mono">
              Title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className="font-mono text-sm"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-xs font-mono">
              Description
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Additional details..."
              className="font-mono text-sm min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <Label className="text-xs font-mono">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as ActionItem["category"] })}
              >
                <SelectTrigger className="font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_ORDER.map((c) => (
                    <SelectItem key={c} value={c} className="font-mono text-sm">
                      {CATEGORIES[c].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label className="text-xs font-mono">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v as ActionItem["priority"] })}
              >
                <SelectTrigger className="font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="font-mono text-sm">
                    High
                  </SelectItem>
                  <SelectItem value="medium" className="font-mono text-sm">
                    Medium
                  </SelectItem>
                  <SelectItem value="low" className="font-mono text-sm">
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dueContext" className="text-xs font-mono">
              Due context
            </Label>
            <Input
              id="dueContext"
              value={form.dueContext}
              onChange={(e) => setForm({ ...form, dueContext: e.target.value })}
              placeholder="e.g. Before HR screen"
              className="font-mono text-sm"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="font-mono text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.title.trim() || isSaving}
              className="font-mono text-sm"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
              ) : null}
              {mode === "add" ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ActionItems({
  items,
  completedIds,
  isLoading,
  onToggle,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onItemClick,
}: ActionItemsProps) {
  const [filter, setFilter] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActionItemWithStatus | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.category === filter)

  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const catItems = filteredItems
        .filter((item) => item.category === cat)
        .sort((a, b) => a.sortOrder - b.sortOrder)
      if (catItems.length > 0) acc[cat] = catItems
      return acc
    },
    {} as Record<string, ActionItemWithStatus[]>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Compute global start indices per category for continuous numbering
  let runningIndex = 0
  const categoryStartIndices: Record<string, number> = {}
  for (const cat of CATEGORY_ORDER) {
    if (grouped[cat]) {
      categoryStartIndices[cat] = runningIndex
      runningIndex += grouped[cat].length
    }
  }

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAddDialogOpen(true)}
          className="font-mono text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      {/* Category groups with drag-and-drop */}
      {Object.entries(grouped).map(([category, catItems]) => (
        <SortableCategoryGroup
          key={category}
          category={category}
          catItems={catItems}
          completedIds={completedIds}
          onToggle={onToggle}
          onEdit={setEditingItem}
          onDelete={(id) => setDeletingItemId(id)}
          onReorder={onReorder}
          onItemClick={onItemClick}
          globalStartIndex={categoryStartIndices[category] ?? 0}
        />
      ))}

      {/* Add dialog */}
      <ItemFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
        onSubmit={async (data) => {
          await onAdd({
            category: data.category,
            title: data.title,
            description: data.description,
            priority: data.priority,
            dueContext: data.dueContext || undefined,
          })
        }}
      />

      {/* Edit dialog */}
      {editingItem && (
        <ItemFormDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null)
          }}
          mode="edit"
          initialData={{
            title: editingItem.title,
            description: editingItem.description,
            category: editingItem.category,
            priority: editingItem.priority,
            dueContext: editingItem.dueContext ?? "",
          }}
          onSubmit={async (data) => {
            await onUpdate(editingItem.id, {
              title: data.title,
              description: data.description,
              category: data.category,
              priority: data.priority,
              dueContext: data.dueContext,
            })
            setEditingItem(null)
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deletingItemId}
        onOpenChange={(open) => {
          if (!open) setDeletingItemId(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-mono">Delete action item?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This will permanently remove this action item. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeletingItemId(null)}
              className="font-mono text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deletingItemId) {
                  await onDelete(deletingItemId)
                  setDeletingItemId(null)
                }
              }}
              className="font-mono text-sm"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
