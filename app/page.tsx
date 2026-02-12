"use client"

import { useState } from "react"
import { PrepHeader } from "@/components/prep-header"
import { ActionItems } from "@/components/action-items"
import { KnowledgeBase } from "@/components/knowledge-base"
import { MockQuestions } from "@/components/mock-questions"
import { useActionItems } from "@/hooks/use-action-items"

export default function Home() {
  const [activeTab, setActiveTab] = useState("checklist")
  const {
    items,
    completedIds,
    isLoading,
    toggleItem,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
  } = useActionItems()

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
            onMove={moveItem}
          />
        )}
        {activeTab === "knowledge" && <KnowledgeBase />}
        {activeTab === "practice" && <MockQuestions />}
      </main>
    </div>
  )
}
