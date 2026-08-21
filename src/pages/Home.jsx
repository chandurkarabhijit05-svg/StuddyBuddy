// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import {
  FileText,
  BrainCircuit,
  HelpCircle,
  Zap,
  ArrowRight,
  Sparkles,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  MessageSquare,
  ChevronDown,
  Upload,
  GraduationCap,
  Briefcase,
  Target,
  Code,
  Clock,
  Shield,
  Rocket,
  ChevronRight,
  Play,
} from "lucide-react";

// ─── 3D Tilt Hook ──────────────────────────────────────────
function use3DTilt() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// ─── Floating Particles ────────────────────────────────────
function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 10,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, ${246}, ${0.2 + Math.random() * 0.3})`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ─── Gradient Orb ──────────────────────────────────────────
function GradientOrb({ className, delay = 0, colors = "from-violet-600 to-purple-600" }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 180, 360] }}
      transition={{ duration: 10, repeat: Infinity, delay, ease: "easeInOut" }}
      className={`absolute rounded-full blur-[100px] pointer-events-none bg-gradient-to-br ${colors} ${className}`}
    />
  );
}

// ─── 3D Feature Card ──────────────────────────────────────
function FeatureCard3D({ icon: Icon, title, description, color, delay }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();

  const colorMap = {
    violet: { from: "from-violet-500/20", to: "to-fuchsia-500/20", border: "border-violet-500/20", text: "text-violet-400", glow: "from-violet-500/10" },
    emerald: { from: "from-emerald-500/20", to: "to-teal-500/20", border: "border-emerald-500/20", text: "text-emerald-400", glow: "from-emerald-500/10" },
    amber: { from: "from-amber-500/20", to: "to-orange-500/20", border: "border-amber-500/20", text: "text-amber-400", glow: "from-amber-500/10" },
    sky: { from: "from-sky-500/20", to: "to-blue-500/20", border: "border-sky-500/20", text: "text-sky-400", glow: "from-sky-500/10" },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="perspective-1000"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        className={`relative p-6 rounded-2xl border ${c.border} backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 group cursor-pointer overflow-hidden h-full`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${c.from} ${c.to} border ${c.border}`}>
          <Icon className={`w-7 h-7 ${c.text}`} />
        </div>

        <h3 className="relative text-lg font-bold text-white mb-2">{title}</h3>
        <p className="relative text-sm text-slate-400 leading-relaxed">{description}</p>

        <motion.div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" whileHover={{ x: 3 }}>
          <ArrowRight className={`w-5 h-5 ${c.text}`} />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          initial={{ x: "-200%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Stats Counter ─────────────────────────────────────────
function StatItem({ value, label, icon: Icon, delay }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, ''));

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= target) { clearInterval(interval); return target; }
          return prev + Math.ceil(target / 50);
        });
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm"
    >
      <div className="p-2.5 bg-slate-700/50 rounded-lg">
        <Icon className="w-5 h-5 text-violet-400" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">
          {value.includes('K') ? `${count}K+` : value.includes('.') ? `${(count / 10).toFixed(1)}` : value.includes('%') ? `${count}%` : count}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Step Card ─────────────────────────────────────────────
function StepCard({ number, icon: Icon, title, description, color, index }) {
  const colors = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400",
    violet: "from-violet-500/20 to-purple-500/20 border-violet-500/20 text-violet-400",
    emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-emerald-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative"
    >
      {index < 2 && (
        <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-700/50 to-slate-700/20" />
      )}

      <div className={`bg-gradient-to-br ${colors[color]} border backdrop-blur-sm rounded-3xl p-8 text-center h-full`}>
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {number}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Testimonial Card ──────────────────────────────────────
function TestimonialCard({ name, role, text, rating, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-all"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
        ))}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed mb-5">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Floating Element ──────────────────────────────────────
