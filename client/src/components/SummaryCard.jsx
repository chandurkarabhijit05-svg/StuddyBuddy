import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Copy,
  Check,
  Download,
  Sparkles,
  FileText,
  Clock,
  AlignLeft,
  Type,
  ChevronDown,
  ChevronUp,
  Share2,
  Highlighter,
  Zap,
  Maximize2,
  Minimize2,
  Lightbulb,
} from "lucide-react";

// ─── Simple Markdown Renderer ────────────────────────────
function MarkdownRenderer({ content }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        // Heading
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="text-xl font-bold text-white mt-6 mb-3">
              {line.replace("# ", "")}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg font-bold text-slate-200 mt-5 mb-2 flex items-center gap-2">
              <div className="w-1 h-5 bg-violet-400 rounded-full" />
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-slate-300 mt-4 mb-2">
              {line.replace("### ", "")}
            </h3>
          );
        }

        // Bullet points
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-3 pl-2">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              <p className="text-sm text-slate-300 leading-relaxed">
                {line.replace(/^[-*]\s/, "")}
              </p>
            </div>
          );
        }

        // Numbered list
        if (line.match(/^\d+\.\s/)) {
          const num = line.match(/^\d+/)[0];
          return (
            <div key={i} className="flex items-start gap-3 pl-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {num}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {line.replace(/^\d+\.\s/, "")}
              </p>
            </div>
          );
        }

        // Bold text
        if (line.includes("**")) {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={i} className="text-sm text-slate-300 leading-relaxed">
              {parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <span key={j} className="font-bold text-violet-300">
                      {part.replace(/\*\*/g, "")}
                    </span>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
            </p>
          );
        }

        // Empty line
        if (!line.trim()) {
          return <div key={i} className="h-2" />;
        }

        // Regular paragraph
        return (
          <p key={i} className="text-sm text-slate-400 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ─── Key Points Extractor ────────────────────────────────
function KeyPoints({ content }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract key sentences (lines with "important", "key", "main", etc.)
  const keyPoints = content
    .split("\n")
    .filter((line) => {
      const lower = line.toLowerCase();
      return (
        lower.includes("key") ||
        lower.includes("important") ||
        lower.includes("main") ||
        lower.includes("conclusion") ||
        lower.includes("summary") ||
        lower.includes("essentially") ||
        line.startsWith("- ") ||
        line.startsWith("* ")
      );
    })
    .slice(0, 5);

  if (keyPoints.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/15 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm font-semibold text-amber-300">Key Takeaways</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-amber-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-amber-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ul className="mt-3 space-y-2">
              {keyPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-amber-100/80"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{point.replace(/^[-*]\s*/, "")}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Reading Progress Bar ────────────────────────────────
function ReadingProgress({ contentRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [contentRef]);

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/50 z-10">
      <motion.div
        className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────
function StatsBar({ content }) {
  const wordCount = content.split(/\s+/).length;
  const charCount = content.length;
  const readTime = Math.ceil(wordCount / 200); // ~200 WPM

  return (
    <div className="flex items-center gap-4 text-xs text-slate-500">
      <span className="flex items-center gap-1.5">
        <Type className="w-3.5 h-3.5" />
        {wordCount.toLocaleString()} words
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-700" />
      <span className="flex items-center gap-1.5">
        <AlignLeft className="w-3.5 h-3.5" />
        {charCount.toLocaleString()} chars
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-700" />
      <span className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        {readTime} min read
      </span>
    </div>
  );
}

// ─── Main SummaryCard Component ────────────────────────────
export default function SummaryCard({ summary }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const contentRef = useRef(null);

  if (!summary) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI-Summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Summary",
          text: summary.slice(0, 200) + "...",
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full mx-auto px-4 py-8 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl overflow-auto" : "max-w-4xl"}`}
    >
      <motion.div
        layout
        className="relative bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl overflow-hidden"
      >
        {/* Reading Progress */}
        <ReadingProgress contentRef={contentRef} />

        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Summary
                  <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-semibold text-violet-400 uppercase tracking-wider">
                    Generated
                  </span>
                </h2>
                <StatsBar content={summary} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRaw(!showRaw)}
                className={`p-2.5 rounded-xl transition-all ${
                  showRaw
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:text-white"
                }`}
                title={showRaw ? "Formatted view" : "Raw view"}
              >
                <FileText className="w-4 h-4" />
              </motion.button>

              {/* Copy */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 transition-all"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 transition-all"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              {/* Download */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-500/40 transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </motion.button>

              {/* Fullscreen */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 transition-all"
                title="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className={`overflow-y-auto px-6 py-6 ${isFullscreen ? "h-[calc(100vh-80px)]" : "max-h-[600px]"}`}
        >
          {/* Key Takeaways */}
          <KeyPoints content={summary} />

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {showRaw ? (
              <motion.pre
                key="raw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed"
              >
                {summary}
              </motion.pre>
            ) : (
              <motion.div
                key="formatted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MarkdownRenderer content={summary} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-slate-500">Generated by StudyBuddy AI</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              {isCopied ? "Copied!" : "Copy full text"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}