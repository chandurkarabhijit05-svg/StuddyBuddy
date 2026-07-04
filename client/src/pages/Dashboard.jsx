import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Upload,
  Settings,
  LogOut,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  X,
  Sparkles,
  Zap,
  Flame,
  Crown,
  Star,
  Menu,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Plus,
  TrendingUp,
  BookOpen,
  BrainCircuit,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PDFUploader from "../components/PDFUploader";
import { getDashboard, deletePDF } from "../services/api";
import supabase from "../services/supabase";
import Analytics from "../components/Analytics";
import PDFPreview from "../components/PDFPreview";
import StatsCard from "../components/StatsCard";
import Notifications from "../components/Notifications";
import QuickActions from "../components/QuickActions";
import StudyStreak from "../components/StudyStreak";

// ─── Sidebar Item Component ──────────────────────────────
function SidebarItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-300 border border-violet-500/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "text-violet-400" : "text-slate-500"}`} />
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

// ─── PDF Card Component ──────────────────────────────────
function PDFCard({ pdf, onPreview, onDelete, deletingId }) {
  const progress = ((pdf.summary ? 1 : 0) + (pdf.flashcards ? 1 : 0) + (pdf.quiz ? 1 : 0)) / 3 * 100;

  const statusItems = [
    { label: "Summary", active: !!pdf.summary, color: "emerald" },
    { label: "Flashcards", active: !!pdf.flashcards, color: "blue" },
    { label: "Quiz", active: !!pdf.quiz, color: "amber" },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-slate-800/40 border border-slate-700/30 rounded-2xl p-5 hover:border-slate-600/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl">
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{pdf.file_name}</h3>
            <p className="text-xs text-slate-500">
              {new Date(pdf.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPreview(pdf.file_url)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(pdf.id)}
            disabled={deletingId === pdf.id}
            className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">AI Progress</span>
          <span className="text-xs font-medium text-violet-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusItems.map((item) => (
          <span
            key={item.label}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
              item.active
                ? item.color === "emerald"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : item.color === "blue"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-slate-800/50 text-slate-600 border border-slate-700/30"
            }`}
          >
            {item.active ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {item.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="p-5 bg-slate-800/30 rounded-3xl mb-5">
        <Icon className="w-12 h-12 text-slate-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-400 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}

// ─── Main Dashboard Component ────────────────────────────
export default function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Start true for initial load
  const [deletingId, setDeletingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, false = not auth, true = auth
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [error, setError] = useState(null);
  const uploadRef = useRef(null);
  const navigate = useNavigate();

  // Stats
  const totalPDFs = pdfs.length;
  const totalSummaries = useMemo(() => pdfs.filter((p) => p.summary?.trim()).length, [pdfs]);
  const totalFlashcards = useMemo(() => pdfs.filter((p) => String(p.flashcards).trim()).length, [pdfs]);
  const totalQuizzes = useMemo(() => pdfs.filter((p) => String(p.quiz).trim()).length, [pdfs]);

  const streak = useMemo(() => {
    if (!pdfs.length) return 0;
    const dates = [...new Set(pdfs.map((p) => new Date(p.created_at).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
        if (diff === 1) streak++;
        else break;
      }
    }
    return streak;
  }, [pdfs]);

  const filteredPDFs = useMemo(() => pdfs.filter((p) => p.file_name?.toLowerCase().includes(search.toLowerCase())), [pdfs, search]);

  // Check auth and load data
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // First check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
            // Redirect to login after a brief delay
            setTimeout(() => navigate("/login"), 100);
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
          setIsAuthenticated(true);
        }

        // Then load dashboard data
        const data = await getDashboard(session.user.id);
        if (mounted) {
          setPdfs(data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        if (mounted) {
          setError(err.message);
          // If it's an auth error, redirect
          if (err.message?.includes("session") || err.message?.includes("auth")) {
            setIsAuthenticated(false);
            setTimeout(() => navigate("/login"), 100);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
        setPdfs([]);
        navigate("/login");
      } else if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this PDF?")) return;
    setDeletingId(id);
    try {
      await deletePDF(id);
      setPdfs((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Auth state change listener will handle the redirect
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
      setLoading(false);
    }
  };

  const scrollToUpload = () => {
    setActiveSection("upload");
    setTimeout(() => uploadRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const getBadge = (section) => {
    if (section === "notifications") return pdfs.filter((p) => !p.summary).length;
    return 0;
  };

  const getRank = () => {
    if (streak >= 30) return { label: "Master Learner", icon: Crown, color: "text-amber-400" };
    if (streak >= 15) return { label: "Advanced Learner", icon: Star, color: "text-violet-400" };
    if (streak >= 7) return { label: "Consistent Learner", icon: Flame, color: "text-orange-400" };
    return { label: "Beginner", icon: Sparkles, color: "text-blue-400" };
  };

  const rank = getRank();

  // Show loading while checking auth
  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-400 mb-2">Session Expired</h2>
          <p className="text-sm text-slate-600 mb-6">Please sign in again</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-medium"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Render Content Based on Active Section ─────────────
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-slate-900/40 border border-violet-500/20 rounded-3xl p-8"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.email?.split("@")[0] || "Learner"}! 👋</h1>
                  <p className="text-slate-400">You're on a <span className="text-orange-400 font-semibold">{streak}-day streak</span>. Keep it up!</p>
                  <div className="flex items-center gap-2 mt-4">
                    <rank.icon className={`w-5 h-5 ${rank.color}`} />
                    <span className={`text-sm font-medium ${rank.color}`}>{rank.label}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToUpload}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20"
                >
                  <Upload className="w-5 h-5" />
                  Upload PDF
                </motion.button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total PDFs" value={totalPDFs} icon={FileText} color="blue" delay={0} />
              <StatsCard title="Summaries" value={totalSummaries} icon={BookOpen} color="emerald" delay={0.1} />
              <StatsCard title="Flashcards" value={totalFlashcards} icon={BrainCircuit} color="violet" delay={0.2} />
              <StatsCard title="Quizzes" value={totalQuizzes} icon={HelpCircle} color="amber" delay={0.3} />
            </div>

            <Analytics totalPDFs={totalPDFs} totalSummaries={totalSummaries} totalFlashcards={totalFlashcards} totalQuizzes={totalQuizzes} />
            <StudyStreak totalPDFs={totalPDFs} />
            <QuickActions onRefresh={() => window.location.reload()} onClearSearch={() => setSearch("")} onScrollUpload={scrollToUpload} />
          </div>
        );

      case "pdfs":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My PDFs</h2>
              <span className="text-sm text-slate-500">{filteredPDFs.length} documents</span>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search PDFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/40"
              />
            </div>

            {filteredPDFs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No PDFs Found"
                description={search ? "Try a different search term" : "Upload your first PDF to get started"}
                action={!search && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToUpload}
                    className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </motion.button>
                )}
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredPDFs.map((pdf) => (
                    <PDFCard
                      key={pdf.id}
                      pdf={pdf}
                      onPreview={setPreviewUrl}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics</h2>
            <Analytics totalPDFs={totalPDFs} totalSummaries={totalSummaries} totalFlashcards={totalFlashcards} totalQuizzes={totalQuizzes} />
          </div>
        );

      case "upload":
        return (
          <div className="space-y-6" ref={uploadRef}>
            <h2 className="text-2xl font-bold text-white">Upload & Analyze</h2>
            <PDFUploader />
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <Notifications totalPDFs={totalPDFs} />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  <div>
                    <p className="text-sm font-medium text-white">Theme</p>
                    <p className="text-xs text-slate-500">{darkMode ? "Dark mode" : "Light mode"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${darkMode ? "bg-violet-600" : "bg-slate-700"}`}
                >
                  <motion.div
                    animate={{ x: darkMode ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-rose-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Account</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-500/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-slate-950 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 bottom-0 z-40 bg-slate-900/95 border-r border-slate-800/50 backdrop-blur-2xl flex flex-col"
      >
        <div className="p-5 flex items-center gap-3">
          <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-bold text-white whitespace-nowrap">StudyBuddy</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 p-1.5 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === "overview"} onClick={() => setActiveSection("overview")} />
          <SidebarItem icon={FileText} label="My PDFs" active={activeSection === "pdfs"} onClick={() => setActiveSection("pdfs")} badge={pdfs.filter((p) => !p.summary).length} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeSection === "analytics"} onClick={() => setActiveSection("analytics")} />
          <SidebarItem icon={Upload} label="Upload" active={activeSection === "upload"} onClick={() => setActiveSection("upload")} />
          <SidebarItem icon={Bell} label="Notifications" active={activeSection === "notifications"} onClick={() => setActiveSection("notifications")} badge={getBadge("notifications")} />
          <SidebarItem icon={Settings} label="Settings" active={activeSection === "settings"} onClick={() => setActiveSection("settings")} />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all ${sidebarOpen ? "w-full" : "justify-center"}`}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarOpen ? 280 : 80 }}>
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white capitalize">{activeSection}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-300">{user?.email?.split("@")[0]}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setPreviewUrl("")}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">PDF Preview</h3>
                <button onClick={() => setPreviewUrl("")} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PDFPreview fileUrl={previewUrl} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}