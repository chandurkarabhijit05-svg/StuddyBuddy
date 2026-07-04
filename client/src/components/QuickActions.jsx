import { motion } from "framer-motion";
import {
  Upload,
  RotateCcw,
  SearchX,
  ArrowUp,
  Zap,
  Sparkles,
  ChevronRight,
  MousePointerClick,
} from "lucide-react";

// ─── Action Button Component ─────────────────────────────
function ActionButton({ icon: Icon, label, description, color, onClick, index }) {
  const colorMap = {
    blue: {
      bg: "from-blue-500/15 to-cyan-500/15",
      border: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/40",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      shadow: "shadow-blue-500/10",
      glow: "group-hover:shadow-blue-500/20",
    },
    emerald: {
      bg: "from-emerald-500/15 to-teal-500/15",
      border: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      shadow: "shadow-emerald-500/10",
      glow: "group-hover:shadow-emerald-500/20",
    },
    amber: {
      bg: "from-amber-500/15 to-orange-500/15",
      border: "border-amber-500/20",
      hoverBorder: "hover:border-amber-500/40",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      shadow: "shadow-amber-500/10",
      glow: "group-hover:shadow-amber-500/20",
    },
    violet: {
      bg: "from-violet-500/15 to-purple-500/15",
      border: "border-violet-500/20",
      hoverBorder: "hover:border-violet-500/40",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-400",
      shadow: "shadow-violet-500/10",
      glow: "group-hover:shadow-violet-500/20",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative w-full text-left p-5 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} ${c.hoverBorder} backdrop-blur-sm transition-all duration-300 ${c.glow} hover:shadow-lg overflow-hidden`}
    >
      {/* Background Glow */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${c.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 p-3 rounded-xl ${c.iconBg} ${c.iconColor} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white group-hover:text-slate-100 transition-colors">
              {label}
            </h4>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed group-hover:text-slate-400 transition-colors">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r ${c.bg.split(" ")[0]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />
    </motion.button>
  );
}

// ─── Main QuickActions Component ───────────────────────────
export default function QuickActions({ onRefresh, onClearSearch, onScrollUpload }) {
  const actions = [
    {
      icon: Upload,
      label: "Upload PDF",
      description: "Add new study materials to analyze",
      color: "blue",
      onClick: onScrollUpload,
    },
    {
      icon: RotateCcw,
      label: "Refresh Data",
      description: "Reload and sync latest content",
      color: "emerald",
      onClick: onRefresh,
    },
    {
      icon: SearchX,
      label: "Clear Search",
      description: "Reset filters and search queries",
      color: "amber",
      onClick: onClearSearch,
    },
    {
      icon: ArrowUp,
      label: "Back to Top",
      description: "Quickly return to page header",
      color: "violet",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/20">
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          <p className="text-sm text-slate-500">Fast access to common tasks</p>
        </div>
      </motion.div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={action.label} {...action} index={index} />
        ))}
      </div>

      {/* Shortcut Hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-600"
      >
        <span className="flex items-center gap-1.5">
          <MousePointerClick className="w-3 h-3" />
          Click to activate
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Hover for preview
        </span>
      </motion.div>
    </section>
  );
}