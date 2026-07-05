import { motion } from "framer-motion";
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
  Upload
} from "lucide-react";

// ─── Stats Bar ───────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: Users, value: "10K+", label: "Students" },
    { icon: FileText, value: "50K+", label: "PDFs Analyzed" },
    { icon: Star, value: "4.9", label: "Rating" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative py-12 border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── How It Works Step ───────────────────────────────────
function StepCard({ number, icon: Icon, title, description, color, index }) {
  const colors = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400",
    violet: "from-violet-500/20 to-purple-500/20 border-violet-500/20 text-violet-400",
    amber: "from-amber-500/20 to-orange-500/20 border-amber-500/20 text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative"
    >
      {/* Connector Line */}
      {index < 2 && (
        <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-700/50 to-slate-700/20" />
      )}

      <div className={`bg-gradient-to-br ${colors[color]} border backdrop-blur-sm rounded-3xl p-8 text-center`}>
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

// ─── Testimonial Card ────────────────────────────────────
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
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
          />
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

// ─── CTA Section ─────────────────────────────────────────
function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-blue-600/10" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-400 font-medium">Start Learning Today</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Study <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Smarter?</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Join thousands of students who are already using AI to transform their study habits and achieve better results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/20"
          >
            <Zap className="w-5 h-5" />
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-700/30 text-slate-300 font-semibold rounded-2xl hover:text-white hover:border-slate-600/50 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Main Home Component ───────────────────────────────────
export default function Home() {
  const features = [
    {
      title: "AI Summary",
      desc: "Upload PDFs and get instant, intelligent summaries that capture the key points and main ideas.",
      icon: FileText,
      theme: "blue",
    },
    {
      title: "Smart Flashcards",
      desc: "Generate interactive flashcards automatically from your documents for efficient spaced repetition.",
      icon: BrainCircuit,
      theme: "violet",
    },
    {
      title: "AI Quiz",
      desc: "Practice with automatically generated multiple-choice questions tailored to your content.",
      icon: HelpCircle,
      theme: "amber",
    },
  ];

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload Your PDF",
      description: "Simply drag and drop or select your PDF file. We support all standard document formats.",
      color: "blue",
    },
    {
      number: 2,
      icon: Sparkles,
      title: "AI Processing",
      description: "Our advanced AI analyzes your document and generates summaries, flashcards, and quizzes.",
      color: "violet",
    },
    {
      number: 3,
      icon: BookOpen,
      title: "Start Learning",
      description: "Review your personalized study materials, track progress, and ace your exams.",
      color: "amber",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      text: "StudyBuddy transformed my exam prep. The AI summaries save me hours of reading, and the flashcards are incredibly effective for memorization.",
      rating: 5,
    },
    {
      name: "James Miller",
      role: "Law Student",
      text: "The quiz generation feature is a game-changer. I can test my knowledge on any topic instantly. My grades improved significantly!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Engineering Student",
      text: "I love how it breaks down complex technical documents into digestible summaries. The study planner keeps me on track every day.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />

      <Hero />

      {/* Stats Bar */}
      <StatsBar />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-400 font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Excel</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our AI-powered tools are designed to help you learn faster, remember more, and perform better on exams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              desc={feature.desc}
              icon={feature.icon}
              theme={feature.theme}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
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

      {/* Testimonials */}
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

      {/* CTA */}
      <CTASection />

      <Footer />
    </div>
  );
}