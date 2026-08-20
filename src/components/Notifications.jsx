import { useState, useEffect, useCallback } from "react";
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
  Flame,
  Trophy,
  Star,
  Pin,
  Filter,
  CheckCheck,
  MailOpen,
  Waves,
} from "lucide-react";

// ─── Sound Effect (Web Audio API) ─────────────────────────
function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (e) {
    console.log("Audio not supported");
  }
}

// ─── Icon Configuration ───────────────────────────────────
const iconConfig = {
  upload: {
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    glow: "shadow-blue-500/20",
    dot: "bg-blue-400",
    label: "Upload",
  },
  ai: {
    icon: BrainCircuit,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    glow: "shadow-violet-500/20",
    dot: "bg-violet-400",
    label: "AI",
  },
  progress: {
    icon: Rocket,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    glow: "shadow-amber-500/20",
    dot: "bg-amber-400",
    label: "Progress",
  },
  streak: {
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    glow: "shadow-emerald-500/20",
    dot: "bg-emerald-400",
    label: "Streak",
  },
  alert: {
    icon: AlertCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    glow: "shadow-rose-500/20",
    dot: "bg-rose-400",
    label: "Alert",
  },
  milestone: {
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/20 via-yellow-500/5 to-transparent",
    glow: "shadow-amber-500/20",
    dot: "bg-amber-400",
    label: "Milestone",
  },
};

// ─── Animated Counter ─────────────────────────────────────
function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count}</span>;
}

// ─── Floating Particle Effect ─────────────────────────────
function FloatingParticles({ isHovered, config }) {
  if (!isHovered) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [-10, -40 - Math.random() * 20],
            x: (Math.random() - 0.5) * 60,
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className={`absolute bottom-4 left-1/2 w-1 h-1 rounded-full ${config.dot}`}
        />
      ))}
    </div>
  );
}

