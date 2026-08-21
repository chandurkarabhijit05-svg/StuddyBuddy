import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, BrainCircuit, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { askGroq } from "../../api/groq.js";
import ChatMessage from "./ChatMessage";

export default function ChatSection({ pdfText }) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
        { role: "user", content: question },
      ]);

      const aiAnswer = response.choices[0].message.content;
      setChatHistory((prev) => [...prev, { question, answer: aiAnswer }]);
      setQuestion("");
    } catch (error) {
      console.error(error);
      toast.error("Chat failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            type="button"
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
  );
}