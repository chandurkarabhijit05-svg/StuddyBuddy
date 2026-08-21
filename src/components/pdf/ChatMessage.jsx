import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

export default function ChatMessage({ chat, index }) {
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