import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  FileText,
  BrainCircuit,
  HelpCircle,
  Activity,
  Zap,
  Flame,
  Target,
  Award,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────────
const COLORS = {
  primary: ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899"],
  pie: ["#22c55e", "#f59e0b", "#ef4444"],
  grid: "rgba(148, 163, 184, 0.08)",
  text: "#94a3b8",
  glow: {
    violet: "rgba(139, 92, 246, 0.3)",
    cyan: "rgba(6, 182, 212, 0.3)",
    amber: "rgba(245, 158, 11, 0.3)",
    pink: "rgba(236, 72, 153, 0.3)",
  },
};

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

// ─── Animated Counter Hook ─────────────────────────────────
function useAnimatedCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return { count, ref };
}

// ─── Circular Progress Component ───────────────────────────
function CircularProgress({ value, max, color, size = 120, strokeWidth = 8, label, icon: Icon }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && <Icon className="w-5 h-5 mb-1" style={{ color }} />}
          <span className="text-xl font-bold text-white">{Math.round(progress * 100)}%</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2 font-medium">{label}</span>
    </div>
  );
}

// ─── Custom Tooltip for Bar Chart ──────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const icons = {
    PDFs: <FileText className="w-4 h-4 text-violet-400" />,
    Summary: <BookOpen className="w-4 h-4 text-cyan-400" />,
    Flashcards: <BrainCircuit className="w-4 h-4 text-amber-400" />,
    Quiz: <HelpCircle className="w-4 h-4 text-pink-400" />,
  };

  const colors = {
    PDFs: "text-violet-400",
    Summary: "text-cyan-400",
    Flashcards: "text-amber-400",
    Quiz: "text-pink-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl shadow-black/50"
    >
      <div className="flex items-center gap-2 mb-2">
        {icons[label] || <Activity className="w-4 h-4" />}
        <span className={`font-semibold ${colors[label] || "text-slate-200"}`}>{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{payload[0].value}</p>
      <p className="text-xs text-slate-500 mt-1">Total generated</p>
    </motion.div>
  );
};

// ─── Custom Tooltip for Area Chart ─────────────────────────
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl"
    >
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{payload[0].value}</p>
    </motion.div>
  );
};

