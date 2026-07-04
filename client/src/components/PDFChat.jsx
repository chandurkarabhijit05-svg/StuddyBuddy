import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Trash2,
  Lightbulb,
  Clock,
  CornerDownLeft,
  Paperclip,
  Zap,
} from "lucide-react";

// ─── Message Bubble Component ──────────────────────────────
function MessageBubble({ message, index }) {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-cyan-500"
            : "bg-gradient-to-br from-violet-500 to-purple-600"
        } shadow-lg`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`relative inline-block text-left p-4 rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 text-blue-100"
              : "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/30 text-slate-200"
          } backdrop-blur-sm`}
        >
          {/* Message Text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {message.timestamp}
            </span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-slate-800/80 border border-slate-700/30 rounded-2xl px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-violet-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
            className="w-2 h-2 bg-violet-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
            className="w-2 h-2 bg-violet-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Suggested Question Chip ─────────────────────────────
function SuggestedChip({ text, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(text)}
      className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left"
    >
      <Lightbulb className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </motion.button>
  );
}

// ─── Empty State ───────────────────────────────────────────
function EmptyState({ onSuggestion }) {
  const suggestions = [
    "What is the main topic of this PDF?",
    "Summarize the key points in 3 sentences",
    "What are the important definitions?",
    "Generate 5 quiz questions from this content",
    "Explain the conclusion section",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl" />
        <div className="relative p-5 bg-slate-800/50 border border-slate-700/30 rounded-3xl">
          <MessageSquare className="w-10 h-10 text-violet-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-300 mb-2">
        Ask anything about your PDF
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
        Upload a PDF and ask questions to get AI-powered answers, summaries,
        and explanations instantly.
      </p>

      <div className="w-full max-w-lg">
        <p className="text-xs text-slate-600 uppercase tracking-wider mb-3 text-left">
          Try asking:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <SuggestedChip
              key={suggestion}
              text={suggestion}
              onClick={onSuggestion}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main PDFChat Component ────────────────────────────────
export default function PDFChat({ pdfId }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAI = async () => {
    if (!question.trim() || !pdfId) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: question.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId, question: userMessage.content }),
      });

      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer || "I couldn't find an answer. Please try rephrasing your question.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "⚠️ Sorry, I encountered an error. Please check your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
  };

  const clearChat = () => {
    setMessages([]);
    setQuestion("");
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Ask AI
              <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-semibold text-violet-400 uppercase tracking-wider">
                Beta
              </span>
            </h2>
            <p className="text-sm text-slate-500">
              Chat with your PDF document
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 transition-all"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      {/* Chat Container */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl overflow-hidden">
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <EmptyState onSuggestion={handleSuggestion} />
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  index={index}
                />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-800/50 p-4 bg-slate-900/60">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                rows={1}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about this PDF..."
                className="w-full bg-slate-800/50 border border-slate-700/30 rounded-2xl px-5 py-3.5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/10 resize-none transition-all"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
              <div className="absolute right-3 bottom-3.5 text-xs text-slate-600">
                {question.length > 0 && `${question.length} chars`}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={askAI}
              disabled={loading || !question.trim() || !pdfId}
              className={`flex-shrink-0 p-3.5 rounded-2xl transition-all ${
                loading || !question.trim() || !pdfId
                  ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Zap className="w-3 h-3" />
              <span>Press Enter to send</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Paperclip className="w-3 h-3" />
              <span>PDF ID: {pdfId ? pdfId.slice(0, 8) + "..." : "None"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}