function FloatingElement({ children, delay = 0, x = 0, y = 0 }) {
  return (
    <motion.div
      animate={{ y: [y, y - 20, y], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute"
      style={{ left: x, top: y }}
    >
      {children}
    </motion.div>
  );
}

// ─── Study Feature Card ────────────────────────────────────
function StudyFeatureCard({ icon: Icon, title, items, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group relative p-6 rounded-2xl border border-slate-700/50 bg-[#0b0f1e]/80 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Placement Feature Card ────────────────────────────────
function PlacementFeatureCard({ icon: Icon, title, items, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group relative p-6 rounded-2xl border border-slate-700/50 bg-[#0b0f1e]/80 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Main Home Component ───────────────────────────────────
export default function Home() {
  const studyFeatures = [
    { icon: FileText, title: "Smart PDF Analysis", items: ["AI-powered text extraction", "Image-based PDF support", "Multi-file upload"], color: "from-violet-500 to-fuchsia-600" },
    { icon: BrainCircuit, title: "AI Summaries", items: ["Key concept extraction", "Chapter-wise breakdown", "Custom summary length"], color: "from-blue-500 to-cyan-600" },
    { icon: Zap, title: "Flashcards & Quizzes", items: ["Auto-generated flashcards", "Adaptive quizzes", "Spaced repetition"], color: "from-amber-500 to-orange-600" },
    { icon: Clock, title: "Study Streaks", items: ["Daily goal tracking", "Progress analytics", "Achievement badges"], color: "from-rose-500 to-pink-600" },
  ];

  const placementFeatures = [
    { icon: Target, title: "Resume Analyzer", items: ["ATS score checking", "Keyword optimization", "Role-specific feedback"], color: "from-emerald-500 to-teal-600" },
    { icon: MessageSquare, title: "Mock Interviews", items: ["AI interviewer bot", "Real-time feedback", "Technical + HR rounds"], color: "from-cyan-500 to-blue-600" },
    { icon: Code, title: "Coding Practice", items: ["Algorithm challenges", "Company-specific questions", "Time-based tests"], color: "from-violet-500 to-purple-600" },
    { icon: Rocket, title: "Career Growth", items: ["Skill gap analysis", "Learning path suggestions", "Job matching"], color: "from-fuchsia-500 to-pink-600" },
  ];

  const steps = [
    { number: 1, icon: Upload, title: "Upload Your PDF", description: "Simply drag and drop or select your PDF file. We support all standard document formats.", color: "blue" },
    { number: 2, icon: Sparkles, title: "AI Processing", description: "Our advanced AI analyzes your document and generates summaries, flashcards, and quizzes.", color: "violet" },
    { number: 3, icon: BookOpen, title: "Start Learning", description: "Review your personalized study materials, track progress, and ace your exams.", color: "emerald" },
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Medical Student", text: "StudyBuddy transformed my exam prep. The AI summaries save me hours of reading, and the flashcards are incredibly effective for memorization.", rating: 5 },
    { name: "James Miller", role: "Law Student", text: "The quiz generation feature is a game-changer. I can test my knowledge on any topic instantly. My grades improved significantly!", rating: 5 },
    { name: "Emily Rodriguez", role: "Engineering Student", text: "I love how it breaks down complex technical documents into digestible summaries. The study planner keeps me on track every day.", rating: 5 },
  ];

  const whyChoose = [
    { icon: Shield, title: "Privacy First", description: "Your documents are encrypted and never shared. Complete privacy guaranteed.", color: "violet" },
    { icon: Zap, title: "Lightning Fast", description: "AI processes your PDFs in seconds. No waiting, just results.", color: "amber" },
    { icon: BrainCircuit, title: "Smart Learning", description: "Adaptive algorithms that learn your style and optimize your study sessions.", color: "emerald" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1e] text-white overflow-x-hidden">
      <Navbar />

      <Hero />

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative py-12 border-y border-slate-800/50 bg-[#0b0f1e]/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem value="10K+" label="Active Students" icon={Users} delay={0.1} />
            <StatItem value="50K+" label="PDFs Processed" icon={FileText} delay={0.2} />
            <StatItem value="4.9" label="User Rating" icon={Star} delay={0.3} />
            <StatItem value="95%" label="Placement Rate" icon={TrendingUp} delay={0.4} />
          </div>
        </div>
      </motion.div>

      {/* ─── STUDY SECTION ────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <GradientOrb className="w-[500px] h-[500px] -top-40 -left-40" delay={0} colors="from-violet-600 to-purple-600" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              Study Smarter
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Supercharge Your <span className="text-violet-400">Learning</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Upload any PDF and let our AI transform it into bite-sized, interactive study materials.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {studyFeatures.map((feature, i) => (
              <StudyFeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-violet-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Interactive Study Dashboard</h3>
                <p className="text-slate-400 mb-6">
                  Track your progress, manage your PDFs, and access all your study materials in one beautiful interface.
                </p>
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-500 transition-colors"
                >
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              </div>
              <div className="flex-1 relative">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="bg-[#151b2e] rounded-2xl p-6 border border-slate-700/50 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-700/50 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-700/50 rounded-full w-full" />
                    <div className="h-3 bg-slate-700/50 rounded-full w-5/6" />
                    <div className="h-3 bg-violet-500/30 rounded-full w-1/2" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="px-3 py-1 bg-violet-500/20 rounded-lg text-xs text-violet-300">Flashcards</div>
                    <div className="px-3 py-1 bg-emerald-500/20 rounded-lg text-xs text-emerald-300">Quizzes</div>
                    <div className="px-3 py-1 bg-amber-500/20 rounded-lg text-xs text-amber-300">Summary</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PLACEMENT SECTION ────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <GradientOrb className="w-[500px] h-[500px] -bottom-40 -right-40" delay={2} colors="from-emerald-600 to-teal-600" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              Land Your Dream Job
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Placement <span className="text-emerald-400">Ready</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From resume optimization to mock interviews — we've got everything you need to crack your dream company.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {placementFeatures.map((feature, i) => (
              <PlacementFeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>

          {/* Interview Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">AI Interview Simulator</h3>
                <p className="text-slate-400 mb-6">
                  Practice with our intelligent interviewer that adapts to your responses and provides real-time feedback.
                </p>
                <motion.a
                  href="/placement"
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-colors"
                >
                  Start Practicing
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              </div>
              <div className="flex-1 relative">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -1, 1, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="bg-[#151b2e] rounded-2xl p-6 border border-slate-700/50 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">AI Interviewer</p>
                      <p className="text-slate-500 text-xs">Online</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#1e2746] rounded-xl p-3 border border-slate-700/30">
                      <p className="text-xs text-slate-400">Tell me about yourself and your experience with React.</p>
                    </div>
                    <div className="bg-violet-600/20 rounded-xl p-3 border border-violet-500/20 ml-8">
                      <p className="text-xs text-violet-300">I've been working with React for 3 years...</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
            <ChevronDown className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get started in three simple steps and transform your study routine forever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} {...step} index={index} />
          ))}
        </div>
      </section>

      {/* ─── WHY CHOOSE US (3D CARDS) ─────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <GradientOrb className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={4} colors="from-purple-600 to-pink-600" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">StudyBuddy</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Experience the future of learning and career preparation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 perspective-1000">
            {whyChoose.map((feature, i) => (
              <FeatureCard3D key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Students</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See what our users are saying about their experience with StudyBuddy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <TestimonialCard key={t.name} {...t} index={index} />
          ))}
        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-emerald-600/10" />
        <GradientOrb className="w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2" delay={0} colors="from-violet-600 to-purple-600" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="p-12 rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-emerald-600/20 border border-violet-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6 relative"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-400 font-medium">Start Your Journey</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative">
              Ready to Transform Your <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">Career</span>?
            </h2>
            <p className="text-slate-400 mb-8 relative">
              Join thousands of students who are already learning smarter and landing better jobs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/25 inline-flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Get Started Free
              </motion.a>
              <motion.a
                href="/placement"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 font-bold rounded-2xl hover:bg-slate-800/70 inline-flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Explore Placement
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}