// ─── Stat Card Component ───────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, index, trend, trendValue }) => {
  const { count, ref } = useAnimatedCounter(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative group cursor-pointer"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`}
      />
      <div className="relative bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm rounded-2xl p-5 hover:bg-slate-800/60 hover:border-slate-600/40 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8" />
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
              trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
              trend === "down" ? "bg-rose-500/10 text-rose-400" :
              "bg-slate-500/10 text-slate-400"
            }`}>
              {trend === "up" ? <ChevronUp className="w-3 h-3" /> :
               trend === "down" ? <ChevronDown className="w-3 h-3" /> :
               <Minus className="w-3 h-3" />}
              {trendValue || "0%"}
            </div>
          )}
        </div>
        
        <p className="text-3xl font-bold text-white tracking-tight">{count}</p>
        <p className="text-sm text-slate-400 mt-1.5 font-medium">{label}</p>
        
        <div className="mt-3 h-1 bg-slate-700/30 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
            transition={{ delay: index * 0.12 + 0.5, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Feature Card Component ────────────────────────────────
const FeatureCard = ({ title, value, max, color, icon: Icon, description, delay }) => {
  const percentage = Math.min((value / Math.max(max, 1)) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-slate-800/30 border border-slate-700/20 rounded-2xl p-5 hover:border-slate-600/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-slate-500 mb-1">of {max} PDFs</span>
      </div>
      
      <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">{Math.round(percentage)}% utilization</p>
    </motion.div>
  );
};

// ─── Main Analytics Component ──────────────────────────────
export default function Analytics({
  totalPDFs = 0,
  totalSummaries = 0,
  totalFlashcards = 0,
  totalQuizzes = 0,
}) {
  const [activeChart, setActiveChart] = useState("activity");

  // ─── Derived Data ────────────────────────────────────────
  const barData = useMemo(
    () => [
      { name: "PDFs", value: totalPDFs, color: COLORS.primary[0] },
      { name: "Summary", value: totalSummaries, color: COLORS.primary[1] },
      { name: "Flashcards", value: totalFlashcards, color: COLORS.primary[2] },
      { name: "Quiz", value: totalQuizzes, color: COLORS.primary[3] },
    ],
    [totalPDFs, totalSummaries, totalFlashcards, totalQuizzes]
  );

  const totalCompleted = totalSummaries + totalFlashcards + totalQuizzes;
  const totalPending = Math.max(0, totalPDFs * 3 - totalCompleted);

  const pieData = useMemo(
    () => [
      { name: "Completed", value: totalCompleted },
      { name: "In Progress", value: Math.max(totalPending, 0) },
      { name: "Not Started", value: Math.max(totalPDFs * 3 - totalCompleted - totalPending, 0) },
    ],
    [totalCompleted, totalPending, totalPDFs]
  );

  // Area chart data (simulated weekly trend)
  const areaData = useMemo(() => {
    const base = Math.max(totalPDFs, 1);
    return [
      { day: "Mon", activity: Math.round(base * 0.3) },
      { day: "Tue", activity: Math.round(base * 0.5) },
      { day: "Wed", activity: Math.round(base * 0.7) },
      { day: "Thu", activity: Math.round(base * 0.4) },
      { day: "Fri", activity: Math.round(base * 0.9) },
      { day: "Sat", activity: Math.round(base * 0.6) },
      { day: "Sun", activity: Math.round(base * 0.8) },
    ];
  }, [totalPDFs]);

  // Radial data for feature usage
  const radialData = useMemo(() => [
    { name: "Summaries", value: totalPDFs > 0 ? (totalSummaries / totalPDFs) * 100 : 0, fill: COLORS.primary[1] },
    { name: "Flashcards", value: totalPDFs > 0 ? (totalFlashcards / totalPDFs) * 100 : 0, fill: COLORS.primary[2] },
    { name: "Quizzes", value: totalPDFs > 0 ? (totalQuizzes / totalPDFs) * 100 : 0, fill: COLORS.primary[3] },
  ], [totalPDFs, totalSummaries, totalFlashcards, totalQuizzes]);

  const stats = [
    {
      icon: FileText,
      label: "PDFs Uploaded",
      value: totalPDFs,
      color: "from-violet-500 to-purple-600",
      trend: "up",
      trendValue: "+12%",
    },
    {
      icon: BookOpen,
      label: "Summaries",
      value: totalSummaries,
      color: "from-cyan-500 to-blue-600",
      trend: totalSummaries > 0 ? "up" : "neutral",
      trendValue: totalSummaries > 0 ? "+8%" : "0%",
    },
    {
      icon: BrainCircuit,
      label: "Flashcards",
      value: totalFlashcards,
      color: "from-amber-500 to-orange-600",
      trend: totalFlashcards > 0 ? "up" : "neutral",
      trendValue: totalFlashcards > 0 ? "+15%" : "0%",
    },
    {
      icon: HelpCircle,
      label: "Quizzes",
      value: totalQuizzes,
      color: "from-pink-500 to-rose-600",
      trend: totalQuizzes > 0 ? "up" : "neutral",
      trendValue: totalQuizzes > 0 ? "+5%" : "0%",
    },
  ];

  const completionRate = totalPDFs > 0
    ? Math.round((totalCompleted / (totalPDFs * 3)) * 100)
    : 0;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ─── Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-slate-400 text-lg ml-1">
            Track your learning progress and activity insights
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/30 rounded-xl p-1">
          {[
            { id: "activity", icon: TrendingUp, label: "Activity" },
            { id: "features", icon: Zap, label: "Features" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeChart === tab.id
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Stats Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>

      {/* ─── Progress Rings Row ───────────────────────────── */}
      {totalPDFs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-800/20 border border-slate-700/20 rounded-3xl p-8"
        >
          <CircularProgress
            value={totalPDFs}
            max={Math.max(totalPDFs, 10)}
            color={COLORS.primary[0]}
            label="PDFs"
            icon={FileText}
          />
          <CircularProgress
            value={totalSummaries}
            max={totalPDFs}
            color={COLORS.primary[1]}
            label="Summaries"
            icon={BookOpen}
          />
          <CircularProgress
            value={totalFlashcards}
            max={totalPDFs}
            color={COLORS.primary[2]}
            label="Flashcards"
            icon={BrainCircuit}
          />
          <CircularProgress
            value={totalQuizzes}
            max={totalPDFs}
            color={COLORS.primary[3]}
            label="Quizzes"
            icon={HelpCircle}
          />
        </motion.div>
      )}

      {/* ─── Charts Section ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeChart === "activity" ? (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* ─── Bar Chart ──────────────────────────────── */}
            <motion.div
              className="lg:col-span-2 bg-slate-800/30 border border-slate-700/20 backdrop-blur-xl rounded-3xl p-6 hover:border-slate-600/30 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-400" />
                    Activity Overview
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Distribution across all AI features
                  </p>
                </div>
                <div className="flex gap-3">
                  {barData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="hidden sm:inline">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: COLORS.text, fontSize: 12 }}
                    axisLine={{ stroke: COLORS.grid }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: COLORS.text, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.05)" }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={70}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* ─── Pie Chart ──────────────────────────────── */}
            <motion.div
              className="bg-slate-800/30 border border-slate-700/20 backdrop-blur-xl rounded-3xl p-6 hover:border-slate-600/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Completion
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {completionRate}% completed
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">
                    {completionRate}
                    <span className="text-lg text-slate-500">%</span>
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl px-3 py-2">
                          <p className="text-sm font-medium text-white">{payload[0].name}</p>
                          <p className="text-lg font-bold" style={{ color: payload[0].payload.fill || PIE_COLORS[payload[0].payload.index] }}>{payload[0].value}</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                    <span className="text-xs text-slate-400">{entry.name}</span>
                    <span className="text-xs font-semibold text-white">{entry.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* ─── Area Chart ─────────────────────────────── */}
            <div className="bg-slate-800/30 border border-slate-700/20 backdrop-blur-xl rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Flame className="w-5 h-5 text-orange-400" />
                Weekly Activity Trend
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: COLORS.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: COLORS.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="activity"
                    stroke={COLORS.primary[0]}
                    strokeWidth={3}
                    fill="url(#activityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* ─── Feature Usage Cards ────────────────────── */}
            <div className="space-y-4">
              <FeatureCard
                title="AI Summaries"
                value={totalSummaries}
                max={totalPDFs}
                color={COLORS.primary[1]}
                icon={BookOpen}
                description="Concise document summaries"
                delay={0.1}
              />
              <FeatureCard
                title="Flashcards"
                value={totalFlashcards}
                max={totalPDFs}
                color={COLORS.primary[2]}
                icon={BrainCircuit}
                description="Interactive study cards"
                delay={0.2}
              />
              <FeatureCard
                title="Quizzes"
                value={totalQuizzes}
                max={totalPDFs}
                color={COLORS.primary[3]}
                icon={HelpCircle}
                description="Knowledge tests generated"
                delay={0.3}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Achievement Banner ───────────────────────────── */}
      {completionRate >= 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 rounded-3xl p-6 flex items-center gap-4"
        >
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Great Progress!</h3>
            <p className="text-sm text-slate-400">
              You've completed {completionRate}% of all possible AI features. Keep learning!
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── Empty State ────────────────────────────────────── */}
      {totalPDFs === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700/50"
        >
          <div className="p-5 bg-slate-800/30 rounded-3xl inline-block mb-5">
            <Sparkles className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-400 mb-2">No Data Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Upload your first PDF to unlock beautiful analytics and track your learning journey
          </p>
        </motion.div>
      )}
    </section>
  );
}