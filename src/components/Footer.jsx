import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
  Shield,
  Globe,
} from "lucide-react";

// ─── Footer Link Component ─────────────────────────────────
function FooterLink({ href, icon: Icon, label, external = false }) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ x: 4 }}
      className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group"
    >
      <Icon className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
      <span>{label}</span>
      {external && (
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.a>
  );
}

// ─── Social Icon Component ─────────────────────────────────
function SocialIcon({ href, icon: Icon, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-500 hover:text-white hover:border-slate-500/40 hover:bg-slate-700/50 transition-all"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </motion.a>
  );
}

// ─── Main Footer Component ─────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: "#features", icon: Sparkles, label: "Features" },
    { href: "#pricing", icon: BookOpen, label: "Pricing" },
    { href: "#docs", icon: MessageCircle, label: "Documentation" },
  ];

  const companyLinks = [
    { href: "#about", icon: Heart, label: "About Us" },
    { href: "#privacy", icon: Shield, label: "Privacy Policy" },
    { href: "mailto:hello@studybuddy.ai", icon: Mail, label: "Contact" },
  ];

  const socialLinks = [
    { href: "https://github.com", icon: Globe, label: "GitHub" },
    { href: "https://twitter.com", icon: Globe, label: "Twitter" },
  ];

  return (
    <footer className="relative w-full mt-auto">
      {/* Top Gradient Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                StudyBuddy
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
              Your AI-powered study companion. Upload PDFs, generate summaries,
              flashcards, and quizzes — all in one beautiful platform.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <SocialIcon key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Product
            </h4>
            <div className="flex flex-col gap-3.5">
              {productLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Company
            </h4>
            <div className="flex flex-col gap-3.5">
              {companyLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 flex items-center gap-1.5">
              © {currentYear} StudyBuddy AI. Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </motion.span>
              for students worldwide.
            </p>
            <p className="text-xs text-slate-700">
              Built with React, Tailwind & AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}