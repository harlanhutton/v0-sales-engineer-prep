"use client"

import { useState, useRef } from "react"
import { GripVertical, Trash2, Plus, Link, Type, CheckSquare, FileUp, ExternalLink, Upload, X, Check, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type {
  Block,
  BlockType,
  TextContent,
  LinkContent,
  ChecklistContent,
  ChecklistItem,
  FileContent,
} from "@/hooks/use-blocks"

// ─── Add Block Button ────────────────────────────────────────────────

interface AddBlockButtonProps {
  onAdd: (type: BlockType, content: Block["content"]) => void
  onUploadFile?: (file: File) => Promise<string | null>
}

export function AddBlockButton({ onAdd, onUploadFile }: AddBlockButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAddText() {
    onAdd("text", { text: "" } as TextContent)
  }

  function handleAddLink() {
    onAdd("link", { url: "", title: "", description: "" } as LinkContent)
  }

  function handleAddChecklist() {
    onAdd("checklist", {
      items: [{ id: crypto.randomUUID(), text: "", checked: false }],
    } as ChecklistContent)
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !onUploadFile) return

    const url = await onUploadFile(file)
    if (url) {
      onAdd("file", {
        fileName: file.name,
        fileUrl: url,
        fileSize: file.size,
        mimeType: file.type,
      } as FileContent)
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="font-mono">
          <DropdownMenuItem onClick={handleAddText} className="gap-2 text-xs">
            <Type className="h-3.5 w-3.5" />
            Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddLink} className="gap-2 text-xs">
            <Link className="h-3.5 w-3.5" />
            Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddChecklist} className="gap-2 text-xs">
            <CheckSquare className="h-3.5 w-3.5" />
            Checklist
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs"
          >
            <FileUp className="h-3.5 w-3.5" />
            File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
        aria-label="Upload file"
      />
    </div>
  )
}

// ─── Text Block ──────────────────────────────────────────────────────

interface TextBlockProps {
  content: TextContent
  onUpdate: (content: TextContent) => void
}

function TextBlock({ content, onUpdate }: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(!content.text)
  const [text, setText] = useState(content.text)

  function handleSave() {
    onUpdate({ text })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your notes..."
          className="min-h-[80px] font-mono text-sm bg-secondary/50 border-border resize-y"
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleSave} className="gap-1.5 text-xs font-mono">
            <Check className="h-3 w-3" />
            Save
          </Button>
          {content.text && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setText(content.text)
                setIsEditing(false)
              }}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="group/text cursor-pointer rounded px-3 py-2 hover:bg-secondary/50 transition-colors"
      onClick={() => setIsEditing(true)}
    >
      <p className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
        {content.text || <span className="text-muted-foreground italic">{"Click to add text..."}</span>}
      </p>
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/text:opacity-100 transition-opacity mt-1" />
    </div>
  )
}

// ─── Link Block ──────────────────────────────────────────────────────

interface LinkBlockProps {
  content: LinkContent
  onUpdate: (content: LinkContent) => void
}

function LinkBlock({ content, onUpdate }: LinkBlockProps) {
  const [isEditing, setIsEditing] = useState(!content.url)
  const [url, setUrl] = useState(content.url)
  const [title, setTitle] = useState(content.title)
  const [description, setDescription] = useState(content.description ?? "")

  function handleSave() {
    onUpdate({ url, title: title || url, description })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="font-mono text-sm bg-secondary/50"
          autoFocus
        />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Link title (optional)"
          className="font-mono text-sm bg-secondary/50"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="font-mono text-sm bg-secondary/50"
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleSave} className="gap-1.5 text-xs font-mono">
            <Check className="h-3 w-3" />
            Save
          </Button>
          {content.url && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setUrl(content.url)
                setTitle(content.title)
                setDescription(content.description ?? "")
                setIsEditing(false)
              }}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="group/link flex items-start gap-3 rounded border border-border bg-secondary/30 px-3 py-2.5 hover:bg-secondary/50 transition-colors">
      <ExternalLink className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-foreground hover:underline underline-offset-2"
        >
          {content.title || content.url}
        </a>
        {content.description && (
          <p className="font-mono text-xs text-muted-foreground mt-0.5 truncate">{content.description}</p>
        )}
        <p className="font-mono text-xs text-muted-foreground/60 mt-0.5 truncate">{content.url}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover/link:opacity-100 transition-opacity"
        aria-label="Edit link"
      >
        <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      </button>
    </div>
  )
}

// ─── Checklist Block ─────────────────────────────────────────────────

interface ChecklistBlockProps {
  content: ChecklistContent
  onUpdate: (content: ChecklistContent) => void
}

