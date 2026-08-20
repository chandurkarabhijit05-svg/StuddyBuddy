import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Activity,
  Star,
} from "lucide-react";

// ─── Animated Counter Hook ─────────────────────────────────
function useAnimatedCounter(target, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(target * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return count;
}

// ─── Particle Burst Effect ─────────────────────────────────
function ParticleBurst({ isHovered, color }) {
  const particles = Array(8).fill(null);
  
  return (
    <AnimatePresence>
      {isHovered && (
        <>
          {particles.map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 0],
                  scale: [1, 0],
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full ${color}`}
                style={{ marginLeft: -3, marginTop: -3 }}
              />
            );
          })}
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Floating Orbs Background ──────────────────────────────
function FloatingOrbs({ color }) {
  return (
    <>
      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${color} opacity-20 blur-2xl`}
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute -bottom-6 -left-6 w-20 h-20 rounded-full ${color} opacity-15 blur-2xl`}
      />
    </>
  );
}

// ─── Trend Indicator ───────────────────────────────────────
function TrendIndicator({ trend, value }) {
  const config = {
    up: { 
      icon: ArrowUpRight, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/20",
    },
    down: { 
      icon: ArrowDownRight, 
      color: "text-rose-400", 
      bg: "bg-rose-500/15",
      border: "border-rose-500/20",
      glow: "shadow-rose-500/20",
    },
    neutral: { 
      icon: Minus, 
      color: "text-slate-400", 
      bg: "bg-slate-500/15",
      border: "border-slate-500/20",
      glow: "shadow-slate-500/10",
    },
  };

  const c = config[trend] || config.neutral;
  const Icon = c.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${c.bg} ${c.border} border ${c.glow} shadow-sm backdrop-blur-sm`}
    >
      <motion.div
        animate={trend === "up" ? { y: [0, -2, 0] } : trend === "down" ? { y: [0, 2, 0] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Icon className={`w-3.5 h-3.5 ${c.color}`} />
      </motion.div>
      <span className={`text-xs font-bold ${c.color}`}>
        {value > 0 && trend !== "neutral" ? "+" : ""}{value}%
      </span>
    </motion.div>
  );
}

// ─── Progress Ring ─────────────────────────────────────────
function ProgressRing({ value, max = 100, color, size = 50 }) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * (size / 2 - 4);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth={3}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          stroke="currentColor"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${color}`}>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

// ─── Color Themes ──────────────────────────────────────────
const colorMap = {
  blue: {
    bg: "from-blue-500/10 via-blue-500/5 to-slate-900/90",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-400/50",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    glow: "shadow-blue-500/15",
    text: "text-blue-400",
    orb: "bg-blue-500",
    ring: "text-blue-400",
    particle: "bg-blue-400",
    accent: "from-blue-400 to-cyan-400",
  },
  violet: {
    bg: "from-violet-500/10 via-violet-500/5 to-slate-900/90",
    border: "border-violet-500/20",
    hoverBorder: "hover:border-violet-400/50",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    glow: "shadow-violet-500/15",
    text: "text-violet-400",
    orb: "bg-violet-500",
    ring: "text-violet-400",
    particle: "bg-violet-400",
    accent: "from-violet-400 to-purple-400",
  },
  emerald: {
    bg: "from-emerald-500/10 via-emerald-500/5 to-slate-900/90",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400/50",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    glow: "shadow-emerald-500/15",
    text: "text-emerald-400",
    orb: "bg-emerald-500",
    ring: "text-emerald-400",
    particle: "bg-emerald-400",
    accent: "from-emerald-400 to-teal-400",
  },
  amber: {
    bg: "from-amber-500/10 via-amber-500/5 to-slate-900/90",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400/50",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    glow: "shadow-amber-500/15",
    text: "text-amber-400",
    orb: "bg-amber-500",
    ring: "text-amber-400",
    particle: "bg-amber-400",
    accent: "from-amber-400 to-orange-400",
  },
  rose: {
    bg: "from-rose-500/10 via-rose-500/5 to-slate-900/90",
    border: "border-rose-500/20",
    hoverBorder: "hover:border-rose-400/50",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    glow: "shadow-rose-500/15",
    text: "text-rose-400",
    orb: "bg-rose-500",
    ring: "text-rose-400",
    particle: "bg-rose-400",
    accent: "from-rose-400 to-pink-400",
  },
  cyan: {
    bg: "from-cyan-500/10 via-cyan-500/5 to-slate-900/90",
    border: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400/50",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-400",
    glow: "shadow-cyan-500/15",
    text: "text-cyan-400",
    orb: "bg-cyan-500",
    ring: "text-cyan-400",
    particle: "bg-cyan-400",
    accent: "from-cyan-400 to-sky-400",
  },
};

// ─── Main StatsCard Component ──────────────────────────────
export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  trend = "neutral",
  trendValue = 0,
  delay = 0,
  maxValue = 100,
  showRing = false,
  isNew = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const c = colorMap[color] || colorMap.blue;
  const animatedValue = useAnimatedCounter(
    typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, "")) || 0 : value,
    1500,
    delay * 1000
  );

  const displayValue = typeof value === "string" ? value.replace(/[0-9]/g, "").trim() : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay, 
        duration: 0.7, 
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.03,
        rotateY: 3,
        rotateX: -3,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
      className={`
        relative group overflow-hidden rounded-3xl 
        bg-gradient-to-br ${c.bg} 
        border ${c.border} ${c.hoverBorder} 
        backdrop-blur-2xl p-6 
        transition-all duration-500
        hover:shadow-2xl ${c.glow}
      `}
    >
      {/* Floating Orbs */}
      <FloatingOrbs color={c.orb} />

      {/* Particle Burst */}
      <ParticleBurst isHovered={isHovered} color={c.particle} />

      {/* Shine Sweep */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
      />

      {/* NEW Badge */}
      <AnimatePresence>
        {isNew && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: delay + 0.3 }}
            className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-[10px] font-black text-slate-900 shadow-lg shadow-amber-500/30 z-10"
          >
            NEW
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Row */}
      <div className="relative flex items-start justify-between mb-5">
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, -10, 10, -5, 0] : 0,
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.5 }}
          className={`
            relative p-3.5 rounded-2xl 
            ${c.iconBg} border ${c.border}
            transition-all duration-300
          `}
        >
          <Icon className={`w-7 h-7 ${c.iconColor}`} />
          
          {/* Icon Glow */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className={`absolute inset-0 rounded-2xl ${c.iconBg} blur-xl`}
          />
        </motion.div>

        <div className="flex items-center gap-2">
          <TrendIndicator trend={trend} value={trendValue} />
          {showRing && (
            <ProgressRing 
              value={typeof value === "number" ? value : animatedValue} 
              max={maxValue} 
              color={c.ring} 
              size={45}
            />
          )}
        </div>
      </div>

      {/* Value Display */}
      <div className="relative">
        <div className="flex items-baseline gap-1">
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            {animatedValue}
          </motion.p>
          {displayValue && (
            <span className={`text-lg font-bold ${c.text}`}>{displayValue}</span>
          )}
        </div>
        
        <h3 className="text-sm font-semibold text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-xs text-slate-600 mt-1 group-hover:text-slate-500 transition-colors">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-5 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${c.accent} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((animatedValue / maxValue) * 100, 100)}%` }}
          transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Animated Bottom Line */}
      <motion.div
        className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${c.accent} rounded-full`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: isHovered ? 1 : 0, 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.4 }}
        style={{ originX: 0 }}
      />

      {/* Corner Sparkle */}
      <motion.div
        animate={{ 
          rotate: isHovered ? 180 : 0,
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 right-4"
      >
        <Sparkles className={`w-4 h-4 ${c.text} opacity-40`} />
      </motion.div>

      {/* Activity Pulse */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute top-6 right-6 w-2 h-2 rounded-full ${c.particle}`}
      />
    </motion.div>
  );
}