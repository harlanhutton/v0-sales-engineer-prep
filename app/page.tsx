"use client"

import { useState, useEffect, useCallback } from "react"
import { PrepHeader } from "@/components/prep-header"
import { ActionItems } from "@/components/action-items"
import { KnowledgeBase } from "@/components/knowledge-base"
import { MockQuestions } from "@/components/mock-questions"
import { ACTION_ITEMS } from "@/lib/prep-data"

function usePersistedState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string,
  deserialize: (raw: string) => T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored) {
        setState(deserialize(stored))
      }
    } catch {
      // localStorage unavailable
    }
    setIsHydrated(true)
  }, [key, deserialize])

  const setPersistedState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value
        try {
          window.localStorage.setItem(key, serialize(next))
        } catch {
          // localStorage unavailable
        }
        return next
      })
    },
    [key, serialize]
  )

  if (!isHydrated) return [defaultValue, setPersistedState]
  return [state, setPersistedState]
}

const serializeSet = (s: Set<string>) => JSON.stringify([...s])
const deserializeSet = (raw: string) => new Set<string>(JSON.parse(raw))

export default function Home() {
  const [activeTab, setActiveTab] = useState("checklist")
  const [completedIds, setCompletedIds] = usePersistedState<Set<string>>(
    "prep-completed",
    new Set(),
    serializeSet,
    deserializeSet
  )

  const toggleItem = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <PrepHeader
        completedCount={completedIds.size}
        totalCount={ACTION_ITEMS.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="mx-auto max-w-5xl px-6 py-8">
        {activeTab === "checklist" && (
          <ActionItems completedIds={completedIds} onToggle={toggleItem} />
        )}
        {activeTab === "knowledge" && <KnowledgeBase />}
        {activeTab === "practice" && <MockQuestions />}
      </main>
    </div>
  )
}
