import { useState, useMemo } from "react";
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
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  FileText,
  BrainCircuit,
  HelpCircle,
  Activity,
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────────
const COLORS = {
  primary: ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899"],
  pie: ["#22c55e", "#ef4444"],
  grid: "rgba(148, 163, 184, 0.1)",
  text: "#94a3b8",
};

const PIE_COLORS = ["#22c55e", "#ef4444"];

// ─── Custom Tooltip for Bar Chart ──────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const icons = {
    PDFs: <FileText className="w-4 h-4" />,
    Summary: <BookOpen className="w-4 h-4" />,
    Flashcards: <BrainCircuit className="w-4 h-4" />,
    Quiz: <HelpCircle className="w-4 h-4" />,
  };

  return (
    <div className="bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-2 mb-2">
        {icons[label] || <Activity className="w-4 h-4" />}
        <span className="font-semibold text-slate-200">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {payload[0].value}
      </p>
    </div>
  );
};

// ─── Custom Tooltip for Pie Chart ──────────────────────────
const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const isCompleted = payload[0].name === "Completed";

  return (
    <div className="bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`w-3 h-3 rounded-full ${
            isCompleted ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="font-medium text-slate-200">
          {payload[0].name}
        </span>
      </div>
      <p className="text-xl font-bold text-white">
        {payload[0].value}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {isCompleted ? "Tasks finished" : "Tasks remaining"}
      </p>
    </div>
  );
};

// ─── Stat Card Component ───────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="relative group"
  >
    <div
      className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
    />
    <div className="relative bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm rounded-2xl p-4 hover:bg-slate-800/60 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-r ${color} bg-opacity-20`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-slate-500" />
      </div>
      <p className="text-2xl font-bold text-white mt-3">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  </motion.div>
);

// ─── Main Analytics Component ──────────────────────────────
export default function Analytics({
  totalPDFs = 0,
  totalSummaries = 0,
  totalFlashcards = 0,
  totalQuizzes = 0,
}) {
  const [activeChart, setActiveChart] = useState("bar");

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
      { name: "Pending", value: totalPending },
    ],
    [totalCompleted, totalPending]
  );

  const stats = [
    {
      icon: FileText,
      label: "PDFs Uploaded",
      value: totalPDFs,
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: BookOpen,
      label: "Summaries",
      value: totalSummaries,
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: BrainCircuit,
      label: "Flashcards",
      value: totalFlashcards,
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: HelpCircle,
      label: "Quizzes",
      value: totalQuizzes,
      color: "from-pink-500 to-rose-600",
    },
  ];

  // ─── Completion Percentage ────────────────────────────────
  const completionRate =
    totalPDFs > 0
      ? Math.round((totalCompleted / (totalPDFs * 3)) * 100)
      : 0;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ─── Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
        </div>
        <p className="text-slate-400 text-lg ml-1">
          Track your learning progress and activity insights
        </p>
      </motion.div>

      {/* ─── Stats Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>

      {/* ─── Charts Section ───────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Bar Chart ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-slate-800/30 border border-slate-700/20 backdrop-blur-xl rounded-3xl p-6 hover:border-slate-600/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Activity Overview
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Distribution across all features
              </p>
            </div>
            <div className="flex gap-2">
              {barData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 text-xs text-slate-400"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="hidden sm:inline">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grid}
                vertical={false}
              />
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
              <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={60}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ─── Pie Chart ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-slate-800/30 border border-slate-700/20 backdrop-blur-xl rounded-3xl p-6 hover:border-slate-600/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-4 border-green-500/50" />
                Completion Rate
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {completionRate}% of all tasks completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">
                {completionRate}
                <span className="text-lg text-slate-500">%</span>
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`slice-${index}`}
                    fill={PIE_COLORS[index]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index] }}
                />
                <span className="text-sm text-slate-300">
                  {entry.name}
                </span>
                <span className="text-sm font-semibold text-white">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Empty State ────────────────────────────────────── */}
      {totalPDFs === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center py-16 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700/50"
        >
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400">
            No data yet
          </h3>
          <p className="text-slate-500 mt-1">
            Upload your first PDF to see analytics
          </p>
        </motion.div>
      )}
    </section>
  );
}