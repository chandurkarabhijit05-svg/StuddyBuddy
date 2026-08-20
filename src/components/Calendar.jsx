import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Target,
  Flame,
  GraduationCap,
  Edit3,
  Trash2,
  Trophy,
  Timer,
  Zap,
  TrendingUp,
  CalendarDays,
  Bell,
} from "lucide-react";

// ─── Helper Functions ──────────────────────────────────────
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const getToday = () => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Event Type Config ───────────────────────────────────
const eventConfig = {
  study: {
    color: "from-violet-500/20 to-purple-600/20",
    text: "text-violet-300",
    border: "border-violet-500/30",
    icon: BookOpen,
    dot: "bg-violet-400",
    glow: "shadow-violet-500/20",
    label: "Study",
  },
  deadline: {
    color: "from-rose-500/20 to-pink-600/20",
    text: "text-rose-300",
    border: "border-rose-500/30",
    icon: AlertCircle,
    dot: "bg-rose-400",
    glow: "shadow-rose-500/20",
    label: "Deadline",
  },
  exam: {
    color: "from-amber-500/20 to-orange-600/20",
    text: "text-amber-300",
    border: "border-amber-500/30",
    icon: GraduationCap,
    dot: "bg-amber-400",
    glow: "shadow-amber-500/20",
    label: "Exam",
  },
  completed: {
    color: "from-emerald-500/20 to-teal-600/20",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/20",
    label: "Done",
  },
  ai: {
    color: "from-cyan-500/20 to-blue-600/20",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
    icon: Sparkles,
    dot: "bg-cyan-400",
    glow: "shadow-cyan-500/20",
    label: "AI Review",
  },
};

// ─── Animated Counter ────────────────────────────────────
function AnimatedNumber({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
}

// ─── Event Modal ─────────────────────────────────────────
function EventModal({ isOpen, onClose, onSave, selectedDate, editingEvent }) {
  const [title, setTitle] = useState(editingEvent?.title || "");
  const [type, setType] = useState(editingEvent?.type || "study");
  const [time, setTime] = useState(editingEvent?.time || "09:00");
  const [duration, setDuration] = useState(editingEvent?.duration || "60");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setType(editingEvent.type);
      setTime(editingEvent.time);
      setDuration(editingEvent.duration);
    } else {
      setTitle("");
      setType("study");
      setTime("09:00");
      setDuration("60");
    }
  }, [editingEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: editingEvent?.id || Date.now(),
      title,
      type,
      time,
      duration: parseInt(duration),
      date: selectedDate,
      completed: editingEvent?.completed || false,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-slate-900/95 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl shadow-black/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl border border-violet-500/20">
                {editingEvent ? <Edit3 className="w-5 h-5 text-violet-400" /> : <Plus className="w-5 h-5 text-violet-400" />}
              </div>
              <h3 className="text-xl font-bold text-white">
                {editingEvent ? "Edit Session" : "New Study Session"}
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Session Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Math Chapter 5 Review"
                className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer transition-all"
                  >
                    {Object.entries(eventConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Duration <span className="text-slate-600">(minutes)</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="15"
                  max="240"
                  step="15"
                  className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-lg font-bold text-violet-400 w-16 text-right">{duration}m</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3.5 bg-slate-800/50 border border-slate-700/30 rounded-xl text-slate-400 hover:text-white hover:border-slate-600/50 transition-all font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                {editingEvent ? "Update" : "Create Session"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Event Card ────────────────────────────────────────────
function EventCard({ event, onToggle, onEdit, onDelete, index }) {
  const config = eventConfig[event.type] || eventConfig.study;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ delay: index * 0.08, type: "spring", damping: 20 }}
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
        event.completed
          ? "bg-emerald-500/5 border-emerald-500/15 opacity-50"
          : `bg-gradient-to-r ${config.color} ${config.border} hover:scale-[1.02] hover:shadow-lg ${config.glow}`
      }`}
    >
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(event.id)}
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
          event.completed
            ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30"
            : "border-slate-600 hover:border-violet-400 bg-slate-800/50"
        }`}
      >
        {event.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-3.5 h-3.5 ${config.text}`} />
          <p className={`text-sm font-semibold truncate ${event.completed ? "line-through text-slate-500" : "text-white"}`}>
            {event.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-500">{event.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-500">{event.duration}min</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.color} ${config.text} ${config.border}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(event)}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(event.id)}
          className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Study Streak Card ───────────────────────────────────
function StudyStreakCard({ streak }) {
  const flames = Array(7).fill(null);
  const activeFlames = Math.min(streak % 7 || 0, 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 rounded-3xl p-6 backdrop-blur-sm group"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400/80 uppercase tracking-widest font-bold">Study Streak</p>
          </div>
          <p className="text-4xl font-black text-white tracking-tight">
            <AnimatedNumber value={streak} />
            <span className="text-lg text-amber-400/60 font-medium ml-1">days</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {streak >= 7 ? "Incredible consistency! 🔥" : streak >= 3 ? "Great momentum! Keep going!" : "Start your streak today!"}
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl border border-amber-500/20"
        >
          <Trophy className="w-10 h-10 text-amber-400" />
        </motion.div>
      </div>

      {/* Flame indicators */}
      <div className="mt-5 flex gap-2">
        {flames.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex-1 h-10 rounded-xl flex items-center justify-center ${
              i < activeFlames
                ? "bg-gradient-to-t from-amber-500/30 to-orange-500/10 border border-amber-500/30"
                : "bg-slate-800/30 border border-slate-700/20"
            }`}
          >
            {i < activeFlames && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <Flame className="w-4 h-4 text-amber-400" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Progress Card ─────────────────────────────────────────
function ProgressCard({ events }) {
  const completed = events.filter((e) => e.completed).length;
  const total = events.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", damping: 20 }}
      className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-500/20 rounded-3xl p-6 backdrop-blur-sm group"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700" />
      
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-violet-400" />
            <p className="text-xs text-violet-400/80 uppercase tracking-widest font-bold">Monthly Goal</p>
          </div>
          <p className="text-4xl font-black text-white tracking-tight">
            <AnimatedNumber value={completed} />
            <span className="text-lg text-slate-500 font-medium">/{total}</span>
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20">
          <TrendingUp className="w-10 h-10 text-violet-400" />
        </div>
      </div>

      {/* Circular progress */}
      <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-y-0 rounded-full bg-white/20"
          initial={{ width: 0, left: 0 }}
          animate={{ width: `${percentage}%`, left: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: "blur(4px)" }}
        />
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-slate-500">{percentage}% completed this month</p>
        <p className="text-xs font-bold text-violet-400">{total - completed} remaining</p>
      </div>
    </motion.div>
  );
}

