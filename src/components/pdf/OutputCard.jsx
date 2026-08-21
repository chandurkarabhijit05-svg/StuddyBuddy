import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Check } from "lucide-react";

export default function OutputCard({ title, icon: Icon, color, children, onDownload, onCopy, isEmpty }) {
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
              type="button"
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
              type="button"
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