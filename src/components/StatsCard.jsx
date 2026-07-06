import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function TrendIndicator({ trend, value }) {
  const config = {
    up: { icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/15" },
    down: { icon: ArrowDownRight, color: "text-rose-400", bg: "bg-rose-500/15" },
    neutral: { icon: Minus, color: "text-slate-400", bg: "bg-slate-500/15" },
  };

  const c = config[trend] || config.neutral;
  const Icon = c.icon;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${c.bg}`}>
      <Icon className={`w-3 h-3 ${c.color}`} />
      <span className={`text-xs font-semibold ${c.color}`}>
        {value > 0 ? `+${value}%` : `${value}%`}
      </span>
    </div>
  );
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  trend = "neutral",
  trendValue = 0,
  delay = 0,
}) {
  const colorMap = {
    blue: {
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/40",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      glow: "shadow-blue-500/10",
      text: "text-blue-400",
    },
    violet: {
      bg: "from-violet-500/10 to-purple-500/10",
      border: "border-violet-500/20",
      hoverBorder: "hover:border-violet-500/40",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-400",
      glow: "shadow-violet-500/10",
      text: "text-violet-400",
    },
    emerald: {
      bg: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      glow: "shadow-emerald-500/10",
      text: "text-emerald-400",
    },
    amber: {
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/20",
      hoverBorder: "hover:border-amber-500/40",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      glow: "shadow-amber-500/10",
      text: "text-amber-400",
    },
    rose: {
      bg: "from-rose-500/10 to-pink-500/10",
      border: "border-rose-500/20",
      hoverBorder: "hover:border-rose-500/40",
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-400",
      glow: "shadow-rose-500/10",
      text: "text-rose-400",
    },
    cyan: {
      bg: "from-cyan-500/10 to-sky-500/10",
      border: "border-cyan-500/20",
      hoverBorder: "hover:border-cyan-500/40",
      iconBg: "bg-cyan-500/15",
      iconColor: "text-cyan-400",
      glow: "shadow-cyan-500/10",
      text: "text-cyan-400",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative group overflow-hidden rounded-3xl bg-gradient-to-br ${c.bg} border ${c.border} ${c.hoverBorder} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl ${c.glow}`}
    >
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${c.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700`}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${c.iconBg} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className={`w-6 h-6 ${c.iconColor}`} />
        </div>
        <TrendIndicator trend={trend} value={trendValue} />
      </div>

      <div className="relative">
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
        >
          {value}
        </motion.p>
        <h3 className="text-sm font-medium text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
      </div>

      <div
        className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${c.bg.split(" ")[0]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`}
      />
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <TrendingUp className={`w-4 h-4 ${c.text} opacity-30`} />
      </div>
    </motion.div>
  );
}