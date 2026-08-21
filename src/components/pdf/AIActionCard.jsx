import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AIActionCard({ icon: Icon, title, description, color, onClick, disabled, loading, isGenerated }) {
  const colors = {
    blue: {
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/40",
      icon: "text-blue-400",
      iconBg: "bg-blue-500/15",
    },
    violet: {
      bg: "from-violet-500/10 to-purple-500/10",
      border: "border-violet-500/20",
      hover: "hover:border-violet-500/40",
      icon: "text-violet-400",
      iconBg: "bg-violet-500/15",
    },
    amber: {
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/20",
      hover: "hover:border-amber-500/40",
      icon: "text-amber-400",
      iconBg: "bg-amber-500/15",
    },
    rose: {
      bg: "from-rose-500/10 to-pink-500/10",
      border: "border-rose-500/20",
      hover: "hover:border-rose-500/40",
      icon: "text-rose-400",
      iconBg: "bg-rose-500/15",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <motion.button
      type="button"
      whileHover={disabled ? {} : { y: -4, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative w-full text-left p-5 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} ${c.hover} backdrop-blur-sm transition-all duration-300 ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${isGenerated ? "ring-1 ring-emerald-500/30" : ""}`}
    >
      {isGenerated && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      )}
      <div className={`inline-flex p-2.5 rounded-xl ${c.iconBg} mb-4`}>
        {loading ? (
          <Loader2 className={`w-5 h-5 ${c.icon} animate-spin`} />
        ) : (
          <Icon className={`w-5 h-5 ${c.icon}`} />
        )}
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </motion.button>
  );
}