import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  BookOpen,
  Shield,
  Fingerprint,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Target,
  TrendingUp,
  Users,
  Award,
  Rocket,
  Star,
  Flame,
  Code2,
  Globe,
  Heart,
  X,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import supabase from "../services/supabase";

// ─── Magnetic Hook ─────────────────────────────────────────
function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return { ref, x: springX, y: springY, onMove, onLeave };
}

// ─── Spotlight Card ──────────────────────────────────────
function SpotlightCard({ children, className = "" }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute -inset-px z-0"
            style={{
              background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(139,92,246,0.15), transparent 40%)`,
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Animated Counter ──────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Floating Particles ────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 8,
    delay: Math.random() * 5,
    color: ["violet", "fuchsia", "cyan", "blue"][Math.floor(Math.random() * 4)],
  }));

  const colors = {
    violet: "139, 92, 246",
    fuchsia: "217, 70, 239",
    cyan: "34, 211, 238",
    blue: "59, 130, 246",
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${colors[p.color]}, ${0.15 + Math.random() * 0.2})`,
            boxShadow: `0 0 ${p.size * 4}px rgba(${colors[p.color]}, 0.3)`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Gradient Orb ──────────────────────────────────────────
function GradientOrb({ className, delay = 0, colors = "from-violet-600 to-purple-600" }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.25, 0.1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${colors} ${className}`}
    />
  );
}

// ─── Stat Pill ─────────────────────────────────────────────
function StatPill({ icon: Icon, value, suffix, label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
    >
      <div className="p-1.5 rounded-lg bg-violet-500/10">
        <Icon className="w-3.5 h-3.5 text-violet-400" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-white">
          <AnimatedCounter value={value} suffix={suffix} />
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </motion.div>
  );
}

// ─── Career Path Tag ───────────────────────────────────────
function CareerTag({ icon: Icon, label, color }) {
  const colorMap = {
    violet: "from-violet-500/20 to-purple-500/20 border-violet-500/20 text-violet-300",
    fuchsia: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/20 text-fuchsia-300",
    cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/20 text-cyan-300",
    emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-emerald-300",
    amber: "from-amber-500/20 to-orange-500/20 border-amber-500/20 text-amber-300",
    rose: "from-rose-500/20 to-red-500/20 border-rose-500/20 text-rose-300",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -2 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${colorMap[color]} border text-[11px] font-semibold cursor-default backdrop-blur-sm`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </motion.div>
  );
}

// ─── Success Story Card ────────────────────────────────────
function SuccessStory({ name, role, company, quote, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative group"
    >
      <SpotlightCard className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/20 transition-all duration-500">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/10">
            <GraduationCap className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 leading-relaxed mb-2 italic">"{quote}"</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-[8px] text-white font-bold">
                {name.charAt(0)}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white">{name}</p>
                <p className="text-[10px] text-slate-500">{role} @ {company}</p>
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Input Field with Magnetic & Spotlight ─────────────────
function InputField({ icon: Icon, type, placeholder, value, onChange, error, showToggle, onToggle }) {
  const [isFocused, setIsFocused] = useState(false);
  const { ref, x, y, onMove, onLeave } = useMagnetic(0.15);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative group"
    >
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${isFocused ? "text-violet-400" : "text-slate-500"}`}>
        <Icon className="w-5 h-5" />
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-slate-900/60 border rounded-xl pl-12 pr-12 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-all duration-300 ${
          error
            ? "border-rose-500/50 focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/10"
            : isFocused
            ? "border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 shadow-lg shadow-violet-500/5"
            : "border-white/[0.06] hover:border-white/[0.12]"
        }`}
      />

      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
        >
          {type === "password" ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}

      {/* Focus glow */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Toast Notification ────────────────────────────────────
function Toast({ message, type, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -20, x: "-50%" }}
      className={`fixed top-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl ${
        type === "success"
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-rose-500/10 border-rose-500/20 text-rose-400"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Feature Badge ─────────────────────────────────────────
function FeatureBadge({ icon: Icon, text, color = "violet" }) {
  const colors = {
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400",
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-[11px] font-semibold ${colors[color]}`}>
      <Icon className="w-3 h-3" />
      {text}
    </div>
  );
}

// ─── Main Login Component ────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    if (!email.trim()) { showToast("Please enter your email", "error"); return false; }
    if (!email.includes("@") || !email.includes(".")) { showToast("Please enter a valid email", "error"); return false; }
    if (!password.trim()) { showToast("Please enter your password", "error"); return false; }
    if (password.length < 6) { showToast("Password must be at least 6 characters", "error"); return false; }
    return true;
  };

  const signup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      showToast("Account created! Check your email for confirmation.", "success");
      setMode("login");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast("Login successful! Redirecting to dashboard...", "success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mode === "login" ? login() : signup();
  };

  const careerPaths = [
    { icon: Code2, label: "Software Engineering", color: "violet" },
    { icon: Target, label: "Data Science", color: "fuchsia" },
    { icon: Rocket, label: "Product Management", color: "cyan" },
    { icon: Globe, label: "Cloud & DevOps", color: "emerald" },
    { icon: Shield, label: "Cybersecurity", color: "amber" },
    { icon: Flame, label: "AI/ML Engineering", color: "rose" },
  ];

  const successStories = [
    { name: "Sarah Chen", role: "SDE II", company: "Google", quote: "StudyBuddy's mock interviews helped me crack FAANG. Landed 3 offers in 2 months!" },
    { name: "Rahul Patel", role: "Data Scientist", company: "Netflix", quote: "The AI-powered roadmaps mapped my exact learning path. Zero guesswork, 100% results." },
    { name: "Emily Zhang", role: "PM", company: "Stripe", quote: "From zero product knowledge to Stripe PM in 6 months. The mentorship was game-changing." },
  ];

  const features = mode === "login" 
    ? [
        { icon: Shield, text: "Bank-grade Security", color: "emerald" },
        { icon: Zap, text: "Instant Access", color: "amber" },
        { icon: BookOpen, text: "Free Courses", color: "violet" },
      ]
    : [
        { icon: Rocket, text: "Placement Guarantee", color: "fuchsia" },
        { icon: Users, text: "1:1 Mentorship", color: "violet" },
        { icon: Award, text: "Industry Certificates", color: "amber" },
      ];

  return (
    <div className="relative min-h-screen flex bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <FloatingParticles />
      <GradientOrb className="w-[600px] h-[600px] -top-48 -left-48" delay={0} colors="from-violet-600 to-purple-600" />
      <GradientOrb className="w-[500px] h-[500px] -bottom-40 -right-40" delay={2} colors="from-fuchsia-600 to-pink-600" />
      <GradientOrb className="w-[400px] h-[400px] top-1/3 left-1/3" delay={4} colors="from-cyan-600 to-blue-600" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* ─── LEFT PANEL: Learning & Placement Showcase ───────── */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-center px-12 xl:px-16 py-12"
      >
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            #1 Career Accelerator Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-6"
          >
            Master Skills.{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Land Your Dream Job.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-base xl:text-lg leading-relaxed mb-10"
          >
            Join 50,000+ learners who transformed their careers through AI-powered learning, real interview practice, and guaranteed placement support.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <StatPill icon={Users} value={50000} suffix="+" label="Learners" />
            <StatPill icon={Briefcase} value={12000} suffix="+" label="Placed" />
            <StatPill icon={Award} value={98} suffix="%" label="Success" />
            <StatPill icon={Globe} value={150} suffix="+" label="Companies" />
          </motion.div>

          {/* Career Paths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-10"
          >
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Popular Career Paths</p>
            <div className="flex flex-wrap gap-2">
              {careerPaths.map((path) => (
                <CareerTag key={path.label} {...path} />
              ))}
            </div>
          </motion.div>

          {/* Success Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Success Stories</p>
            <div className="space-y-3">
              {successStories.map((story, i) => (
                <SuccessStory key={story.name} {...story} delay={0.9 + i * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── RIGHT PANEL: Auth Form ────────────────────────── */}
      <div className="w-full lg:w-[55%] xl:w-[58%] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12 relative">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 left-6"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors group"
          >
            <motion.div whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
            Back to Home
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg xl:max-w-xl"
        >
          <SpotlightCard className="bg-slate-900/40 border border-white/[0.06] backdrop-blur-2xl rounded-3xl p-8 xl:p-10 shadow-2xl">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-flex p-3.5 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-2xl shadow-lg shadow-violet-500/30 mb-5 relative"
              >
                <GraduationCap className="w-7 h-7 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-1">StudyBuddy</h1>
              <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-medium">
                Learn. Practice. Place.
              </p>
            </motion.div>

            {/* Headline for mobile */}
            <div className="lg:hidden text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                {mode === "login" ? "Welcome Back!" : "Start Your Journey"}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === "login" 
                  ? "Continue your learning path" 
                  : "Join 50,000+ learners worldwide"}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === "login"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("signup")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === "signup"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                icon={Mail}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showToggle
                onToggle={() => setShowPassword(!showPassword)}
              />

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500/20" />
                    <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-50 overflow-hidden group"
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                />
                
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {mode === "login" ? <LogIn className="w-5 h-5 relative z-10" /> : <Rocket className="w-5 h-5 relative z-10" />}
                    <span className="relative z-10">{mode === "login" ? "Sign In" : "Start Learning Free"}</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
            </div>

            {/* Google Auth */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {features.map((f) => (
                <FeatureBadge key={f.text} {...f} />
              ))}
            </div>
          </SpotlightCard>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-xs text-slate-600 mt-6"
          >
            By {mode === "login" ? "signing in" : "creating an account"}, you agree to our{" "}
            <Link to="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</Link>
          </motion.p>

          {/* Mobile-only stats */}
          <div className="lg:hidden mt-8 flex flex-wrap justify-center gap-2">
            <StatPill icon={Users} value={50000} suffix="+" label="Learners" />
            <StatPill icon={Briefcase} value={12000} suffix="+" label="Placed" />
          </div>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}