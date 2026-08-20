import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteFile } from "../api/upload.js";
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
  RefreshCw,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PDFUploader from "../components/PDFUploader";
import Analytics from "../components/Analytics";
import PDFPreview from "../components/PDFPreview";
import StatsCard from "../components/StatsCard";
import Notifications from "../components/Notifications";
import QuickActions from "../components/QuickActions";
import StudyStreak from "../components/StudyStreak";
import supabase from "../services/supabase.js";
import { sendEmail, sendPDFReadyEmail, sendStreakReminder } from "../api/email.js";

// ─── Sidebar Item Component ──────────────────────────────
function SidebarItem({ icon: Icon, label, active, onClick, badge, collapsed }) {
  return (
    <motion.button
      whileHover={{ x: collapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-300 border border-violet-500/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      } ${collapsed ? "justify-center px-2" : ""}`}
    >
      <div className="relative flex-shrink-0">
        <Icon className={`w-5 h-5 ${active ? "text-violet-400" : "text-slate-500"}`} />
        {collapsed && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
        )}
      </div>
      
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {badge > 0 && (
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full">
              {badge}
            </span>
          )}
        </>
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
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [error, setError] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const uploadRef = useRef(null);
  const navigate = useNavigate();

  // Stats
  const totalPDFs = pdfs.length;
  const totalSummaries = useMemo(() => pdfs.filter((p) => p.summary?.trim()).length, [pdfs]);
  const totalFlashcards = useMemo(() => pdfs.filter((p) => p.flashcards && String(p.flashcards).trim()).length, [pdfs]);
  const totalQuizzes = useMemo(() => pdfs.filter((p) => p.quiz && String(p.quiz).trim()).length, [pdfs]);

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

  // ─── FILTER PDFs ────────────────────────────────────────
  const filteredPDFs = search.trim()
    ? pdfs.filter((p) => p.file_name?.toLowerCase().includes(search.toLowerCase()))
    : pdfs;

  // ─── FETCH PDFs FROM SUPABASE ───────────────────────────
  const fetchPDFs = useCallback(async (userId) => {
    try {
      setLoading(true);
      const { data, error: pdfError } = await supabase
        .from('pdfs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (pdfError) throw pdfError;

      console.log("Fetched PDFs:", data?.length || 0, data);
      setPdfs(data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch PDFs error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth and load data
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
            setTimeout(() => navigate("/login"), 100);
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
          setIsAuthenticated(true);
        }

        await fetchPDFs(session.user.id);

      } catch (err) {
        console.error("Dashboard error:", err);
        if (mounted) {
          setError(err.message);
          if (err.message?.includes("session") || err.message?.includes("auth")) {
            setIsAuthenticated(false);
            setTimeout(() => navigate("/login"), 100);
          }
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
        setPdfs([]);
        navigate("/login");
      } else if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setUser(session.user);
        fetchPDFs(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate, fetchPDFs]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ─── EMAIL FUNCTIONS ────────────────────────────────────
  
  // Send test email
  const handleSendTestEmail = async () => {
    if (!user?.email) return;
    setEmailLoading(true);
    setEmailStatus(null);
    try {
      await sendEmail({
        to: user.email,
        from: 'chandurkarabhijit05@gmail.com',
        subject: '✅ StudyBuddy Email Test',
        html: `<div style="font-family:Inter,sans-serif;padding:24px;background:#0f172a;color:#fff;border-radius:16px;">
          <h2>🎉 Email Works!</h2>
          <p>Hi ${user.email.split('@')[0]},</p>
          <p>Your StudyBuddy email integration is working correctly.</p>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Sent at ${new Date().toLocaleString()}</p>
        </div>`,
      });
      setEmailStatus({ type: 'success', message: 'Test email sent!' });
      setTimeout(() => setEmailStatus(null), 3000);
    } catch (err) {
      console.error('Email error:', err);
      setEmailStatus({ type: 'error', message: err.message || 'Failed to send email' });
    } finally {
      setEmailLoading(false);
    }
  };

  // Send streak reminder email
  const handleSendStreakEmail = async () => {
    if (!user?.email || streak === 0) return;
    setEmailLoading(true);
    setEmailStatus(null);
    try {
      const lastDate = pdfs[0]?.created_at 
        ? new Date(pdfs[0].created_at).toLocaleDateString() 
        : 'recently';
      await sendStreakReminder({
        to: user.email,
        userName: user.email.split('@')[0],
        streakDays: streak,
        lastStudyDate: lastDate,
      });
      setEmailStatus({ type: 'success', message: 'Streak reminder sent!' });
      setTimeout(() => setEmailStatus(null), 3000);
    } catch (err) {
      console.error('Email error:', err);
      setEmailStatus({ type: 'error', message: err.message || 'Failed to send email' });
    } finally {
      setEmailLoading(false);
    }
  };

  // Send PDF ready notification (call this when PDF processing completes)
  const notifyPDFReady = useCallback(async (pdf) => {
    if (!user?.email || !pdf) return;
    try {
      await sendPDFReadyEmail({
        to: user.email,
        userName: user.email.split('@')[0],
        fileName: pdf.file_name,
        summaryUrl: `${window.location.origin}/pdfs/${pdf.id}`,
      });
      console.log('PDF ready email sent for:', pdf.file_name);
    } catch (err) {
      console.error('Failed to send PDF ready email:', err);
    }
  }, [user]);

  // ─── DELETE PDF ─────────────────────────────────────────
  const handleDelete = async (id, filePath) => {
  if (!window.confirm("Delete this PDF?")) return;
  setDeletingId(id);
  try {
    // Delete from database first
    const { error: dbError } = await supabase
      .from('pdfs')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // Delete from storage if we have the path
    if (filePath) {
      await deleteFile(filePath);
    }

    setPdfs((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete: " + err.message);
  } finally {
    setDeletingId(null);
  }
};
  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
  const RankIcon = rank.icon;

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
            {/* Email Status Toast */}
            <AnimatePresence>
              {emailStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-xl flex items-center gap-3 ${
                    emailStatus.type === 'success' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}
                >
                  {emailStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{emailStatus.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

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
                    <RankIcon className={`w-5 h-5 ${rank.color}`} />
                    <span className={`text-sm font-medium ${rank.color}`}>{rank.label}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToUpload}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20"
                  >
                    <Upload className="w-5 h-5" />
                    Upload PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendTestEmail}
                    disabled={emailLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700/30 text-slate-300 font-medium rounded-xl hover:text-white hover:border-violet-500/40 transition-all disabled:opacity-50"
                  >
                    {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Test Email
                  </motion.button>
                </div>
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchPDFs(user?.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-400 hover:text-white hover:border-slate-500/40 transition-all"
                  title="Refresh PDFs"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <span className="text-sm text-slate-500">
                  {filteredPDFs.length} document{filteredPDFs.length !== 1 ? "s" : ""}
                  {search.trim() && ` (filtered from ${pdfs.length})`}
                </span>
              </div>
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
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {filteredPDFs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={search.trim() ? "No Matching PDFs" : "No PDFs Yet"}
                description={search.trim() ? `No results for "${search}". Try a different search.` : "Upload your first PDF to get started with AI summaries, flashcards, and quizzes."}
                action={!search.trim() ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToUpload}
                    className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </motion.button>
                ) : (
                  <button
                    onClick={() => setSearch("")}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700/30 text-slate-300 rounded-xl hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear Search
                  </button>
                )}
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredPDFs.map((pdf, index) => (
                  <PDFCard
  key={pdf.id ?? `pdf-${index}`}
  pdf={pdf}
  onPreview={setPreviewUrl}
  onDelete={(id) => handleDelete(id, pdf.file_path)}  // ⬅️ PASS file_path
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
            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSendTestEmail}
                    disabled={emailLoading}
                    className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-violet-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Send Test Email</p>
                        <p className="text-xs text-slate-500">Verify your email integration</p>
                      </div>
                    </div>
                    {emailLoading ? <Loader2 className="w-5 h-5 animate-spin text-violet-400" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                  </button>
                  
                  <button
                    onClick={handleSendStreakEmail}
                    disabled={emailLoading || streak === 0}
                    className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Streak Reminder</p>
                        <p className="text-xs text-slate-500">Send streak reminder to your email</p>
                      </div>
                    </div>
                    {emailLoading ? <Loader2 className="w-5 h-5 animate-spin text-violet-400" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                  </button>
                </div>
              </div>
            </div>
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
                  <Mail className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Email Integration</p>
                    <p className="text-xs text-slate-500">Resend API via Vite proxy</p>
                  </div>
                </div>
                <button
                  onClick={handleSendTestEmail}
                  disabled={emailLoading}
                  className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-500/20 transition-colors disabled:opacity-50"
                >
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
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
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === "overview"} onClick={() => setActiveSection("overview")} collapsed={!sidebarOpen} />
          <SidebarItem icon={FileText} label="My PDFs" active={activeSection === "pdfs"} onClick={() => setActiveSection("pdfs")} badge={pdfs.filter((p) => !p.summary).length} collapsed={!sidebarOpen} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeSection === "analytics"} onClick={() => setActiveSection("analytics")} collapsed={!sidebarOpen} />
          <SidebarItem icon={Upload} label="Upload" active={activeSection === "upload"} onClick={() => setActiveSection("upload")} collapsed={!sidebarOpen} />
          <SidebarItem icon={Bell} label="Notifications" active={activeSection === "notifications"} onClick={() => setActiveSection("notifications")} badge={getBadge("notifications")} collapsed={!sidebarOpen} />
          <SidebarItem icon={Settings} label="Settings" active={activeSection === "settings"} onClick={() => setActiveSection("settings")} collapsed={!sidebarOpen} />
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
                <span className="text-sm text-slate-300">{user?. l?.split("@")[0]}</span>
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