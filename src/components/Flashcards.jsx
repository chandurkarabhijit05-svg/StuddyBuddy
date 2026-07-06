import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
  Eye,
  EyeOff,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Layers,
} from "lucide-react";

// ─── Parse Flashcards from Raw Text ────────────────────────
function parseFlashcards(rawText) {
  if (!rawText || typeof rawText !== "string") return [];
  
  const cards = [];
  // Match patterns like "**Card 1:**" or "Card 1:" or "### Card 1"
  const cardRegex = /\*\*Card\s*(\d+)[:\*]*\*\*|\bCard\s*(\d+)[:\*]*\b/g;
  
  // Split by card markers
  const parts = rawText.split(/(?=\*\*Card\s*\d+[:\*]*\*\*|\bCard\s*\d+[:\*]*\b)/);
  
  parts.forEach((part) => {
    const frontMatch = part.match(/Front[:\*]*\s*([^\n]+)/i);
    const backMatch = part.match(/Back[:\*]*\s*([^\n]+(?:\n(?!\*\*Card|\bCard\b)[^\n]+)*)/i);
    
    if (frontMatch && backMatch) {
      cards.push({
        front: frontMatch[1].trim(),
        back: backMatch[1].trim(),
      });
    }
  });
  
  // Fallback: try bullet point format
  if (cards.length === 0) {
    const bulletCards = rawText.match(/\*\s*Front:[^\n]*\n\s*\*\s*Back:[^\n]*/g);
    if (bulletCards) {
      bulletCards.forEach((card) => {
        const front = card.match(/\*\s*Front:\s*([^\n]+)/)?.[1]?.trim();
        const back = card.match(/\*\s*Back:\s*([^\n]+)/)?.[1]?.trim();
        if (front && back) cards.push({ front, back });
      });
    }
  }
  
  return cards;
}

// ─── Flashcard Item Component ──────────────────────────────
function FlashcardItem({ card, index, total, onNext, onPrev }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const text = `Q: ${card.front}\n\nA: ${card.back}`;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset flip when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [index]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 rounded-2xl border border-amber-500/20">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Card {index + 1} <span className="text-slate-500">/ {total}</span>
            </p>
            <div className="w-36 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((index + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isBookmarked
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-slate-800/50 text-slate-500 border border-slate-700/30 hover:text-amber-400 hover:border-amber-500/20"
            }`}
          >
            <Bookmark
              className="w-4 h-4"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* The Flashcard */}
      <div
        className="relative h-[420px] sm:h-[380px] cursor-pointer group"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* ─── FRONT SIDE ─── */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="h-full relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 backdrop-blur-2xl border border-amber-500/15 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/20 group-hover:shadow-amber-500/5 group-hover:border-amber-500/25 transition-all duration-500">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
              
              {/* Corner Badge */}
              <div className="absolute top-5 left-5">
                <span className="text-[10px] font-bold text-amber-400/50 uppercase tracking-[0.2em]">
                  Question
                </span>
              </div>
              <div className="absolute top-5 right-5 opacity-30 group-hover:opacity-60 transition-opacity">
                <Eye className="w-4 h-4 text-slate-400" />
              </div>

              {/* Icon */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl" />
                <Lightbulb className="relative w-12 h-12 text-amber-400/70" />
              </div>

              {/* Question Text */}
              <h3 className="relative text-xl sm:text-2xl font-bold text-white leading-relaxed max-w-lg">
                {card.front}
              </h3>

              {/* Flip Hint */}
              <div className="absolute bottom-6 flex items-center gap-2 text-xs text-slate-500 group-hover:text-amber-400/60 transition-colors">
                <RotateCcw className="w-3 h-3 animate-spin-slow" />
                <span>Click to reveal answer</span>
              </div>
            </div>
          </div>

          {/* ─── BACK SIDE ─── */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-full relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950/90 backdrop-blur-2xl border border-emerald-500/15 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/20 group-hover:shadow-emerald-500/5 group-hover:border-emerald-500/25 transition-all duration-500">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
              
              {/* Corner Badge */}
              <div className="absolute top-5 left-5">
                <span className="text-[10px] font-bold text-emerald-400/50 uppercase tracking-[0.2em]">
                  Answer
                </span>
              </div>
              <div className="absolute top-5 right-5 opacity-30 group-hover:opacity-60 transition-opacity">
                <EyeOff className="w-4 h-4 text-slate-400" />
              </div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl" />
                <Sparkles className="relative w-10 h-10 text-emerald-400/70" />
              </div>

              {/* Answer Text */}
              <p className="relative text-lg sm:text-xl text-emerald-50/90 leading-relaxed max-w-lg font-medium">
                {card.back}
              </p>

              {/* Success Badge */}
              <div className="absolute bottom-6 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  Great job! Keep going
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          disabled={index === 0}
          className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-500/40 hover:bg-slate-700/60 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
          className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center gap-2.5"
        >
          <RotateCcw className={`w-4 h-4 transition-transform duration-300 ${isFlipped ? "rotate-180" : ""}`} />
          {isFlipped ? "Show Question" : "Reveal Answer"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={index === total - 1}
          className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-500/40 hover:bg-slate-700/60 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Card Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              // You can add a jump-to-card function here
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-amber-400"
                : "w-1.5 bg-slate-700 hover:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div className="relative inline-flex mb-6">
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl" />
        <div className="relative p-5 bg-slate-800/50 border border-slate-700/30 rounded-3xl">
          <Layers className="w-10 h-10 text-slate-500" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-300 mb-2">
        No Flashcards Yet
      </h3>
      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
        Upload a PDF and generate flashcards to start your interactive study session.
      </p>
    </motion.div>
  );
}

// ─── Main Flashcards Component ─────────────────────────────
export default function Flashcards({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse the raw text into structured cards
  const cards = useMemo(() => parseFlashcards(flashcards), [flashcards]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!cards || cards.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/8 rounded-full border border-amber-500/15 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400/80">
            Interactive Study Mode
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Flashcards
        </h2>
        <p className="text-slate-500 text-sm">
          Click to flip • Arrow keys to navigate • Space to flip
        </p>
      </motion.div>

      {/* Card Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <FlashcardItem
            card={cards[currentIndex]}
            index={currentIndex}
            total={cards.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </motion.div>
      </AnimatePresence>

      {/* Keyboard Shortcuts */}
      <div className="flex justify-center mt-8 gap-6 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-1 bg-slate-800/70 rounded-md border border-slate-700/50 text-slate-500 font-mono">
            ← →
          </kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-1 bg-slate-800/70 rounded-md border border-slate-700/50 text-slate-500 font-mono">
            Click
          </kbd>
          Flip Card
        </span>
      </div>
    </section>
  );
}