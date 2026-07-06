import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Target,
  BrainCircuit,
  Coffee,
  Zap,
  Plus,
  X,
  GripVertical,
  CheckCircle2,
  Circle,
  Timer,
  TrendingUp,
  Flame,
  Moon,
  Sun,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  BookOpen,
  MoreHorizontal,
  Trash2,
  Edit3,
  Save,
  Lightbulb,
} from "lucide-react";

// ─── Time Block Component ────────────────────────────────
function TimeBlock({ block, onToggle, onEdit, onDelete, isActive, timeLeft }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeConfig = {
    study: { bg: "from-violet-500/15 to-purple-500/15", border: "border-violet-500/20", icon: BookOpen, color: "text-violet-400" },
    break: { bg: "from-emerald-500/15 to-teal-500/15", border: "border-emerald-500/20", icon: Coffee, color: "text-emerald-400" },
    review: { bg: "from-amber-500/15 to-orange-500/15", border: "border-amber-500/20", icon: BrainCircuit, color: "text-amber-400" },
    deep: { bg: "from-rose-500/15 to-pink-500/15", border: "border-rose-500/20", icon: Zap, color: "text-rose-400" },
  };

  const config = typeConfig[block.type] || typeConfig.study;
  const Icon = config.icon;

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`relative group rounded-2xl border backdrop-blur-sm overflow-hidden ${
        block.completed ? "bg-slate-800/20 border-slate-700/20 opacity-50" : `bg-gradient-to-r ${config.bg} ${config.border}`
      } ${isActive ? "ring-2 ring-violet-500/30" : ""}`}
    >
      {/* Active Progress Bar */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-violet-400 to-purple-400"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / (block.duration * 60)) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      )}

      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing text-slate-600">
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Completion Toggle */}
          <button
            onClick={() => onToggle(block.id)}
            className="flex-shrink-0"
          >
            {block.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className={`w-5 h-5 ${config.color} hover:opacity-70 transition-opacity`} />
            )}
          </button>

          {/* Icon */}
          <div className={`p-2 rounded-xl bg-white/5 ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-semibold truncate ${block.completed ? "line-through text-slate-500" : "text-white"}`}>
                {block.title}
              </h4>
              {block.aiRecommended && (
                <span className="flex-shrink-0 px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] text-cyan-400 font-medium">
                  AI
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {block.startTime} - {block.endTime}
              </span>
              <span className="text-xs text-slate-600">
                {formatTime(block.duration)}
              </span>
              {isActive && (
                <span className="text-xs text-violet-400 font-mono">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEdit(block)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(block.id)}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-white/5">
                {block.description && (
                  <p className="text-xs text-slate-500 mb-2">{block.description}</p>
                )}
                {block.subject && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Subject:</span>
                    <span className="text-xs text-slate-300 px-2 py-1 bg-white/5 rounded-lg">{block.subject}</span>
                  </div>
                )}
                {block.priority && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">Priority:</span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i < block.priority ? "bg-amber-400" : "bg-slate-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Focus Timer ─────────────────────────────────────────
function FocusTimer({ activeBlock, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (activeBlock) {
      setTimeLeft(activeBlock.duration * 60);
      setIsRunning(false);
    }
  }, [activeBlock]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  if (!activeBlock) return null;

  const progress = ((activeBlock.duration * 60 - timeLeft) / (activeBlock.duration * 60)) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-3xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-violet-400/70 uppercase tracking-wider font-medium">Focus Timer</p>
          <h3 className="text-lg font-bold text-white mt-1">{activeBlock.title}</h3>
        </div>
        <div className="p-3 bg-violet-500/15 rounded-2xl">
          <Timer className="w-6 h-6 text-violet-400" />
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center py-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-violet-400"
            strokeDasharray={2 * Math.PI * 56}
            animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-bold text-white font-mono">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Pause" : "Start Focus"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTimeLeft(activeBlock.duration * 60);
            setIsRunning(false);
          }}
          className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── AI Suggestions ────────────────────────────────────────
function AISuggestions({ onApply }) {
  const suggestions = [
    { id: 1, title: "Pomodoro Sprint", description: "25min study + 5min break x4", type: "study", duration: 25, icon: Zap },
    { id: 2, title: "Deep Work Block", description: "90min focused session", type: "deep", duration: 90, icon: BrainCircuit },
    { id: 3, title: "Review & Recall", description: "30min active recall practice", type: "review", duration: 30, icon: Target },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-cyan-500/15 rounded-xl">
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">AI Suggestions</h3>
          <p className="text-xs text-slate-500">Optimized for your learning style</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion.id}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onApply(suggestion)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/30 transition-all text-left"
          >
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <suggestion.icon className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{suggestion.title}</p>
              <p className="text-xs text-slate-500">{suggestion.description}</p>
            </div>
            <Plus className="w-4 h-4 text-cyan-400" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Daily Stats ───────────────────────────────────────────
function DailyStats({ blocks }) {
  const totalMinutes = blocks.reduce((sum, b) => sum + (b.completed ? b.duration : 0), 0);
  const completedCount = blocks.filter((b) => b.completed).length;
  const totalCount = blocks.length;
  const studyMinutes = blocks.filter((b) => b.type === "study" && b.completed).reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 text-center"
      >
        <p className="text-2xl font-bold text-white">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
        <p className="text-xs text-slate-500 mt-1">Study Time</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 text-center"
      >
        <p className="text-2xl font-bold text-white">{completedCount}/{totalCount}</p>
        <p className="text-xs text-slate-500 mt-1">Completed</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 text-center"
      >
        <p className="text-2xl font-bold text-white">{Math.floor(studyMinutes / 60)}h</p>
        <p className="text-xs text-slate-500 mt-1">Deep Focus</p>
      </motion.div>
    </div>
  );
}

// ─── Add Block Modal ─────────────────────────────────────
function BlockModal({ isOpen, onClose, onSave, editingBlock, selectedDate }) {
  const [title, setTitle] = useState(editingBlock?.title || "");
  const [type, setType] = useState(editingBlock?.type || "study");
  const [duration, setDuration] = useState(editingBlock?.duration || 25);
  const [startTime, setStartTime] = useState(editingBlock?.startTime || "09:00");
  const [subject, setSubject] = useState(editingBlock?.subject || "");
  const [priority, setPriority] = useState(editingBlock?.priority || 2);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, mins] = startTime.split(":").map(Number);
    const endHours = hours + Math.floor((mins + duration) / 60);
    const endMins = (mins + duration) % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

    onSave({
      id: editingBlock?.id || Date.now(),
      title,
      type,
      duration,
      startTime,
      endTime,
      subject,
      priority,
      completed: editingBlock?.completed || false,
      date: selectedDate,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-slate-900/95 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingBlock ? "Edit Block" : "Add Study Block"}
            </h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Math Practice"
                className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/40"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/40"
                >
                  <option value="study">Study</option>
                  <option value="deep">Deep Work</option>
                  <option value="review">Review</option>
                  <option value="break">Break</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Duration (min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="5"
                  max="240"
                  step="5"
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Math"
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      priority === level
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-slate-800/50 text-slate-500 border border-slate-700/30"
                    }`}
                  >
                    {level === 1 ? "Low" : level === 2 ? "Medium" : "High"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl"
              >
                {editingBlock ? "Update" : "Add Block"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Planner Component ──────────────────────────────
export default function Planner() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const [blocks, setBlocks] = useState([
    { id: 1, title: "Morning Review", type: "review", duration: 30, startTime: "08:00", endTime: "08:30", subject: "Physics", priority: 2, completed: true, date: today },
    { id: 2, title: "Deep Math Study", type: "deep", duration: 90, startTime: "09:00", endTime: "10:30", subject: "Mathematics", priority: 3, completed: false, date: today },
    { id: 3, title: "Coffee Break", type: "break", duration: 15, startTime: "10:30", endTime: "10:45", subject: "", priority: 1, completed: false, date: today },
    { id: 4, title: "Flashcard Practice", type: "study", duration: 45, startTime: "11:00", endTime: "11:45", subject: "Chemistry", priority: 2, completed: false, date: today, aiRecommended: true },
    { id: 5, title: "Lunch Break", type: "break", duration: 60, startTime: "12:00", endTime: "13:00", subject: "", priority: 1, completed: false, date: today },
  ]);

  const todayBlocks = blocks.filter((b) => b.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const activeBlock = activeBlockId ? blocks.find((b) => b.id === activeBlockId) : null;

  const handleToggle = (id) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b)));
  };

  const handleDelete = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const handleEdit = (block) => {
    setEditingBlock(block);
    setModalOpen(true);
  };

  const handleSave = (block) => {
    if (editingBlock) {
      setBlocks((prev) => prev.map((b) => (b.id === block.id ? block : b)));
    } else {
      setBlocks((prev) => [...prev, block]);
    }
    setEditingBlock(null);
  };

  const handleApplySuggestion = (suggestion) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    const startTime = `${hours}:${mins}`;
    const endHours = now.getHours() + Math.floor((now.getMinutes() + suggestion.duration) / 60);
    const endMins = (now.getMinutes() + suggestion.duration) % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

    const newBlock = {
      id: Date.now(),
      title: suggestion.title,
      type: suggestion.type,
      duration: suggestion.duration,
      startTime,
      endTime,
      subject: "",
      priority: 2,
      completed: false,
      date: selectedDate,
      aiRecommended: true,
    };

    setBlocks((prev) => [...prev, newBlock]);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20">
            <CalendarDays className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Study Planner</h1>
            <p className="text-sm text-slate-500">Organize your learning sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/40"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingBlock(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mb-8">
        <DailyStats blocks={todayBlocks} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Time Blocks List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              Today's Schedule
            </h2>
            <span className="text-xs text-slate-500">{todayBlocks.length} blocks</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {todayBlocks.map((block) => (
                <TimeBlock
                  key={block.id}
                  block={block}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isActive={activeBlockId === block.id}
                  timeLeft={activeBlockId === block.id ? block.duration * 60 : 0}
                  onClick={() => setActiveBlockId(block.id)}
                />
              ))}
            </AnimatePresence>

            {todayBlocks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <CalendarDays className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No study blocks for this day</p>
                <p className="text-sm text-slate-600 mt-1">Add a block or use AI suggestions</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Focus Timer */}
          <FocusTimer
            activeBlock={activeBlock}
            onComplete={() => handleToggle(activeBlockId)}
          />

          {/* AI Suggestions */}
          <AISuggestions onApply={handleApplySuggestion} />

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/30 border border-slate-700/30 rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Study Tips</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Take a 5-min break every 25 minutes",
                "Review notes within 24 hours",
                "Use active recall instead of re-reading",
                "Sleep helps consolidate memories",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-violet-400 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <BlockModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSave}
        editingBlock={editingBlock}
        selectedDate={selectedDate}
      />
    </section>
  );
}