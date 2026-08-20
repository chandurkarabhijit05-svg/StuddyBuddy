import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Home,
  LogIn,
  UserPlus,
  Menu,
  X,
  BookOpen,
  Settings,
} from "lucide-react";

// ─── Nav Link Component ────────────────────────────────────
function NavLink({ to, icon: Icon, label, isActive }) {
  return (
    <Link to={to} className="relative group">
      <motion.div
        whileHover={{ y: -2 }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          isActive
            ? "text-white bg-white/10"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-slate-500 group-hover:text-violet-400"} transition-colors`} />
        <span>{label}</span>
      </motion.div>
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

// ─── Mobile Menu ───────────────────────────────────────────
function MobileMenu({ isOpen, onClose, navItems }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800/50 z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">StudyBuddy</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === item.to
                        ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${location.pathname === item.to ? "text-violet-400" : "text-slate-500"}`} />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/50">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar Component ───────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: BookOpen },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  StudyBuddy
                </span>
                <span className="text-[10px] text-slate-500 -mt-0.5 tracking-wider uppercase">
                  AI Powered
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  {...item}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/login"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-xl overflow-hidden shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                />
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="h-[72px]" />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}