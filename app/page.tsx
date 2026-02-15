"use client"

import { useState } from "react"
import { PrepHeader } from "@/components/prep-header"
import { ActionItems } from "@/components/action-items"
import { ActionItemDetail } from "@/components/action-item-detail"
import { KnowledgeBase } from "@/components/knowledge-base"
import { MockQuestions } from "@/components/mock-questions"
import { Chat } from "@/components/chat"
import { Flashcards } from "@/components/flashcards"
import { useActionItems, type ActionItemWithStatus } from "@/hooks/use-action-items"

export default function Home() {
  const [activeTab, setActiveTab] = useState("checklist")
  const [selectedItem, setSelectedItem] = useState<ActionItemWithStatus | null>(null)
  const {
    items,
    completedIds,
    isLoading,
    toggleItem,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
  } = useActionItems()

  // Keep selectedItem in sync with latest data
  const currentItem = selectedItem
    ? items.find((i) => i.id === selectedItem.id) ?? selectedItem
    : null

  function handleItemClick(item: ActionItemWithStatus) {
    setSelectedItem(item)
  }

  function handleBack() {
    setSelectedItem(null)
  }

  // If viewing a detail page, show it instead of the tab content
  if (currentItem) {
    return (
      <div className="min-h-screen bg-background">
        <ActionItemDetail
          item={currentItem}
          onBack={handleBack}
          onToggle={toggleItem}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PrepHeader
        completedCount={completedIds.size}
        totalCount={items.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="mx-auto max-w-5xl px-6 py-10">
        {activeTab === "checklist" && (
          <ActionItems
            items={items}
            completedIds={completedIds}
            isLoading={isLoading}
            onToggle={toggleItem}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onReorder={reorderItems}
            onItemClick={handleItemClick}
          />
        )}
        {activeTab === "knowledge" && <KnowledgeBase />}
        {activeTab === "flashcards" && <Flashcards />}
        {activeTab === "practice" && <MockQuestions />}
        {activeTab === "chat" && <Chat />}
      </main>
    </div>
  )
}
