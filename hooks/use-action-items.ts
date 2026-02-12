"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { getSupabaseClient } from "@/lib/supabase/client"
import { ACTION_ITEMS, type ActionItem } from "@/lib/prep-data"

interface DbActionItem {
  id: string
  category: string
  title: string
  description: string
  priority: string
  due_context: string | null
  is_completed: boolean
  sort_order: number
  created_at: string
}

function mapDbToActionItem(row: DbActionItem): ActionItem & { isCompleted: boolean; sortOrder: number } {
  return {
    id: row.id,
    category: row.category as ActionItem["category"],
    title: row.title,
    description: row.description,
    priority: row.priority as ActionItem["priority"],
    dueContext: row.due_context ?? undefined,
    isCompleted: row.is_completed,
    sortOrder: row.sort_order,
  }
}

export type ActionItemWithStatus = ActionItem & { isCompleted: boolean; sortOrder: number }

function getStaticFallback(): ActionItemWithStatus[] {
  return ACTION_ITEMS.map((item, index) => ({
    ...item,
    isCompleted: false,
    sortOrder: index,
  }))
}

async function fetchActionItems(): Promise<ActionItemWithStatus[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return getStaticFallback()

  const { data, error } = await supabase
    .from("action_items")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) return getStaticFallback()
  if (!data || data.length === 0) return getStaticFallback()
  return (data as DbActionItem[]).map(mapDbToActionItem)
}

function isSupabaseAvailable(): boolean {
  return getSupabaseClient() !== null
}

export function useActionItems() {
  const { data, error, isLoading, mutate } = useSWR("action-items", fetchActionItems, {
    revalidateOnFocus: false,
  })

  const items = data ?? []
  const completedIds = new Set(items.filter((i) => i.isCompleted).map((i) => i.id))

  async function toggleItem(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) return

    const newCompleted = !item.isCompleted

    // Optimistic update
    mutate(
      items.map((i) => (i.id === id ? { ...i, isCompleted: newCompleted } : i)),
      false
    )

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error } = await supabase
      .from("action_items")
      .update({ is_completed: newCompleted })
      .eq("id", id)

    if (error) {
      mutate()
    }
  }

  async function addItem(item: {
    category: ActionItem["category"]
    title: string
    description: string
    priority: ActionItem["priority"]
    dueContext?: string
  }) {
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder)) : -1
    const newId = `${item.category[0]}${Date.now()}`
    const newItem: ActionItemWithStatus = {
      id: newId,
      category: item.category,
      title: item.title,
      description: item.description,
      priority: item.priority,
      dueContext: item.dueContext,
      isCompleted: false,
      sortOrder: maxOrder + 1,
    }

    // Optimistic update
    mutate([...items, newItem], false)

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error } = await supabase.from("action_items").insert({
      id: newId,
      category: item.category,
      title: item.title,
      description: item.description,
      priority: item.priority,
      due_context: item.dueContext ?? null,
      is_completed: false,
      sort_order: maxOrder + 1,
    })

    if (error) {
      mutate()
      throw error
    }
  }

  async function updateItem(
    id: string,
    updates: Partial<{
      title: string
      description: string
      priority: ActionItem["priority"]
      category: ActionItem["category"]
      dueContext: string
    }>
  ) {
    // Optimistic update
    mutate(
      items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      false
    )

    const dbUpdates: Record<string, unknown> = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.dueContext !== undefined) dbUpdates.due_context = updates.dueContext

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error } = await supabase
      .from("action_items")
      .update(dbUpdates)
      .eq("id", id)

    if (error) {
      mutate()
      throw error
    }
  }

  async function deleteItem(id: string) {
    // Optimistic update
    mutate(
      items.filter((i) => i.id !== id),
      false
    )

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error } = await supabase.from("action_items").delete().eq("id", id)

    if (error) {
      mutate()
      throw error
    }
  }

  async function reorderItems(categoryItems: ActionItemWithStatus[], category: string) {
    // Update sort_order for all items in the category
    const updatedItems = items.map((item) => {
      if (item.category !== category) return item
      const reorderedIndex = categoryItems.findIndex((ci) => ci.id === item.id)
      if (reorderedIndex === -1) return item
      return { ...item, sortOrder: categoryItems[reorderedIndex].sortOrder }
    })

    mutate(updatedItems, false)

    const supabase = getSupabaseClient()
    if (!supabase) return

    const updates = categoryItems.map((item, index) => ({
      id: item.id,
      sort_order: item.sortOrder !== undefined ? item.sortOrder : index,
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from("action_items")
        .update({ sort_order: update.sort_order })
        .eq("id", update.id)

      if (error) {
        mutate()
        throw error
      }
    }
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const item = items.find((i) => i.id === id)
    if (!item) return

    // Get items in the same category, sorted by sort_order
    const categoryItems = items
      .filter((i) => i.category === item.category)
      .sort((a, b) => a.sortOrder - b.sortOrder)

    const currentIndex = categoryItems.findIndex((i) => i.id === id)
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (swapIndex < 0 || swapIndex >= categoryItems.length) return

    // Swap sort orders
    const currentOrder = categoryItems[currentIndex].sortOrder
    const swapOrder = categoryItems[swapIndex].sortOrder

    // Optimistic update
    mutate(
      items.map((i) => {
        if (i.id === id) return { ...i, sortOrder: swapOrder }
        if (i.id === categoryItems[swapIndex].id) return { ...i, sortOrder: currentOrder }
        return i
      }),
      false
    )

    const supabase = getSupabaseClient()
    if (!supabase) return

    const { error: err1 } = await supabase
      .from("action_items")
      .update({ sort_order: swapOrder })
      .eq("id", id)

    const { error: err2 } = await supabase
      .from("action_items")
      .update({ sort_order: currentOrder })
      .eq("id", categoryItems[swapIndex].id)

    if (err1 || err2) {
      mutate()
    }
  }

  return {
    items,
    completedIds,
    isLoading,
    error,
    toggleItem,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
    mutate,
  }
}
