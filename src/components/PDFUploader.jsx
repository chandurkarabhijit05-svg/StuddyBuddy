import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  BrainCircuit,
  HelpCircle,
  MessageSquare,
  Download,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Zap,
  BookOpen,
  Layers,
  Mail,
  ChevronRight,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import Quiz from "./Quiz";
import Flashcards from "./Flashcards";
import supabase from "../services/supabase.js";
import { uploadFile } from "../api/upload.js";
import { askGroq, generateSummary, generateFlashcards, generateQuiz } from "../api/groq.js";
import * as pdfjsLib from "pdfjs-dist";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// ─── Upload Zone Component ─────────────────────────────────
function UploadZone({ file, onFileSelect, onClear }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      onFileSelect(droppedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {!file ? (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${
            isDragOver
              ? "border-violet-500/50 bg-violet-500/5"
              : "border-slate-700/50 bg-slate-800/20 hover:border-slate-600/50"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) onFileSelect(selected);
            }}
            className="hidden"
          />
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl" />
            <div className="relative p-5 bg-slate-800/50 border border-slate-700/30 rounded-2xl">
              <Upload className="w-8 h-8 text-violet-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Drop your PDF here
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            or click to browse from your computer
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-xs text-slate-400">
            <FileText className="w-3.5 h-3.5" />
            Supports PDF files up to 50MB
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm"
        >
          <div className="p-3 bg-emerald-500/15 rounded-xl">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-300 truncate">
              {file.name}
            </p>
            <p className="text-xs text-emerald-400/60 mt-0.5">
              {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <XCircle className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── AI Action Card ────────────────────────────────────────
function AIActionCard({ icon: Icon, title, description, color, onClick, disabled, loading, isGenerated }) {
  const colors = {
    blue: {
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/40",
      icon: "text-blue-400",
      iconBg: "bg-blue-500/15",
      glow: "shadow-blue-500/10",
    },
    violet: {
      bg: "from-violet-500/10 to-purple-500/10",
      border: "border-violet-500/20",
      hover: "hover:border-violet-500/40",
      icon: "text-violet-400",
      iconBg: "bg-violet-500/15",
      glow: "shadow-violet-500/10",
    },
    amber: {
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/20",
      hover: "hover:border-amber-500/40",
      icon: "text-amber-400",
      iconBg: "bg-amber-500/15",
      glow: "shadow-amber-500/10",
    },
    rose: {
      bg: "from-rose-500/10 to-pink-500/10",
      border: "border-rose-500/20",
      hover: "hover:border-rose-500/40",
      icon: "text-rose-400",
      iconBg: "bg-rose-500/15",
      glow: "shadow-rose-500/10",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -4, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative w-full text-left p-5 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} ${c.hover} backdrop-blur-sm transition-all duration-300 ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${isGenerated ? "ring-1 ring-emerald-500/30" : ""}`}
    >
      {isGenerated && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      )}
      <div className={`inline-flex p-2.5 rounded-xl ${c.iconBg} mb-4`}>
        {loading ? (
          <Loader2 className={`w-5 h-5 ${c.icon} animate-spin`} />
        ) : (
          <Icon className={`w-5 h-5 ${c.icon}`} />
        )}
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </motion.button>
  );
}

// ─── Output Card ─────────────────────────────────────────
function OutputCard({ title, icon: Icon, color, children, onDownload, onCopy, isEmpty }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = typeof children === "string" ? children : "";
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isEmpty) return null;

  const colorMap = {
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    violet: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
    rose: "from-rose-500/10 to-pink-500/10 border-rose-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gradient-to-br ${colorMap[color] || colorMap.blue} border rounded-3xl backdrop-blur-xl overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5">
            <Icon className="w-4 h-4 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onCopy && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          )}
          {onDownload && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-500/40 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Chat Message Component ──────────────────────────────
function ChatMessage({ chat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-3"
    >
      {/* User Question */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 bg-blue-500/10 border border-blue-500/15 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-blue-100">{chat.question}</p>
        </div>
      </div>

      {/* AI Answer */}
      <div className="flex gap-3 flex-row-reverse">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 bg-violet-500/10 border border-violet-500/15 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-violet-100 whitespace-pre-wrap">{chat.answer}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main PDFUploader Component ──────────────────────────
export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");

  const isReady = !!uploadedUrl;

  // ─── Extract REAL text from PDF using pdfjs-dist ─────
  const extractPdfText = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      }
      
      if (!fullText.trim()) {
        throw new Error("No text found in PDF");
      }
      
      return fullText.trim().slice(0, 8000);
    } catch (err) {
      console.error("PDF parse error:", err);
      toast.error("Could not read PDF text. Using filename as fallback.");
      return `Document: ${pdfFile.name}. This is a PDF document uploaded for analysis.`;
    }
  };

  // ─── Upload ─────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a PDF first");
      return;
    }

    setLoading(true);
    try {
      // Upload to Supabase Storage
      const result = await uploadFile(file, "pdfs");
      setUploadedUrl(result.url);

      // Extract REAL text from PDF
      const text = await extractPdfText(file);
      setPdfText(text);

      toast.success("PDF Uploaded & Parsed Successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ─── AI Summary ─────────────────────────────────────────
  const handleSummary = async () => {
    if (!pdfText) {
      toast.error("Upload PDF first");
      return;
    }

    setLoading(true);
    try {
      const response = await generateSummary(pdfText);
      setSummary(response.choices[0].message.content);
      toast.success("Summary generated!");
    } catch (error) {
      console.error(error);
      toast.error("Summary generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── AI Flashcards ──────────────────────────────────────
  const handleFlashcards = async () => {
    if (!pdfText) {
      toast.error("Upload PDF first");
      return;
    }

    setLoading(true);
    try {
      const response = await generateFlashcards(pdfText);
      setFlashcards(response.choices[0].message.content);
      toast.success("Flashcards generated!");
    } catch (error) {
      console.error(error);
      toast.error("Flashcards generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── AI Quiz ────────────────────────────────────────────
  const handleQuiz = async () => {
    if (!pdfText) {
      toast.error("Upload PDF first");
      return;
    }

    setLoading(true);
    try {
      const response = await generateQuiz(pdfText);
      setQuiz(response.choices[0].message.content);
      toast.success("Quiz generated!");
    } catch (error) {
      console.error(error);
      toast.error("Quiz generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Chat ───────────────────────────────────────────────
  const handleChat = async () => {
    if (!pdfText) {
      toast.error("Upload PDF first");
      return;
    }
    if (!question.trim()) {
      toast.error("Enter a question");
      return;
    }

    setLoading(true);
    try {
      const response = await askGroq([
        { role: "system", content: `You are analyzing this document: "${pdfText.slice(0, 3000)}..."` },
        { role: "user", content: question }
      ]);

      const aiAnswer = response.choices[0].message.content;
      setAnswer(aiAnswer);
      setChatHistory((prev) => [...prev, { question, answer: aiAnswer }]);
      setQuestion("");
    } catch (error) {
      console.error(error);
      toast.error("Chat failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Downloads ──────────────────────────────────────────
  const downloadContent = (content, filename) => {
    if (!content) {
      toast.error(`Generate ${filename.split("-")[1]} first`);
      return;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  const downloadSummary = () => downloadContent(summary, "AI-Summary.txt");
  const downloadFlashcards = () => downloadContent(flashcards, "AI-Flashcards.txt");
  const downloadQuiz = () => downloadContent(quiz, "AI-Quiz.txt");

  // ─── Email (Disabled - requires backend) ─────────────────
  const handleSendEmail = async () => {
    toast.info("Email feature requires backend server. Please use Download instead!");
  };

  // ─── Clear File ─────────────────────────────────────────
  const handleClearFile = () => {
    setFile(null);
    setUploadedUrl(null);
    setPdfText("");
    setSummary("");
    setFlashcards("");
    setQuiz("");
    setAnswer("");
    setChatHistory([]);
    setQuestion("");
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full border border-violet-500/20 mb-4">
          <Zap className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-400">AI-Powered Document Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Upload & Analyze
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Upload your PDF and unlock AI summaries, flashcards, quizzes, and intelligent chat.
        </p>
      </motion.div>

      {/* Upload Section */}
      <UploadZone
        file={file}
        onFileSelect={setFile}
        onClear={handleClearFile}
      />

      {/* Upload Button */}
      {file && !uploadedUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {loading ? "Uploading..." : "Upload PDF"}
          </motion.button>
        </motion.div>
      )}

      {/* Success State */}
      {uploadedUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">PDF uploaded successfully! Choose an AI action below</span>
        </motion.div>
      )}

      {/* AI Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <AIActionCard
          icon={BookOpen}
          title="Summary"
          description="Generate a concise AI summary of your document"
          color="blue"
          onClick={handleSummary}
          disabled={!isReady || loading}
          loading={loading && !summary}
          isGenerated={!!summary}
        />
        <AIActionCard
          icon={Layers}
          title="Flashcards"
          description="Create interactive study flashcards automatically"
          color="violet"
          onClick={handleFlashcards}
          disabled={!isReady || loading}
          loading={loading && !flashcards}
          isGenerated={!!flashcards}
        />
        <AIActionCard
          icon={HelpCircle}
          title="Quiz"
          description="Generate a quiz to test your knowledge"
          color="amber"
          onClick={handleQuiz}
          disabled={!isReady || loading}
          loading={loading && !quiz}
          isGenerated={!!quiz}
        />
        <AIActionCard
          icon={Mail}
          title="Email Report"
          description="Send all generated content to your email"
          color="rose"
          onClick={handleSendEmail}
          disabled={!isReady || loading || (!summary && !flashcards && !quiz)}
          loading={loading}
          isGenerated={false}
        />
      </motion.div>

      {/* Chat Section */}
      {isReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800/50">
            <div className="p-2 bg-violet-500/15 rounded-xl">
              <MessageSquare className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chat with PDF</h3>
              <p className="text-xs text-slate-500">Ask anything about your document</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <BrainCircuit className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Start a conversation with your PDF</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} index={index} />
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800/50 bg-slate-900/60">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChat();
                    }
                  }}
                  placeholder="Ask anything about this PDF..."
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-2xl px-5 py-3.5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/10 resize-none transition-all"
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChat}
                disabled={loading || !question.trim()}
                className={`flex-shrink-0 p-3.5 rounded-2xl transition-all ${
                  loading || !question.trim()
                    ? "bg-slate-800/50 text-slate-600"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20"
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Outputs - Fixed AnimatePresence */}
      <div className="space-y-6">
        {/* Summary */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OutputCard
                title="AI Summary"
                icon={BookOpen}
                color="blue"
                onDownload={downloadSummary}
                onCopy
              >
                {summary}
              </OutputCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flashcards */}
        <AnimatePresence>
          {flashcards && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-3xl backdrop-blur-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5">
                    <Layers className="w-4 h-4 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Flashcards</h3>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadFlashcards}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-500/40 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                </div>
              </div>
              {/* Flashcards Component */}
              <div className="p-6">
                <Flashcards flashcards={flashcards} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz */}
        <AnimatePresence>
          {quiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OutputCard
                title="Quiz"
                icon={HelpCircle}
                color="amber"
                onDownload={downloadQuiz}
              >
                <Quiz quiz={quiz} />
              </OutputCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}