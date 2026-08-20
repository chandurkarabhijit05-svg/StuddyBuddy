import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowUpRight,
  Star,
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

// ─── Enhanced Color Themes ─────────────────────────────────
const themes = {
  purple: {
    bg: "from-violet-500/10 via-purple-500/5 to-slate-900/80",
    border: "border-violet-500/20",
    borderHover: "hover:border-violet-400/50",
    glow: "group-hover:shadow-violet-500/20",
    accent: "from-violet-400 to-purple-500",
    iconBg: "bg-violet-500/15",
    iconText: "text-violet-400",
    dot: "bg-violet-400",
    particle: "text-violet-400/40",
  },
  cyan: {
    bg: "from-cyan-500/10 via-blue-500/5 to-slate-900/80",
    border: "border-cyan-500/20",
    borderHover: "hover:border-cyan-400/50",
    glow: "group-hover:shadow-cyan-500/20",
    accent: "from-cyan-400 to-blue-500",
    iconBg: "bg-cyan-500/15",
    iconText: "text-cyan-400",
    dot: "bg-cyan-400",
    particle: "text-cyan-400/40",
  },
  amber: {
    bg: "from-amber-500/10 via-orange-500/5 to-slate-900/80",
    border: "border-amber-500/20",
    borderHover: "hover:border-amber-400/50",
    glow: "group-hover:shadow-amber-500/20",
    accent: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-400",
    dot: "bg-amber-400",
    particle: "text-amber-400/40",
  },
  rose: {
    bg: "from-rose-500/10 via-pink-500/5 to-slate-900/80",
    border: "border-rose-500/20",
    borderHover: "hover:border-rose-400/50",
    glow: "group-hover:shadow-rose-500/20",
    accent: "from-rose-400 to-pink-500",
    iconBg: "bg-rose-500/15",
    iconText: "text-rose-400",
    dot: "bg-rose-400",
    particle: "text-rose-400/40",
  },
  emerald: {
    bg: "from-emerald-500/10 via-teal-500/5 to-slate-900/80",
    border: "border-emerald-500/20",
    borderHover: "hover:border-emerald-400/50",
    glow: "group-hover:shadow-emerald-500/20",
    accent: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-400",
    dot: "bg-emerald-400",
    particle: "text-emerald-400/40",
  },
};

// ─── Floating Particle Component ───────────────────────────
function FloatingParticle({ delay, theme, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 1, 0],
        y: [-20, -60],
        x: side === "left" ? [-10, -30] : [10, 30],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      className={`absolute bottom-8 ${side === "left" ? "left-8" : "right-8"} w-1 h-1 rounded-full ${theme.dot}`}
    />
  );
}

// ─── Sparkle Burst on Hover ────────────────────────────────
function SparkleBurst({ isHovered, theme }) {
  const sparkles = Array(6).fill(null);
  
  return (
    <AnimatePresence>
      {isHovered && (
        <>
          {sparkles.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i / 6) * Math.PI * 2) * 40,
                y: Math.sin((i / 6) * Math.PI * 2) * 40,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full ${theme.dot}`}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Animated Number Counter ───────────────────────────────
function AnimatedBadge({ value, theme }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${theme.iconBg} ${theme.border} border flex items-center justify-center`}
    >
      <span className={`text-xs font-bold ${theme.iconText}`}>{value}</span>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function FeatureCard({
  title,
  desc,
  icon = "default",
  theme = "purple",
  index = 0,
  onClick,
  badge,
  stat,
  isNew = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[icon] || iconMap.default;
  const themeData = themes[theme] || themes.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.12,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.03,
        rotateY: 2,
        rotateX: -2,
      }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ perspective: 1000 }}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br ${themeData.bg}
        backdrop-blur-2xl rounded-3xl p-7
        border ${themeData.border} ${themeData.borderHover}
        transition-all duration-500
        hover:shadow-2xl ${themeData.glow}
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${themeData.accent} rounded-full blur-3xl`}
      />
      <motion.div
        animate={{
          scale: isHovered ? [1, 1.3, 1] : 1,
          opacity: isHovered ? [0.2, 0.4, 0.2] : 0,
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        className={`absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br ${themeData.accent} rounded-full blur-3xl`}
      />

      {/* Sparkle Burst Effect */}
      <SparkleBurst isHovered={isHovered} theme={themeData} />

      {/* Floating Particles */}
      <FloatingParticle delay={0} theme={themeData} side="left" />
      <FloatingParticle delay={1.5} theme={themeData} side="right" />

      {/* New Badge */}
      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
          className="absolute -top-2 -left-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-xs font-bold text-slate-900 shadow-lg shadow-amber-500/30"
        >
          NEW
        </motion.div>
      )}

      {/* Number Badge */}
      {badge && <AnimatedBadge value={badge} theme={themeData} />}

      {/* Top Row: Icon + Arrow */}
      <div className="flex items-start justify-between mb-5">
        <motion.div
          animate={{
            rotate: isHovered ? [0, -10, 10, 0] : 0,
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.5 }}
          className={`
            relative inline-flex p-4 rounded-2xl
            ${themeData.iconBg}
            border ${themeData.border}
            transition-colors duration-300
          `}
        >
          <IconComponent className={`w-7 h-7 ${themeData.iconText}`} />
          
          {/* Icon Glow */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${themeData.accent} blur-xl opacity-50`}
          />
        </motion.div>

        {/* Arrow that appears on hover */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          className={`p-2 rounded-xl ${themeData.iconBg}`}
        >
          <ArrowUpRight className={`w-5 h-5 ${themeData.iconText}`} />
        </motion.div>
      </div>

      {/* Title with gradient text on hover */}
      <h3 className={`
        text-xl font-bold mb-2 transition-all duration-300
        ${isHovered 
          ? `bg-gradient-to-r ${themeData.accent} bg-clip-text text-transparent` 
          : "text-white"
        }
      `}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
        {desc}
      </p>

      {/* Stat Row (if provided) */}
      {stat && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 pt-4 border-t border-slate-700/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${themeData.iconText}`} />
            <span className="text-sm font-semibold text-white">{stat.value}</span>
            <span className="text-xs text-slate-500">{stat.label}</span>
          </div>
          {stat.trend && (
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              stat.trend > 0 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "bg-rose-500/10 text-rose-400"
            }`}>
              {stat.trend > 0 ? "+" : ""}{stat.trend}%
            </span>
          )}
        </motion.div>
      )}

      {/* Bottom Progress Line */}
      <motion.div
        className={`absolute bottom-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r ${themeData.accent}`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: isHovered ? 1 : 0, 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.4 }}
        style={{ originX: 0 }}
      />

      {/* Corner Stars */}
      <motion.div
        animate={{ 
          rotate: isHovered ? 180 : 0,
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 right-4"
      >
        <Sparkles className={`w-4 h-4 ${themeData.particle}`} />
      </motion.div>

      {/* Shine Effect on Hover */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ 
          x: isHovered ? "200%" : "-100%",
          opacity: isHovered ? 0.1 : 0,
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 pointer-events-none"
      />
    </motion.div>
  );
}