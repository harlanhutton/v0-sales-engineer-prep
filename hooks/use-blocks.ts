"use client"

import useSWR from "swr"
import { getSupabaseClient } from "@/lib/supabase/client"

export type BlockType = "text" | "link" | "checklist" | "file"

export interface TextContent {
  text: string
}

export interface LinkContent {
  url: string
  title: string
  description?: string
}

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface ChecklistContent {
  items: ChecklistItem[]
}

export interface FileContent {
  fileName: string
  fileUrl: string
  fileSize?: number
  mimeType?: string
}

export interface Block {
  id: string
  actionItemId: string
  type: BlockType
  content: TextContent | LinkContent | ChecklistContent | FileContent
  sortOrder: number
  createdAt: string
}

interface DbBlock {
  id: string
  action_item_id: string
  type: string
  content: Record<string, unknown>
  sort_order: number
  created_at: string
}

function mapDbToBlock(row: DbBlock): Block {
  return {
    id: row.id,
    actionItemId: row.action_item_id,
    type: row.type as BlockType,
    content: row.content as Block["content"],
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }
}

async function fetchBlocks(actionItemId: string): Promise<Block[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("action_item_id", actionItemId)
    .order("sort_order", { ascending: true })

  if (error || !data) return []
  return (data as DbBlock[]).map(mapDbToBlock)
}

export function useBlocks(actionItemId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    actionItemId ? `blocks-${actionItemId}` : null,
    () => (actionItemId ? fetchBlocks(actionItemId) : []),
    { revalidateOnFocus: false }
  )

  const blocks = data ?? []

  async function addBlock(type: BlockType, content: Block["content"]) {
    if (!actionItemId) return

    const maxOrder = blocks.length > 0 ? Math.max(...blocks.map((b) => b.sortOrder)) : -1
    const tempId = crypto.randomUUID()
    const newBlock: Block = {
      id: tempId,
      actionItemId,
      type,
      content,
      sortOrder: maxOrder + 1,
      createdAt: new Date().toISOString(),
    }

    mutate([...blocks, newBlock], false)

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { data: inserted, error } = await supabase
      .from("blocks")
      .insert({
        action_item_id: actionItemId,
        type,
        content,
        sort_order: maxOrder + 1,
      })
      .select()
      .single()

    if (error) {
      mutate()
      return
    }

    // Replace temp ID with real ID
    mutate(
      blocks
        .filter((b) => b.id !== tempId)
        .concat(mapDbToBlock(inserted as DbBlock)),
      false
    )
  }

  async function updateBlock(blockId: string, content: Block["content"]) {
    mutate(
      blocks.map((b) => (b.id === blockId ? { ...b, content } : b)),
      false
    )

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error } = await supabase
      .from("blocks")
      .update({ content })
      .eq("id", blockId)

    if (error) mutate()
  }

  async function deleteBlock(blockId: string) {
    mutate(
      blocks.filter((b) => b.id !== blockId),
      false
    )

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq("id", blockId)

    if (error) mutate()
  }

  async function reorderBlocks(reorderedBlocks: Block[]) {
    const updated = reorderedBlocks.map((b, i) => ({ ...b, sortOrder: i }))
    mutate(updated, false)

    const supabase = getSupabaseClient()
    if (!supabase) return

    for (const block of updated) {
      const { error } = await supabase
        .from("blocks")
        .update({ sort_order: block.sortOrder })
        .eq("id", block.id)

      if (error) {
        mutate()
        return
      }
    }
  }

  async function uploadFile(file: File): Promise<string | null> {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    const filePath = `${actionItemId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from("block-files")
      .upload(filePath, file)

    if (error) return null

    const { data } = supabase.storage
      .from("block-files")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  return {
    blocks,
    isLoading,
    error,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    uploadFile,
    mutate,
  }
}