function ChecklistBlock({ content, onUpdate }: ChecklistBlockProps) {
  const [newItemText, setNewItemText] = useState("")

  function toggleItem(itemId: string) {
    const updated = content.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    )
    onUpdate({ items: updated })
  }

  function updateItemText(itemId: string, text: string) {
    const updated = content.items.map((item) =>
      item.id === itemId ? { ...item, text } : item
    )
    onUpdate({ items: updated })
  }

  function removeItem(itemId: string) {
    const updated = content.items.filter((item) => item.id !== itemId)
    onUpdate({ items: updated })
  }

  function addItem() {
    if (!newItemText.trim()) return
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      checked: false,
    }
    onUpdate({ items: [...content.items, newItem] })
    setNewItemText("")
  }

  return (
    <div className="flex flex-col gap-1">
      {content.items.map((item) => (
        <div key={item.id} className="group/check flex items-center gap-2 rounded px-1 py-0.5 hover:bg-secondary/50 transition-colors">
          <Checkbox
            checked={item.checked}
            onCheckedChange={() => toggleItem(item.id)}
            className="shrink-0"
          />
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItemText(item.id, e.target.value)}
            placeholder="Checklist item..."
            className={`flex-1 bg-transparent font-mono text-sm outline-none ${
              item.checked ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          />
          <button
            onClick={() => removeItem(item.id)}
            className="opacity-0 group-hover/check:opacity-100 transition-opacity"
            aria-label="Remove item"
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 px-1 py-0.5">
        <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem()
          }}
          placeholder="Add item..."
          className="flex-1 bg-transparent font-mono text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  )
}

// ─── File Block ──────────────────────────────────────────────────────

interface FileBlockProps {
  content: FileContent
}

function FileBlock({ content }: FileBlockProps) {
  const isImage = content.mimeType?.startsWith("image/")
  const sizeStr = content.fileSize
    ? content.fileSize < 1024 * 1024
      ? `${(content.fileSize / 1024).toFixed(1)} KB`
      : `${(content.fileSize / (1024 * 1024)).toFixed(1)} MB`
    : null

  return (
    <div className="flex flex-col gap-2">
      {isImage && (
        <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={content.fileUrl}
            alt={content.fileName}
            className="max-h-64 rounded border border-border object-contain"
          />
        </a>
      )}
      <div className="flex items-center gap-3 rounded border border-border bg-secondary/30 px-3 py-2.5">
        <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <a
            href={content.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-foreground hover:underline underline-offset-2"
          >
            {content.fileName}
          </a>
          {sizeStr && (
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{sizeStr}</p>
          )}
        </div>
        <a
          href={content.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Download file"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

// ─── Sortable Block Wrapper ──────────────────────────────────────────

interface SortableBlockProps {
  block: Block
  onUpdate: (content: Block["content"]) => void
  onDelete: () => void
}

function SortableBlock({ block, onUpdate, onDelete }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/block flex gap-2 rounded-md border border-border bg-card p-3 transition-colors hover:border-muted-foreground/20"
    >
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-muted-foreground/40 hover:text-destructive opacity-0 group-hover/block:opacity-100 transition-opacity"
          aria-label="Delete block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        {block.type === "text" && (
          <TextBlock content={block.content as TextContent} onUpdate={onUpdate} />
        )}
        {block.type === "link" && (
          <LinkBlock content={block.content as LinkContent} onUpdate={onUpdate} />
        )}
        {block.type === "checklist" && (
          <ChecklistBlock content={block.content as ChecklistContent} onUpdate={onUpdate} />
        )}
        {block.type === "file" && (
          <FileBlock content={block.content as FileContent} />
        )}
      </div>
    </div>
  )
}

// ─── Block List ──────────────────────────────────────────────────────

interface BlockListProps {
  blocks: Block[]
  onUpdate: (blockId: string, content: Block["content"]) => void
  onDelete: (blockId: string) => void
  onReorder: (reordered: Block[]) => void
  onAdd: (type: BlockType, content: Block["content"]) => void
  onUploadFile?: (file: File) => Promise<string | null>
}

export function BlockList({
  blocks,
  onUpdate,
  onDelete,
  onReorder,
  onAdd,
  onUploadFile,
}: BlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      sortOrder: i,
    }))
    onReorder(reordered)
  }

  return (
    <div className="flex flex-col gap-3">
      {blocks.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={(content) => onUpdate(block.id, content)}
                onDelete={() => onDelete(block.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
      <AddBlockButton onAdd={onAdd} onUploadFile={onUploadFile} />
    </div>
  )
}
