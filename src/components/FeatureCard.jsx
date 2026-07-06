import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  HelpCircle,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  MessageSquare,
  Layers,
} from "lucide-react";

// ─── Icon Mapping ──────────────────────────────────────────
const iconMap = {
  pdf: FileText,
  summary: BookOpen,
  flashcard: BrainCircuit,
  quiz: HelpCircle,
  ai: Sparkles,
  speed: Zap,
  analytics: BarChart3,
  calendar: Calendar,
  chat: MessageSquare,
  default: Layers,
};

// ─── Color Themes ──────────────────────────────────────────
const themes = {
  purple: "from-violet-500/20 to-purple-600/20 border-violet-500/30 hover:border-violet-400/50",
  cyan: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30 hover:border-cyan-400/50",
  amber: "from-amber-500/20 to-orange-600/20 border-amber-500/30 hover:border-amber-400/50",
  rose: "from-rose-500/20 to-pink-600/20 border-rose-500/30 hover:border-rose-400/50",
  emerald: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30 hover:border-emerald-400/50",
};

const iconColors = {
  purple: "text-violet-400 bg-violet-500/20",
  cyan: "text-cyan-400 bg-cyan-500/20",
  amber: "text-amber-400 bg-amber-500/20",
  rose: "text-rose-400 bg-rose-500/20",
  emerald: "text-emerald-400 bg-emerald-500/20",
};

// ─── Main Component ────────────────────────────────────────
export default function FeatureCard({
  title,
  desc,
  icon = "default",
  theme = "purple",
  index = 0,
  onClick,
}) {
  const IconComponent = iconMap[icon] || iconMap.default;
  const themeClass = themes[theme] || themes.purple;
  const iconColorClass = iconColors[theme] || iconColors.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative group cursor-pointer overflow-hidden
        bg-gradient-to-br ${themeClass}
        backdrop-blur-xl rounded-3xl p-8
        border transition-all duration-500
        hover:shadow-2xl hover:shadow-${theme}-500/10
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Animated Background Glow */}
      <div
        className={`
          absolute -top-20 -right-20 w-40 h-40 
          bg-gradient-to-br ${themeClass.split(" ")[0].replace("/20", "/30")}
          rounded-full blur-3xl opacity-0 group-hover:opacity-100
          transition-opacity duration-700
        `}
      />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        className={`
          relative inline-flex p-3.5 rounded-2xl mb-5
          ${iconColorClass}
          transition-colors duration-300
        `}
      >
        <IconComponent className="w-7 h-7" />
      </motion.div>

      {/* Title */}
      <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-slate-100 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="relative text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
        {desc}
      </p>

      {/* Bottom Accent Line */}
      <div
        className={`
          absolute bottom-0 left-8 right-8 h-0.5 
          bg-gradient-to-r ${themeClass.split(" ")[0].replace("/20", "")}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500 rounded-full
        `}
      />

      {/* Corner Decoration */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-4 h-4 text-slate-500" />
      </div>
    </motion.div>
  );
}