import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  FileText,
  BrainCircuit,
  Rocket,
  Zap,
  Check,
  X,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";

// ─── Notification Item Component ─────────────────────────
function NotificationItem({ notification, index, onDismiss, onRead }) {
  const [isHovered, setIsHovered] = useState(false);

  const iconConfig = {
    upload: {
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    ai: {
      icon: BrainCircuit,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      gradient: "from-violet-500/20 to-purple-500/20",
    },
    progress: {
      icon: Rocket,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    streak: {
      icon: Zap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    alert: {
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      gradient: "from-rose-500/20 to-pink-500/20",
    },
  };

  const config = iconConfig[notification.type] || iconConfig.upload;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        notification.read
          ? "bg-slate-800/20 border-slate-700/20 opacity-60"
          : `bg-gradient-to-r ${config.gradient} ${config.border} backdrop-blur-sm`
      }`}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <motion.div
          layoutId={`unread-${notification.id}`}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-violet-400 to-blue-400 rounded-r-full"
        />
      )}

      {/* Icon */}
      <div
        className={`relative flex-shrink-0 p-3 rounded-xl ${config.bg} ${config.border} border`}
      >
        <Icon className={`w-5 h-5 ${config.color}`} />
        {!notification.read && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${config.bg.replace("/10", "")}`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4
              className={`text-sm font-semibold ${
                notification.read ? "text-slate-500" : "text-slate-200"
              }`}
            >
              {notification.title}
            </h4>
            <p
              className={`text-sm mt-1 leading-relaxed ${
                notification.read ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {notification.text}
            </p>
          </div>
        </div>

        {/* Meta & Actions */}
        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Clock className="w-3 h-3" />
            {notification.time}
          </span>

          {/* Hover Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                {!notification.read && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRead(notification.id)}
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDismiss(notification.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Dismiss"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="inline-flex p-4 bg-slate-800/30 rounded-2xl mb-4">
        <Bell className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-500 mb-1">
        All Caught Up!
      </h3>
      <p className="text-sm text-slate-600">
        No new notifications at the moment
      </p>
    </motion.div>
  );
}

// ─── Main Notifications Component ────────────────────────
export default function Notifications({ totalPDFs = 0 }) {
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread

  // Generate notifications based on props
  useEffect(() => {
    const now = new Date();
    const timeString = (date) => {
      const diff = Math.floor((now - date) / 60000);
      if (diff < 1) return "Just now";
      if (diff < 60) return `${diff}m ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
      return `${Math.floor(diff / 1440)}d ago`;
    };

    const baseNotifications = [
      {
        id: 1,
        type: "upload",
        title: "PDF Upload Complete",
        text: `You have uploaded ${totalPDFs} PDF${totalPDFs !== 1 ? "s" : ""}. Ready to generate study materials!`,
        time: timeString(new Date(Date.now() - 1000 * 60 * 5)),
        read: false,
      },
      {
        id: 2,
        type: "ai",
        title: "AI Features Ready",
        text: "Summary, Flashcards, and Quiz generation are now available for your documents.",
        time: timeString(new Date(Date.now() - 1000 * 60 * 30)),
        read: false,
      },
      {
        id: 3,
        type: "progress",
        title: "Study Progress Tip",
        text: "Keep uploading PDFs to improve your study progress and track your learning streak!",
        time: timeString(new Date(Date.now() - 1000 * 60 * 60 * 2)),
        read: true,
      },
    ];

    // Add dynamic notification based on totalPDFs
    if (totalPDFs >= 5) {
      baseNotifications.unshift({
        id: 4,
        type: "streak",
        title: "Milestone Reached! 🎉",
        text: `Amazing! You've uploaded ${totalPDFs} PDFs. You're on fire!`,
        time: "Just now",
        read: false,
      });
    }

    if (totalPDFs === 0) {
      baseNotifications.push({
        id: 5,
        type: "alert",
        title: "Get Started",
        text: "Upload your first PDF to unlock AI-powered study tools.",
        time: timeString(new Date(Date.now() - 1000 * 60 * 60 * 24)),
        read: false,
      });
    }

    setNotifications(baseNotifications);
  }, [totalPDFs]);

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20">
            <Bell className="w-5 h-5 text-violet-400" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <p className="text-sm text-slate-500">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl transition-all ${
              soundEnabled
                ? "bg-violet-500/10 text-violet-400"
                : "bg-slate-800/50 text-slate-500"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-6"
      >
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          All
          <span className="ml-2 text-xs text-slate-600">{notifications.length}</span>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "unread"
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Unread
          <span className="ml-2 text-xs text-slate-600">{unreadCount}</span>
        </button>

        <div className="flex-1" />

        {unreadCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllRead}
            className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Mark all read
          </motion.button>
        )}

        {notifications.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear all
          </motion.button>
        )}
      </motion.div>

      {/* Notifications List */}
      <AnimatePresence mode="popLayout">
        {filteredNotifications.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                index={index}
                onDismiss={handleDismiss}
                onRead={handleRead}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>

      {/* Study Progress Mini Card */}
      {totalPDFs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/15 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Study Progress
              </p>
              <p className="text-xs text-emerald-400/70 mt-0.5">
                {totalPDFs} PDF{totalPDFs !== 1 ? "s" : ""} uploaded • Keep the
                momentum going!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}