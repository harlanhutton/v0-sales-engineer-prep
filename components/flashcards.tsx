"use client"

import { useState, useCallback } from "react"
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff } from "lucide-react"
import { FLASHCARDS, FLASHCARD_CATEGORIES, type Flashcard } from "@/lib/flashcard-data"

function FlashcardCard({
  card,
  isFlipped,
  onFlip,
}: {
  card: Flashcard
  isFlipped: boolean
  onFlip: () => void
}) {
  const catLabel = FLASHCARD_CATEGORIES[card.category] ?? card.category

  return (
    <div
      className="perspective-[1000px] w-full cursor-pointer"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onFlip()
        }
      }}
      aria-label={isFlipped ? "Show question" : "Show answer"}
    >
      <div
        className={`relative w-full min-h-[320px] transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front - Question */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-sm border border-border bg-secondary p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
              {catLabel}
            </span>
            <span className="text-xs font-mono text-muted-foreground/60">
              Click to reveal
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <p className="text-xl font-mono font-semibold text-foreground text-center leading-relaxed text-balance">
              {card.question}
            </p>
          </div>
        </div>

        {/* Back - Answer */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-sm border border-success/30 bg-success/5 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono font-semibold tracking-widest text-success uppercase">
              Answer
            </span>
            <span className="text-xs font-mono text-muted-foreground/60">
              Click to flip back
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm font-mono text-foreground leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Flashcards() {
  const [filter, setFilter] = useState<string>("all")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [showMastered, setShowMastered] = useState(true)

  const filteredCards = FLASHCARDS.filter((card) => {
    if (filter !== "all" && card.category !== filter) return false
    if (!showMastered && masteredIds.has(card.id)) return false
    return true
  })

  const currentCard = filteredCards[currentIndex]
  const categories = Object.keys(FLASHCARD_CATEGORIES)

  const goToNext = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex((prev) =>
      filteredCards.length > 0 ? (prev + 1) % filteredCards.length : 0
    )
  }, [filteredCards.length])

  const goToPrev = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex((prev) =>
      filteredCards.length > 0
        ? (prev - 1 + filteredCards.length) % filteredCards.length
        : 0
    )
  }, [filteredCards.length])

  const shuffleCards = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length))
  }, [filteredCards.length])

  const toggleMastered = useCallback(() => {
    if (!currentCard) return
    setMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id)
      } else {
        next.add(currentCard.id)
      }
      return next
    })
  }, [currentCard])

  // Reset index if filter changes and index is out of bounds
  const safeIndex = filteredCards.length > 0 ? currentIndex % filteredCards.length : 0
  if (safeIndex !== currentIndex && filteredCards.length > 0) {
    setCurrentIndex(safeIndex)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`rounded-sm px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
              filter === cat
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {FLASHCARD_CATEGORIES[cat]}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-muted-foreground">
            {filteredCards.length} card{filteredCards.length !== 1 ? "s" : ""}
          </span>
          {masteredIds.size > 0 && (
            <span className="text-xs font-mono text-success">
              {masteredIds.size} mastered
            </span>
          )}
        </div>
        <button
          onClick={() => setShowMastered(!showMastered)}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {showMastered ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          {showMastered ? "Hide mastered" : "Show mastered"}
        </button>
      </div>

      {/* Card area */}
      {filteredCards.length === 0 ? (
        <div className="flex items-center justify-center min-h-[320px] border border-border rounded-sm bg-secondary">
          <p className="text-sm font-mono text-muted-foreground">
            {masteredIds.size > 0 && !showMastered
              ? "All cards mastered! Toggle 'Show mastered' to review again."
              : "No cards in this category."}
          </p>
        </div>
      ) : (
        <>
          <FlashcardCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono text-muted-foreground tabular-nums min-w-[60px] text-center">
                {safeIndex + 1} / {filteredCards.length}
              </span>
              <button
                onClick={goToNext}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
                aria-label="Next card"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={shuffleCards}
                className="flex h-8 items-center gap-1.5 rounded-sm border border-border px-3 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Shuffle
              </button>
              <button
                onClick={toggleMastered}
                className={`flex h-8 items-center gap-1.5 rounded-sm border px-3 text-xs font-mono transition-colors ${
                  currentCard && masteredIds.has(currentCard.id)
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {currentCard && masteredIds.has(currentCard.id)
                  ? "Mastered"
                  : "Mark mastered"}
              </button>
            </div>
          </div>

          {/* Keyboard hints */}
          <div className="flex justify-center gap-4">
            <span className="text-[10px] font-mono text-muted-foreground/40">
              Space to flip
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/40">
              Arrow keys to navigate
            </span>
          </div>
        </>
      )}
    </div>
  )
}