// ─── Notification Item Component ─────────────────────────
function NotificationItem({ notification, index, onDismiss, onRead, soundEnabled }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const config = iconConfig[notification.type] || iconConfig.upload;
  const Icon = config.icon;

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  }, [notification.id, onDismiss]);

  const handleRead = useCallback(() => {
    if (soundEnabled && !notification.read) playNotificationSound();
    onRead(notification.id);
  }, [notification.id, onRead, soundEnabled, notification.read]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50, scale: 0.9, y: 20 }}
      animate={isExiting ? { opacity: 0, x: 100, scale: 0.8 } : { opacity: 1, x: 0, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.3 } }}
      transition={{ 
        delay: index * 0.08, 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500 overflow-hidden
        ${notification.read
          ? "bg-slate-800/10 border-slate-700/10 opacity-50 hover:opacity-70"
          : `bg-gradient-to-r ${config.gradient} ${config.border} backdrop-blur-xl hover:shadow-lg ${config.glow}`
        }
      `}
    >
      {/* Floating Particles */}
      <FloatingParticles isHovered={isHovered} config={config} />

      {/* Animated Background Glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        className={`absolute inset-0 bg-gradient-to-r ${config.gradient} pointer-events-none`}
      />

      {/* Shine Effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Unread Pulse Indicator */}
      {!notification.read && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full bg-gradient-to-b ${config.gradient.split(" ")[0]} ${config.dot}`}
        />
      )}

      {/* Icon Container */}
      <motion.div
        animate={{ 
          rotate: isHovered ? [0, -5, 5, 0] : 0,
          scale: isHovered ? 1.1 : 1 
        }}
        transition={{ duration: 0.5 }}
        className={`
          relative flex-shrink-0 p-3.5 rounded-2xl 
          ${config.bg} ${config.border} border
          transition-all duration-300
        `}
      >
        <Icon className={`w-6 h-6 ${config.color}`} />
        
        {/* Icon Glow */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className={`absolute inset-0 rounded-2xl ${config.bg} blur-xl`}
        />
        
        {/* Unread Dot */}
        {!notification.read && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${config.dot} border-2 border-slate-900`}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`text-sm font-bold ${notification.read ? "text-slate-500" : "text-white"}`}>
                {notification.title}
              </h4>
              {!notification.read && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bg} ${config.color} ${config.border} border`}>
                  {config.label}
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${notification.read ? "text-slate-600" : "text-slate-300"}`}>
              {notification.text}
            </p>
          </div>
        </div>

        {/* Meta & Actions */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {notification.time}
          </div>

          {/* Action Buttons - Always visible on mobile, hover on desktop */}
          <div className="flex items-center gap-2 ml-auto">
            {!notification.read && (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-medium transition-all"
              >
                <Check className="w-3 h-3" />
                Mark read
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDismiss}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 flex flex-col items-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="p-6 bg-slate-800/20 rounded-3xl border border-slate-700/20 mb-6"
      >
        <MailOpen className="w-12 h-12 text-slate-600" />
      </motion.div>
      <h3 className="text-xl font-bold text-slate-400 mb-2">
        {filter === "unread" ? "No Unread Messages" : "All Caught Up!"}
      </h3>
      <p className="text-sm text-slate-600 max-w-xs">
        {filter === "unread" 
          ? "You've read all your notifications. Great job staying on top!" 
          : "No notifications at the moment. Check back later for updates."}
      </p>
    </motion.div>
  );
}

// ─── Achievement Banner ───────────────────────────────────
function AchievementBanner({ totalPDFs }) {
  if (totalPDFs < 5) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 rounded-3xl p-6 mb-6"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="relative flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl border border-amber-500/20"
        >
          <Trophy className="w-8 h-8 text-amber-400" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Milestone Unlocked!
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            You've uploaded <span className="text-amber-400 font-bold">{totalPDFs} PDFs</span>. Keep the momentum going!
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Notifications Component ────────────────────────
export default function Notifications({ totalPDFs = 0 }) {
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState("all");

  // Generate notifications
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

    if (totalPDFs >= 5) {
      baseNotifications.unshift({
        id: 4,
        type: "milestone",
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
    if (soundEnabled) playNotificationSound();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* ─── Header ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="relative p-3 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20 shadow-lg shadow-violet-500/10"
          >
            <Bell className="w-6 h-6 text-violet-400" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30"
              >
                <AnimatedCounter value={unreadCount} />
              </motion.span>
            )}
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Notifications</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`
            p-3 rounded-2xl transition-all duration-300 border
            ${soundEnabled
              ? "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20"
              : "bg-slate-800/50 text-slate-500 border-slate-700/30 hover:text-slate-300"
            }
          `}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={soundEnabled ? "on" : "off"}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ─── Achievement Banner ─────────────────────────── */}
      <AchievementBanner totalPDFs={totalPDFs} />

      {/* ─── Filter Tabs ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-1 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-1">
          {[
            { id: "all", label: "All", icon: Filter },
            { id: "unread", label: "Unread", icon: MailOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${filter === tab.id
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-300"
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`
                text-xs px-2 py-0.5 rounded-full font-bold
                ${filter === tab.id ? "bg-white/10 text-white" : "bg-slate-700/50 text-slate-500"}
              `}>
                {tab.id === "all" ? notifications.length : unreadCount}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-sm font-medium transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-sm font-medium transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Notifications List ─────────────────────────── */}
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
                soundEnabled={soundEnabled}
              />
            ))}
          </div>
        ) : (
          <EmptyState filter={filter} />
        )}
      </AnimatePresence>

      {/* ─── Study Progress Footer ──────────────────────── */}
      {totalPDFs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 20 }}
          className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-3xl p-6"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl border border-emerald-500/20"
            >
              <Flame className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Study Progress
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                <span className="text-emerald-400 font-bold">{totalPDFs} PDF{totalPDFs !== 1 ? "s" : ""}</span> uploaded • Keep the momentum going!
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">
                <AnimatedCounter value={Math.min(totalPDFs * 10, 100)} />%
              </p>
              <p className="text-xs text-slate-500">engagement</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(totalPDFs * 10, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}