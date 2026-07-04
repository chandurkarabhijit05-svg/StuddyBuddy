import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
} from "lucide-react";

// ─── Floating Particle Background ──────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * 800,
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Gradient Orb ───────────────────────────────────
function GradientOrb({ className, delay = 0 }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}

// ─── Feature Badge ─────────────────────────────────────────
function FeatureBadge({ icon: Icon, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm rounded-full text-sm text-slate-300"
    >
      <Icon className="w-4 h-4 text-amber-400" />
      {text}
    </motion.div>
  );
}

// ─── Stats Counter ─────────────────────────────────────────
function StatItem({ value, label, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="flex items-center gap-3"
    >
      <div className="p-2.5 bg-slate-800/50 border border-slate-700/30 rounded-xl">
        <Icon className="w-5 h-5 text-violet-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Scroll Indicator ──────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-xs text-slate-600 uppercase tracking-widest">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-slate-600" />
      </motion.div>
    </motion.div>
  );
}

// ─── Main Hero Component ───────────────────────────────────
export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <FloatingParticles />

      {/* Gradient Orbs */}
      <GradientOrb
        className="w-[600px] h-[600px] bg-violet-600/20 -top-40 -left-40"
        delay={0}
      />
      <GradientOrb
        className="w-[500px] h-[500px] bg-blue-600/20 -bottom-40 -right-40"
        delay={2}
      />
      <GradientOrb
        className="w-[400px] h-[400px] bg-purple-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        delay={4}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
      >
        {/* Floating Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <FeatureBadge icon={FileText} text="PDF Upload" delay={0.3} />
          <FeatureBadge icon={BrainCircuit} text="AI Summaries" delay={0.4} />
          <FeatureBadge icon={Zap} text="Flashcards & Quizzes" delay={0.5} />
        </motion.div>

        {/* Main Headline */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="text-white">Learn</span>{" "}
            <motion.span
              style={{
                x: mousePosition.x * 0.5,
                y: mousePosition.y * 0.5,
              }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Smarter
              </span>
            </motion.span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mt-2"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              With AI
            </span>
          </motion.h2>
        </div>

        {/* Animated Underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-32 h-1 bg-gradient-to-r from-violet-500 to-blue-500 mx-auto mt-8 rounded-full"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-2xl mx-auto mt-8 text-lg sm:text-xl text-slate-400 leading-relaxed"
        >
          Upload your PDFs and let AI generate{" "}
          <span className="text-slate-300 font-medium">smart summaries</span>,{" "}
          <span className="text-slate-300 font-medium">interactive flashcards</span>, and{" "}
          <span className="text-slate-300 font-medium">personalized quizzes</span> — all in one
          beautiful platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/25 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 font-semibold rounded-2xl hover:bg-slate-800/70 hover:border-slate-600/50 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-slate-800/50"
        >
          <StatItem value="10K+" label="Students" icon={Users} delay={1.0} />
          <StatItem value="50K+" label="PDFs Processed" icon={FileText} delay={1.1} />
          <StatItem value="4.9" label="Rating" icon={Star} delay={1.2} />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}