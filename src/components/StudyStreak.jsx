import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Calendar,
  Zap,
  Star,
  Target,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  Lock,
  CheckCircle2,
  FileText,
} from "lucide-react";

function MilestoneBadge({ days, achieved, index }) {
  const milestones = [
    { days: 3, label: "Rookie", icon: Star, color: "from-slate-500/20 to-slate-600/20", iconColor: "text-slate-400" },
    { days: 7, label: "Weekly", icon: Calendar, color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
    { days: 14, label: "Bi-Weekly", icon: Zap, color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { days: 21, label: "Dedicated", icon: Target, color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
    { days: 30, label: "Master", icon: Crown, color: "from-amber-500/30 to-yellow-500/30", iconColor: "text-amber-300" },
  ];

  const milestone = milestones[index];
  const Icon = milestone.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
        achieved
          ? `bg-gradient-to-br ${milestone.color} border-amber-500/30 shadow-lg shadow-amber-500/5`
          : "bg-slate-800/30 border-slate-700/30 opacity-50"
      }`}
    >
      <div className={`p-2.5 rounded-xl ${achieved ? "bg-amber-500/20" : "bg-slate-700/30"}`}>
        {achieved ? <Icon className={`w-5 h-5 ${milestone.iconColor}`} /> : <Lock className="w-5 h-5 text-slate-600" />}
      </div>
      <span className={`text-xs font-bold ${achieved ? "text-amber-300" : "text-slate-600"}`}>{milestone.days}D</span>
      <span className={`text-[10px] ${achieved ? "text-amber-400/70" : "text-slate-700"}`}>{milestone.label}</span>
      {achieved && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

function AnimatedFlame({ streak }) {
  const flameCount = Math.min(streak, 5);
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="relative">
          <Flame className="w-20 h-20 text-orange-400" />
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0">
            <Flame className="w-20 h-20 text-amber-400 opacity-60" />
          </motion.div>
        </div>
      </motion.div>
      {flameCount > 1 && (
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: 0.3, repeat: Infinity }} className="absolute -left-6 top-4">
          <Flame className="w-8 h-8 text-orange-500/40" />
        </motion.div>
      )}
      {flameCount > 2 && (
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, delay: 0.6, repeat: Infinity }} className="absolute -right-6 top-2">
          <Flame className="w-10 h-10 text-amber-500/40" />
        </motion.div>
      )}
    </div>
  );
}

function WeeklyProgress({ streak }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDay = new Date().getDay();
  const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;

  return (
    <div className="flex items-center gap-2">
      {days.map((day, i) => {
        const isActive = i <= adjustedDay && streak > i;
        const isToday = i === adjustedDay;
        return (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
              isActive ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20" :
              isToday ? "bg-orange-500/20 border border-orange-500/30 text-orange-400" :
              "bg-slate-800/50 text-slate-600"
            }`}>
              {isActive ? <CheckCircle2 className="w-4 h-4" /> : day}
            </div>
            {isToday && <div className="w-1 h-1 rounded-full bg-orange-400" />}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function StudyStreak({ totalPDFs = 0 }) {
  const streak = Math.min(totalPDFs, 30);
  const nextMilestone = streak < 3 ? 3 : streak < 7 ? 7 : streak < 14 ? 14 : streak < 21 ? 21 : 30;
  const progressToNext = streak > 0 ? (streak / nextMilestone) * 100 : 0;
  const daysUntilNext = nextMilestone - streak;

  const getMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak < 3) return "Great start! Keep going!";
    if (streak < 7) return "You're building momentum!";
    if (streak < 14) return "Weekly warrior! Impressive!";
    if (streak < 21) return "Halfway to mastery!";
    if (streak < 30) return "Almost legendary!";
    return "Legendary streak! You're unstoppable!";
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-900/40 border border-orange-500/20 rounded-3xl backdrop-blur-xl p-8"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-orange-500/15 rounded-2xl border border-orange-500/20">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Study Streak</h2>
              <p className="text-sm text-slate-500">Consistency is key to mastery</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center md:items-start">
              <AnimatedFlame streak={streak} />
              <div className="mt-6 text-center md:text-left">
                <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  {streak}
                </motion.p>
                <p className="text-lg text-orange-300/80 font-medium mt-1">Day Streak</p>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">{getMessage()}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-slate-300">Next Milestone</span>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold">{nextMilestone} Days</span>
                </div>
                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
                </div>
                <p className="text-xs text-slate-500 mt-2">{daysUntilNext} days until next milestone</p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">This Week</span>
                </div>
                <WeeklyProgress streak={streak} />
              </div>

              <motion.div whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-500/15 rounded-xl">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-300">Keep the fire burning!</p>
                  <p className="text-xs text-amber-400/70 mt-0.5">Upload a PDF daily to maintain your streak</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-slate-300">Milestones</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <MilestoneBadge key={i} days={[3, 7, 14, 21, 30][i]}
                  achieved={streak >= [3, 7, 14, 21, 30][i]} index={i} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-bold text-white">{totalPDFs}</span>
          </div>
          <p className="text-xs text-slate-500">Total PDFs</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-bold text-white">{Math.min(streak, 100)}%</span>
          </div>
          <p className="text-xs text-slate-500">Consistency</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-2xl font-bold text-white">{streak >= 30 ? "MAX" : streak}</span>
          </div>
          <p className="text-xs text-slate-500">Best Streak</p>
        </div>
      </motion.div>
    </section>
  );
}