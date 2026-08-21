// src/components/Hero.jsx
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  FileText,
  BrainCircuit,
  Zap,
  ChevronDown,
  Play,
  Star,
  Users,
  GraduationCap,
  Briefcase,
  Rocket,
  Target,
  Shield,
  Clock,
  BookOpen,
  Code,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

// ─── 3D Tilt Card Hook ─────────────────────────────────────
function use3DTilt() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

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

// ─── Floating Particle Background ──────────────────────────
function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
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
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Gradient Orb ───────────────────────────────────
function GradientOrb({ className, delay = 0, colors = "from-violet-600 to-purple-600" }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-[100px] pointer-events-none bg-gradient-to-br ${colors} ${className}`}
    />
  );
}

// ─── 3D Feature Card ──────────────────────────────────────
function FeatureCard3D({ icon: Icon, title, description, color, delay }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();

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
        className={`
          relative p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl
          bg-gradient-to-br from-slate-800/60 to-slate-900/60
          hover:border-${color}-500/50 transition-colors duration-500
          group cursor-pointer overflow-hidden
        `}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color === 'violet' ? 'from-violet-500/10' : color === 'emerald' ? 'from-emerald-500/10' : 'from-amber-500/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`
          relative w-14 h-14 rounded-xl flex items-center justify-center mb-4
          bg-gradient-to-br ${color === 'violet' ? 'from-violet-500/20 to-fuchsia-500/20' : color === 'emerald' ? 'from-emerald-500/20 to-teal-500/20' : 'from-amber-500/20 to-orange-500/20'}
          border border-${color}-500/20
        `}>
          <Icon className={`w-7 h-7 ${color === 'violet' ? 'text-violet-400' : color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`} />
        </div>

        {/* Content */}
        <h3 className="relative text-lg font-bold text-white mb-2">{title}</h3>
        <p className="relative text-sm text-slate-400 leading-relaxed">{description}</p>

        {/* Arrow */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ x: 3 }}
        >
          <ArrowRight className={`w-5 h-5 ${color === 'violet' ? 'text-violet-400' : color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`} />
        </motion.div>

        {/* Shine effect */}
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

// ─── Stats Counter ─────────────────────────────────────────
function StatItem({ value, label, icon: Icon, delay }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, ''));

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= target) {
            clearInterval(interval);
            return target;
          }
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
          {value.includes('K') ? `${count}K+` : value.includes('.') ? `${(count / 10).toFixed(1)}` : count}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── 3D Floating Element ───────────────────────────────────
function FloatingElement({ children, delay = 0, x = 0, y = 0 }) {
  return (
    <motion.div
      animate={{
        y: [y, y - 20, y],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className="absolute"
      style={{ left: x, top: y }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Hero Component ───────────────────────────────────
export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const studyFeatures = [
    {
      icon: FileText,
      title: "Smart PDF Analysis",
      items: ["AI-powered text extraction", "Image-based PDF support", "Multi-file upload"],
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      icon: BrainCircuit,
      title: "AI Summaries",
      items: ["Key concept extraction", "Chapter-wise breakdown", "Custom summary length"],
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Zap,
      title: "Flashcards & Quizzes",
      items: ["Auto-generated flashcards", "Adaptive quizzes", "Spaced repetition"],
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Clock,
      title: "Study Streaks",
      items: ["Daily goal tracking", "Progress analytics", "Achievement badges"],
      color: "from-rose-500 to-pink-600",
    },
  ];

  const placementFeatures = [
    {
      icon: Target,
      title: "Resume Analyzer",
      items: ["ATS score checking", "Keyword optimization", "Role-specific feedback"],
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageSquare,
      title: "Mock Interviews",
      items: ["AI interviewer bot", "Real-time feedback", "Technical + HR rounds"],
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Code,
      title: "Coding Practice",
      items: ["Algorithm challenges", "Company-specific questions", "Time-based tests"],
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Rocket,
      title: "Career Growth",
      items: ["Skill gap analysis", "Learning path suggestions", "Job matching"],
      color: "from-fuchsia-500 to-pink-600",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0b0f1e] overflow-hidden">
      {/* Background Effects */}
      <FloatingParticles />
      
      <GradientOrb className="w-[700px] h-[700px] -top-48 -left-48" delay={0} colors="from-violet-600 to-purple-600" />
      <GradientOrb className="w-[600px] h-[600px] -bottom-48 -right-48" delay={2} colors="from-blue-600 to-cyan-600" />
      <GradientOrb className="w-[500px] h-[500px] top-1/3 right-1/4" delay={4} colors="from-fuchsia-600 to-pink-600" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating 3D Elements */}
      <FloatingElement delay={0} x="10%" y="20%">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center backdrop-blur-sm">
          <BookOpen className="w-8 h-8 text-violet-400" />
        </div>
      </FloatingElement>
      
      <FloatingElement delay={2} x="80%" y="15%">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
          <Briefcase className="w-6 h-6 text-emerald-400" />
        </div>
      </FloatingElement>

      <FloatingElement delay={4} x="85%" y="60%">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center backdrop-blur-sm">
          <GraduationCap className="w-10 h-10 text-amber-400" />
        </div>
      </FloatingElement>

      {/* ─── HERO SECTION ───────────────────────────────────── */}
      <motion.section
        style={{ opacity, scale, y }}
        className="relative min-h-screen flex items-center justify-center pt-20 pb-32"
      >
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI-Powered Learning & Career Platform
          </motion.div>

          {/* Main Title with 3D effect */}
          <div className="relative mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
              }}
            >
              <span className="text-white drop-shadow-2xl">Study</span>
              <motion.span
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-violet-400 via-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                Buddy
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl text-slate-400 font-light mt-4"
            >
              Where <span className="text-violet-400 font-semibold">Learning</span> Meets{" "}
              <span className="text-emerald-400 font-semibold">Opportunity</span>
            </motion.p>
          </div>

          {/* Animated Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="w-40 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500 mx-auto mb-8 rounded-full"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-3xl mx-auto text-lg text-slate-400 leading-relaxed mb-12"
          >
            Master your studies with AI-generated summaries, flashcards, and quizzes. 
            Then ace your interviews with resume analysis and mock interviews — all in one powerful platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="/dashboard"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-violet-500/30 overflow-hidden inline-flex items-center gap-3"
            >
              <Rocket className="w-5 h-5" />
              Start Learning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.a>

            <motion.a
              href="/placement"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-slate-800/50 border border-slate-700/50 text-slate-300 font-bold text-lg rounded-2xl hover:bg-slate-800/70 hover:border-emerald-500/30 hover:text-emerald-300 transition-all flex items-center gap-3"
            >
              <Target className="w-5 h-5" />
              Prepare for Placement
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-16"
          >
            <StatItem value="10K+" label="Active Students" icon={Users} delay={1.0} />
            <StatItem value="50K+" label="PDFs Processed" icon={FileText} delay={1.1} />
            <StatItem value="4.9" label="User Rating" icon={Star} delay={1.2} />
            <StatItem value="95%" label="Placement Rate" icon={Target} delay={1.3} />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 uppercase tracking-widest">Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-slate-600" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ─── STUDY SECTION ──────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyFeatures.map((feature, i) => (
              <StudyFeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>

          {/* 3D Preview Card */}
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

      {/* ─── PLACEMENT SECTION ──────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placementFeatures.map((feature, i) => (
              <PlacementFeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>

          {/* 3D Preview Card */}
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
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-8 bg-slate-800/50 rounded-lg border border-slate-700/30" />
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 3D FEATURE CARDS ───────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
            <FeatureCard3D
              icon={Shield}
              title="Privacy First"
              description="Your documents are encrypted and never shared. Complete privacy guaranteed."
              color="violet"
              delay={0}
            />
            <FeatureCard3D
              icon={Zap}
              title="Lightning Fast"
              description="AI processes your PDFs in seconds. No waiting, just results."
              color="amber"
              delay={0.1}
            />
            <FeatureCard3D
              icon={BrainCircuit}
              title="Smart Learning"
              description="Adaptive algorithms that learn your style and optimize your study sessions."
              color="emerald"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ───────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-emerald-600/20 border border-violet-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative">
              Ready to Transform Your Career?
            </h2>
            <p className="text-slate-400 mb-8 relative">
              Join thousands of students who are already learning smarter and landing better jobs.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/25 inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">StudyBuddy</span>
          </div>
          <p className="text-slate-600 text-sm">
            © 2026 StudyBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}