import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  Heart,
  Mail,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
  Shield,
  Globe,
  GraduationCap,
  Briefcase,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Award,
  Code2,
  Linkedin,
  Github,
  Twitter,
  Youtube,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";

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

// ─── Spotlight Card ────────────────────────────────────────
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
              background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, rgba(139,92,246,0.12), transparent 40%)`,
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

// ─── Stat Card ─────────────────────────────────────────────
function StatCard({ icon: Icon, value, suffix, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <SpotlightCard className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:border-violet-500/20 transition-all duration-500">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/10 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={value} suffix={suffix} />
            </div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Footer Link with Magnetic Effect ──────────────────────
function FooterLink({ href, icon: Icon, label, external = false }) {
  const { ref, x, y, onMove, onLeave } = useMagnetic(0.15);

  return (
    <motion.a
      ref={ref}
      style={{ x, y }}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-white transition-all duration-300 group py-1"
    >
      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-violet-500/20 transition-all duration-300">
        <Icon className="w-3.5 h-3.5 group-hover:text-violet-400 transition-colors" />
      </div>
      <span className="group-hover:translate-x-1 transition-transform duration-300">{label}</span>
      {external && (
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </motion.a>
  );
}

// ─── Social Icon ───────────────────────────────────────────
function SocialIcon({ href, icon: Icon, label, color }) {
  const { ref, x, y, onMove, onLeave } = useMagnetic(0.4);

  return (
    <motion.a
      ref={ref}
      style={{ x, y }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.9 }}
      className="relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-white hover:border-violet-500/30 transition-all duration-300 group overflow-hidden"
      aria-label={label}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${color}`} />
      <Icon className="w-4 h-4 relative z-10" />
    </motion.a>
  );
}

// ─── Newsletter Input ──────────────────────────────────────
function NewsletterInput() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setEmail(""); }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`relative flex items-center rounded-xl border transition-all duration-300 overflow-hidden ${
        focused ? "border-violet-500/40 bg-violet-500/5" : "border-white/10 bg-white/[0.03]"
      }`}>
        <Mail className="w-4 h-4 text-slate-500 ml-4" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter your email..."
          className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-600 outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mr-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
        >
          {submitted ? "Done!" : "Join"}
        </motion.button>
      </div>
      <AnimatePresence>
        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-6 left-0 text-xs text-emerald-400 flex items-center gap-1"
          >
            <Zap className="w-3 h-3" /> Welcome to the community!
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

// ─── Floating Particles ────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

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
            background: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, 246, ${0.1 + Math.random() * 0.2})`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
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

// ─── Career Path Badge ─────────────────────────────────────
function CareerBadge({ icon: Icon, label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 hover:text-violet-300 hover:border-violet-500/20 transition-all cursor-default"
    >
      <Icon className="w-3 h-3" />
      {label}
    </motion.div>
  );
}

// ─── Main Footer Component ─────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: 50000, suffix: "+", label: "Active Learners" },
    { icon: Briefcase, value: 12000, suffix: "+", label: "Placements Secured" },
    { icon: Award, value: 98, suffix: "%", label: "Success Rate" },
    { icon: Globe, value: 150, suffix: "+", label: "Partner Companies" },
  ];

  const learningLinks = [
    { href: "/courses", icon: BookOpen, label: "All Courses" },
    { href: "/roadmaps", icon: MapPin, label: "Career Roadmaps" },
    { href: "/practice", icon: Code2, label: "Coding Practice" },
    { href: "/mentorship", icon: Users, label: "1:1 Mentorship" },
  ];

  const placementLinks = [
    { href: "/jobs", icon: Briefcase, label: "Job Board" },
    { href: "/referrals", icon: Star, label: "Referral Network" },
    { href: "/mock-interviews", icon: MessageCircle, label: "Mock Interviews" },
    { href: "/resume-builder", icon: Sparkles, label: "AI Resume Builder" },
  ];

  const companyLinks = [
    { href: "/about", icon: Heart, label: "About Us" },
    { href: "/blog", icon: TrendingUp, label: "Success Stories" },
    { href: "/privacy", icon: Shield, label: "Privacy Policy" },
    { href: "mailto:hello@studybuddy.ai", icon: Mail, label: "Contact" },
  ];

  const socialLinks = [
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", color: "from-blue-600 to-blue-400" },
    { href: "https://github.com", icon: Github, label: "GitHub", color: "from-slate-600 to-slate-400" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter", color: "from-sky-500 to-cyan-400" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube", color: "from-red-600 to-red-400" },
  ];

  const careerPaths = [
    { icon: Code2, label: "Software Engineering" },
    { icon: Target, label: "Data Science" },
    { icon: Rocket, label: "Product Management" },
    { icon: Globe, label: "Cloud & DevOps" },
    { icon: Shield, label: "Cybersecurity" },
    { icon: TrendingUp, label: "AI/ML Engineering" },
  ];

  return (
    <footer ref={footerRef} className="relative w-full mt-auto overflow-hidden bg-slate-950">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top gradient line */}
      <div className="relative h-px w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <motion.div
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
          animate={{ x: ["-100%", "100vw"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            Trusted by learners worldwide
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Your Career, <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Accelerated</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Join thousands of students who transformed their careers through structured learning and guaranteed placement support.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>

        {/* Career Paths */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {careerPaths.map((path) => (
            <CareerBadge key={path.label} {...path} />
          ))}
        </motion.div>
      </div>

      {/* Main Footer Grid */}
      <div className="relative border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="relative p-2.5 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/30"
                >
                  <GraduationCap className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    StudyBuddy
                  </span>
                  <span className="text-[10px] text-slate-500 -mt-0.5 tracking-[0.2em] uppercase font-medium">
                    Learn. Practice. Place.
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                The all-in-one platform for tech careers. Master in-demand skills with AI-powered learning, practice with real interviews, and land your dream job with our placement network.
              </p>

              <div className="flex items-center gap-3 mb-8">
                {socialLinks.map((link) => (
                  <SocialIcon key={link.label} {...link} />
                ))}
              </div>

              <NewsletterInput />
            </motion.div>

            {/* Learning Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 lg:col-start-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Learning
                </h4>
              </div>
              <div className="flex flex-col gap-3">
                {learningLinks.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </motion.div>

            {/* Placement Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-4 h-4 text-fuchsia-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Placement
                </h4>
              </div>
              <div className="flex flex-col gap-3">
                {placementLinks.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Company
                </h4>
              </div>
              <div className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span>© {currentYear} StudyBuddy</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Global
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                24/7 Support
              </span>
            </div>

            <motion.p
              className="flex items-center gap-2 text-sm text-slate-600"
              whileHover={{ scale: 1.02 }}
            >
              Crafted with
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </motion.span>
              for ambitious learners
            </motion.p>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </footer>
  );
}