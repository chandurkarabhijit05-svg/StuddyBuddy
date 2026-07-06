import { useState, useMemo } from "react";
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
  MoreHorizontal,
  Trash2,
  Edit3,
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
  study: { color: "bg-violet-500/20 text-violet-300 border-violet-500/30", icon: BookOpen, dot: "bg-violet-400" },
  deadline: { color: "bg-rose-500/20 text-rose-300 border-rose-500/30", icon: AlertCircle, dot: "bg-rose-400" },
  exam: { color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: GraduationCap, dot: "bg-amber-400" },
  completed: { color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: CheckCircle2, dot: "bg-emerald-400" },
  ai: { color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: Sparkles, dot: "bg-cyan-400" },
};

// ─── Event Modal ─────────────────────────────────────────
function EventModal({ isOpen, onClose, onSave, selectedDate, editingEvent }) {
  const [title, setTitle] = useState(editingEvent?.title || "");
  const [type, setType] = useState(editingEvent?.type || "study");
  const [time, setTime] = useState(editingEvent?.time || "09:00");
  const [duration, setDuration] = useState(editingEvent?.duration || "60");

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
    setTitle("");
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
          className="w-full max-w-md bg-slate-900/95 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingEvent ? "Edit Event" : "Add Study Session"}
            </h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
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
                placeholder="e.g., Math Chapter 5 Review"
                className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/10"
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
                  <option value="study">Study Session</option>
                  <option value="deadline">Deadline</option>
                  <option value="exam">Exam</option>
                  <option value="ai">AI Review</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                max="480"
                step="15"
                className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/40"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all"
              >
                {editingEvent ? "Update" : "Add Event"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Event Card ────────────────────────────────────────────
function EventCard({ event, onToggle, onEdit, onDelete }) {
  const config = eventConfig[event.type] || eventConfig.study;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group relative flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all ${
        event.completed
          ? "bg-emerald-500/10 border-emerald-500/20 opacity-60"
          : `${config.color} hover:scale-[1.02]`
      }`}
    >
      <button
        onClick={() => onToggle(event.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          event.completed
            ? "bg-emerald-500 border-emerald-500"
            : "border-slate-600 hover:border-violet-400"
        }`}
      >
        {event.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${event.completed ? "line-through text-slate-500" : "text-white"}`}>
          {event.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-500">
            {event.time} • {event.duration}min
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(event)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(event.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Study Streak Card ───────────────────────────────────
function StudyStreakCard({ streak }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-amber-400/70 uppercase tracking-wider font-medium">Study Streak</p>
          <p className="text-3xl font-bold text-white mt-1">
            {streak} <span className="text-lg text-amber-400/60">days</span>
          </p>
        </div>
        <div className="p-3 bg-amber-500/15 rounded-xl">
          <Flame className="w-8 h-8 text-amber-400" />
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${i < streak % 7 ? "bg-amber-400" : "bg-slate-700/50"}`}
          />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-violet-400/70 uppercase tracking-wider font-medium">This Month</p>
          <p className="text-3xl font-bold text-white mt-1">
            {completed}/{total}
          </p>
        </div>
        <div className="p-3 bg-violet-500/15 rounded-xl">
          <Target className="w-8 h-8 text-violet-400" />
        </div>
      </div>
      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">{percentage}% completed</p>
    </motion.div>
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
    { id: 2, title: "Physics Assignment Due", type: "deadline", time: "23:59", duration: 0, date: `${today.year}-${today.month}-${today.day + 2}`, completed: false },
    { id: 3, title: "AI Flashcard Review", type: "ai", time: "14:00", duration: 45, date: `${today.year}-${today.month}-${today.day - 1}`, completed: true },
    { id: 4, title: "Midterm Exam", type: "exam", time: "10:00", duration: 120, date: `${today.year}-${today.month}-${today.day + 5}`, completed: false },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${currentMonth}-${day}`;
    return events.filter((e) => e.date === dateStr);
  };

  const getSelectedEvents = () => {
    return events.filter((e) => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
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
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)));
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
    // Simple streak calculation
    let streakCount = 0;
    const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const event of sorted) {
      if (event.completed) streakCount++;
      else break;
    }
    return streakCount;
  }, [events]);

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
            <CalendarIcon className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Study Calendar</h1>
            <p className="text-sm text-slate-500">Plan and track your learning journey</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAddEvent(today.day)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Session
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StudyStreakCard streak={streak} />
        <ProgressCard events={events} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl p-6"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for padding */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${currentMonth}-${day}`;
              const isToday = day === today.day && currentMonth === today.month && currentYear === today.year;
              const isSelected = dateStr === selectedDate;
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-start transition-all ${
                    isSelected
                      ? "bg-violet-500/20 border-2 border-violet-500/50"
                      : isToday
                      ? "bg-slate-800/50 border-2 border-amber-500/30"
                      : "bg-slate-800/20 border border-slate-800/30 hover:border-slate-600/30"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isToday ? "text-amber-400" : isSelected ? "text-violet-300" : "text-slate-400"
                    }`}
                  >
                    {day}
                  </span>
                  {hasEvents && (
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      {dayEvents.slice(0, 3).map((event, idx) => {
                        const config = eventConfig[event.type];
                        return (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                          />
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-slate-500">+</span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-800/30">
            {Object.entries(eventConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className="text-xs text-slate-500 capitalize">{key}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Selected Date Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                {selectedDate === `${today.year}-${today.month}-${today.day}` ? "Today" : "Selected Date"}
              </h3>
              <p className="text-sm text-slate-500">
                {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAddEvent(parseInt(selectedDate.split("-")[2]))}
              className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <AnimatePresence mode="popLayout">
              {getSelectedEvents().length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CalendarIcon className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">No events for this day</p>
                  <p className="text-xs text-slate-700 mt-1">Click + to add a study session</p>
                </motion.div>
              ) : (
                getSelectedEvents().map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onToggle={handleToggleEvent}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Event Modal */}
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