// ─── Quick Stats Row ───────────────────────────────────────
function QuickStats({ events }) {
  const totalMinutes = events.reduce((sum, e) => sum + (e.duration || 0), 0);
  const studyEvents = events.filter((e) => e.type === "study").length;
  const aiEvents = events.filter((e) => e.type === "ai").length;

  const stats = [
    { icon: Timer, label: "Study Time", value: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`, color: "text-cyan-400", bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20" },
    { icon: BookOpen, label: "Sessions", value: studyEvents, color: "text-violet-400", bg: "from-violet-500/10 to-purple-500/10", border: "border-violet-500/20" },
    { icon: Sparkles, label: "AI Reviews", value: aiEvents, color: "text-amber-400", bg: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/20" },
    { icon: Zap, label: "Upcoming", value: events.filter((e) => !e.completed).length, color: "text-rose-400", bg: "from-rose-500/10 to-pink-500/10", border: "border-rose-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.08 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-4 backdrop-blur-sm`}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
          <p className="text-xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Calendar Component ───────────────────────────────
export default function Calendar() {
  const today = getToday();
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [currentYear, setCurrentYear] = useState(today.year);
  const [selectedDate, setSelectedDate] = useState(`${today.year}-${today.month}-${today.day}`);
  const [events, setEvents] = useState([
    { id: 1, title: "Math Chapter 5 Review", type: "study", time: "09:00", duration: 60, date: `${today.year}-${today.month}-${today.day}`, completed: false },
    { id: 2, title: "Physics Assignment Due", type: "deadline", time: "23:59", duration: 0, date: `${today.year}-${today.month}-${Math.min(today.day + 2, 28)}`, completed: false },
    { id: 3, title: "AI Flashcard Review", type: "ai", time: "14:00", duration: 45, date: `${today.year}-${today.month}-${Math.max(today.day - 1, 1)}`, completed: true },
    { id: 4, title: "Midterm Exam", type: "exam", time: "10:00", duration: 120, date: `${today.year}-${today.month}-${Math.min(today.day + 5, 28)}`, completed: false },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${currentMonth}-${day}`;
    return events.filter((e) => e.date === dateStr);
  };

  const getSelectedEvents = () => {
    return events
      .filter((e) => e.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleSaveEvent = (event) => {
    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents((prev) => [...prev, event]);
    }
    setEditingEvent(null);
  };

  const handleToggleEvent = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleAddEvent = (day) => {
    setSelectedDate(`${currentYear}-${currentMonth}-${day}`);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const streak = useMemo(() => {
    let streakCount = 0;
    const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const event of sorted) {
      if (event.completed) streakCount++;
      else break;
    }
    return streakCount;
  }, [events]);

  const selectedDayEvents = getSelectedEvents();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* ─── Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20 shadow-lg shadow-violet-500/10"
          >
            <CalendarDays className="w-7 h-7 text-violet-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Study Calendar</h1>
            <p className="text-sm text-slate-500 mt-1">Plan, track, and conquer your learning goals</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAddEvent(today.day)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Add Session
        </motion.button>
      </motion.div>

      {/* ─── Quick Stats ──────────────────────────────────── */}
      <QuickStats events={events} />

      {/* ─── Stats Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StudyStreakCard streak={streak} />
        <ProgressCard events={events} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ─── Calendar Grid ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="lg:col-span-3 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl p-6 shadow-xl"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-violet-500/30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {events.filter((e) => {
                  const d = new Date(e.date);
                  return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                }).length} events this month
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-violet-500/30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-slate-600 uppercase tracking-widest py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${currentMonth}-${day}`;
              const isToday = day === today.day && currentMonth === today.month && currentYear === today.year;
              const isSelected = dateStr === selectedDate;
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;
              const isHovered = hoveredDay === day;

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(dateStr)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`relative aspect-square rounded-2xl p-1.5 flex flex-col items-center justify-start transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-violet-500/30 to-purple-600/30 border-2 border-violet-400/50 shadow-lg shadow-violet-500/20"
                      : isToday
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-400/40 shadow-lg shadow-amber-500/10"
                      : "bg-slate-800/30 border border-slate-800/40 hover:border-slate-600/40 hover:bg-slate-800/50"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      isToday
                        ? "text-amber-400"
                        : isSelected
                        ? "text-violet-300"
                        : "text-slate-400"
                    }`}
                  >
                    {day}
                  </span>

                  {/* Event dots */}
                  {hasEvents && (
                    <div className="flex flex-wrap gap-1 mt-1 justify-center max-w-full px-1">
                      {dayEvents.slice(0, 4).map((event, idx) => {
                        const config = eventConfig[event.type];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`w-1.5 h-1.5 rounded-full ${config.dot} ${
                              event.completed ? "opacity-40" : ""
                            }`}
                          />
                        );
                      })}
                      {dayEvents.length > 4 && (
                        <span className="text-[7px] text-slate-500 font-bold">+</span>
                      )}
                    </div>
                  )}

                  {/* Hover indicator */}
                  <AnimatePresence>
                    {isHovered && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -bottom-1 w-1 h-1 bg-violet-400 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-slate-800/30">
            {Object.entries(eventConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-lg`} style={{ boxShadow: `0 0 8px currentColor` }} />
                <span className="text-xs text-slate-500 font-medium capitalize">{config.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Selected Date Events ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20, delay: 0.1 }}
          className="lg:col-span-2 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl p-6 shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-violet-400" />
                {selectedDate === `${today.year}-${today.month}-${today.day}`
                  ? "Today's Schedule"
                  : "Selected Date"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAddEvent(parseInt(selectedDate.split("-")[2]))}
              className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 text-violet-400 hover:text-white hover:from-violet-500/30 hover:to-purple-600/30 transition-all"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
            <AnimatePresence mode="popLayout">
              {selectedDayEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 flex flex-col items-center"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-5 bg-slate-800/30 rounded-3xl mb-4"
                  >
                    <CalendarIcon className="w-12 h-12 text-slate-700" />
                  </motion.div>
                  <p className="text-sm text-slate-500 font-medium">No sessions planned</p>
                  <p className="text-xs text-slate-600 mt-1">Click + to add your first study session</p>
                </motion.div>
              ) : (
                selectedDayEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onToggle={handleToggleEvent}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    index={index}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Day summary footer */}
          {selectedDayEvents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/30">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{selectedDayEvents.filter((e) => e.completed).length} of {selectedDayEvents.length} completed</span>
                <span>
                  {selectedDayEvents.reduce((sum, e) => sum + e.duration, 0)}m total
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Event Modal ──────────────────────────────────── */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />
    </section>
  );
}