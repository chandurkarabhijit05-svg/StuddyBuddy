import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  Home,
  LogIn,
  UserPlus,
  Menu,
  X,
  BookOpen,
  Settings,
  Zap,
  ChevronRight,
  Star,
} from "lucide-react";

// ─── Magnetic Button Hook ──────────────────────────────────
function useMagneticButton(strength = 0.3) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x: springX, y: springY, handleMouseMove, handleMouseLeave };
}

// ─── Spotlight Card Effect ─────────────────────────────────
function SpotlightCard({ children, className = "" }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute -inset-px z-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Animated Gradient Text ────────────────────────────────
function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] ${className}`}
      style={{
        animation: "gradient 3s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

// ─── Floating Particles Background ─────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-violet-500/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
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

// ─── Nav Link with Magnetic + Spotlight ────────────────────
function NavLink({ to, icon: Icon, label, isActive }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagneticButton(0.2);

  return (
    <Link to={to} className="relative group">
      <motion.div
        ref={ref}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-white"
        }`}
      >
        {/* Background glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="activeNavBg"
              className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl border border-violet-500/20"
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

        <Icon
          className={`relative z-10 w-4 h-4 transition-all duration-300 ${
            isActive ? "text-violet-400 scale-110" : "text-slate-500 group-hover:text-violet-400"
          }`}
        />
        <span className="relative z-10">{label}</span>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-lg shadow-violet-500/50"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}

// ─── Animated CTA Button ───────────────────────────────────
function CTAButton({ to, icon: Icon, label, variant = "primary" }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagneticButton(0.4);

  const variants = {
    primary: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] hover:bg-right text-white border-0",
    secondary: "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-violet-500/30",
  };

  return (
    <Link to={to}>
      <motion.div
        ref={ref}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative group px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-500 ${variants[variant]}`}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />

        {/* Border glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-md" />

        <span className="relative z-10 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

// ─── Mobile Menu ───────────────────────────────────────────
function MobileMenu({ isOpen, onClose, navItems }) {
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-40 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            ref={menuRef}
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[320px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/5 z-50 lg:hidden overflow-hidden"
          >
            <FloatingParticles />

            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">StudyBuddy</span>
                    <span className="text-[10px] text-slate-500 -mt-0.5 tracking-wider uppercase">
                      AI Powered
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Nav Items */}
              <div className="flex flex-col gap-3 flex-1">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className={`group flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-violet-300 border border-violet-500/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-all duration-300 ${
                          isActive ? "bg-violet-500/20" : "bg-white/5 group-hover:bg-violet-500/10"
                        }`}>
                          <item.icon className={`w-5 h-5 ${isActive ? "text-violet-400" : "text-slate-500 group-hover:text-violet-400"}`} />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                          isActive ? "text-violet-400 translate-x-0 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-6 border-t border-white/5"
              >
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-500">Join 10,000+ students</span>
                </div>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <Zap className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Get Started Free</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Scroll Progress Bar ───────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setProgress(currentProgress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 z-[60] origin-left"
      style={{ scaleX: progress / 100 }}
    />
  );
}

// ─── Main Navbar Component ───────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: BookOpen },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <ScrollProgress />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        {/* Ambient glow behind navbar */}
        {isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative p-2.5 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-500"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </motion.div>

              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  <GradientText>StudyBuddy</GradientText>
                </span>
                <span className="text-[10px] text-slate-500 -mt-0.5 tracking-[0.2em] uppercase font-medium">
                  AI Powered
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  {...item}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <CTAButton to="/login" icon={LogIn} label="Sign In" variant="secondary" />
              <CTAButton to="/register" icon={UserPlus} label="Get Started" variant="primary" />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden relative p-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <Menu className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-[72px]" />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />

      {/* Global Styles for animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </>
  );
}