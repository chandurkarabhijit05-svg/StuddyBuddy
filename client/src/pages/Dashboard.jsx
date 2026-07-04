import { useEffect, useState, useMemo, useRef } from "react";
import PDFUploader from "../components/PDFUploader";
import { getDashboard, deletePDF } from "../services/api";
import supabase from "../services/supabase";
import Analytics from "../components/Analytics";
import PDFPreview from "../components/PDFPreview";
import StatsCard from "../components/StatsCard";
import Notifications from "../components/Notifications";
import QuickActions from "../components/QuickActions";
import StudyStreak from "../components/StudyStreak";

export default function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const [user, setUser] = useState(null);
  const uploadRef = useRef(null);

  // Search filter
  const filteredPDFs = useMemo(
    () =>
      pdfs.filter((pdf) =>
        (pdf.file_name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [pdfs, search]
  );

  // Stats calculations
  const totalPDFs = pdfs.length;

  const totalSummaries = useMemo(
    () =>
      pdfs.filter(
        (pdf) => pdf.summary && pdf.summary.trim() !== ""
      ).length,
    [pdfs]
  );

  const totalFlashcards = useMemo(
    () =>
      pdfs.filter(
        (pdf) => pdf.flashcards && String(pdf.flashcards).trim() !== ""
      ).length,
    [pdfs]
  );

  const totalQuizzes = useMemo(
    () =>
      pdfs.filter(
        (pdf) => pdf.quiz && String(pdf.quiz).trim() !== ""
      ).length,
    [pdfs]
  );

  const completionPercentage = useMemo(() => {
    if (!totalPDFs) return 0;
    const completed = pdfs.filter(
      (pdf) =>
        pdf.summary &&
        pdf.summary.trim() !== "" &&
        pdf.flashcards &&
        String(pdf.flashcards).trim() !== "" &&
        pdf.quiz &&
        String(pdf.quiz).trim() !== ""
    ).length;
    return Math.round((completed / totalPDFs) * 100);
  }, [pdfs, totalPDFs]);

  // Calculate streak (based on unique upload dates)
  const streak = useMemo(() => {
    if (!pdfs.length) return 0;
    const dates = pdfs
      .map((pdf) => new Date(pdf.created_at).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dates[0] === today || dates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (prev - curr) / 86400000;
        if (diff === 1) currentStreak++;
        else break;
      }
    }
    return currentStreak;
  }, [pdfs]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          throw new Error("No active session");
        }

        setUser(session.user);

        const data = await getDashboard(session.user.id);
        if (isMounted) {
          setPdfs(data);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
        // Don't alert on connection errors - just log them
        if (error.message !== "Failed to fetch") {
          alert("Failed to load dashboard");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this PDF?");
    if (!ok) return;

    setDeletingId(id);
    try {
      await deletePDF(id);
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete PDF");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getProgress = (pdf) => {
    return (
      ((pdf.summary ? 1 : 0) +
        (pdf.flashcards ? 1 : 0) +
        (pdf.quiz ? 1 : 0)) /
      3 *
      100
    );
  };

  const refreshDashboard = () => {
    window.location.reload();
  };

  const clearSearch = () => {
    setSearch("");
  };

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const closePreview = () => {
    setPreviewUrl("");
  };

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold">
          📚 Study Buddy AI Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-white font-semibold"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold"
          >
            Logout
          </button>

          <button
            onClick={() => (window.location.href = "/settings")}
            className="bg-gray-700 hover:bg-gray-800 px-5 py-2 rounded-lg text-white font-semibold"
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      {user && (
        <div className="glass rounded-3xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-bold">Welcome!</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-green-400 font-semibold">● Online</p>
            <p className="text-sm text-gray-400">Study Buddy AI</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Total PDFs"
          value={totalPDFs}
          icon="📄"
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <StatsCard
          title="Summaries"
          value={totalSummaries}
          icon="📝"
          color="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <StatsCard
          title="Flashcards"
          value={totalFlashcards}
          icon="🧠"
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatsCard
          title="Quizzes"
          value={totalQuizzes}
          icon="❓"
          color="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>

      <Analytics
        totalPDFs={totalPDFs}
        totalSummaries={totalSummaries}
        totalFlashcards={totalFlashcards}
        totalQuizzes={totalQuizzes}
      />
      <Notifications totalPDFs={totalPDFs} />
      <QuickActions
        onRefresh={refreshDashboard}
        onClearSearch={clearSearch}
        onScrollUpload={scrollToUpload}
      />
      <StudyStreak totalPDFs={totalPDFs} />

      <p className="mt-3 inline-block bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold">
        {streak >= 30
          ? "🏅 Master Learner"
          : streak >= 15
          ? "🥇 Advanced Learner"
          : streak >= 7
          ? "🥈 Consistent Learner"
          : "🥉 Beginner"}
      </p>

      {/* Upload Section */}
      <div ref={uploadRef}>
        <PDFUploader />
      </div>

      {/* AI Completion Progress */}
      <div className="glass p-6 rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-4">AI Completion</h2>
        <div className="w-full bg-gray-700 rounded-full h-5">
          <div
            className="bg-green-500 h-5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="mt-3">{completionPercentage}% Complete</p>
      </div>

      {/* Search */}
      <div className="mt-8 mb-6">
        <input
          type="text"
          placeholder="🔍 Search PDF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded text-black"
        />
      </div>

      {/* Uploaded PDFs */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">Uploaded PDFs</h2>

        {loading ? (
          <div className="glass p-10 rounded-xl flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="glass p-6 rounded-xl text-center py-12">
            <div className="text-7xl mb-5">📚</div>
            <h2 className="text-3xl font-bold">No PDFs Yet</h2>
            <p className="text-gray-400 mt-3">
              Upload your first PDF to start learning with AI.
            </p>
          </div>
        ) : filteredPDFs.length === 0 ? (
          <div className="glass p-6 rounded-xl text-center">
            <p className="text-gray-400">No matching PDFs found.</p>
          </div>
        ) : (
          filteredPDFs.map((pdf) => (
            <div
              key={pdf.id}
              className="glass p-6 rounded-3xl shadow-2xl mb-8 hover:shadow-purple-500/30 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg">
                    📄
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{pdf.file_name}</h2>
                    <p className="text-gray-400 text-sm">AI Document</p>
                  </div>
                </div>
                <span className="bg-green-600 px-4 py-2 rounded-full text-white font-semibold">
                  Ready
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="w-full h-3 bg-gray-700 rounded-full">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                    style={{ width: `${getProgress(pdf)}%` }}
                  />
                </div>
              </div>

              <p className="mt-3 text-gray-300">
                Uploaded: {new Date(pdf.created_at).toLocaleString()}
              </p>

              {/* Status Badges */}
              <div className="flex gap-3 flex-wrap mt-5">
                <div
                  className={`px-4 py-2 rounded-full text-white font-medium ${
                    pdf.summary ? "bg-green-600" : "bg-gray-700"
                  }`}
                >
                  📝 Summary
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-white font-medium ${
                    pdf.flashcards ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  🧠 Flashcards
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-white font-medium ${
                    pdf.quiz ? "bg-yellow-600" : "bg-gray-700"
                  }`}
                >
                  ❓ Quiz
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4">
                <h3 className="font-bold text-lg">Summary</h3>
                <p className="text-gray-300">
                  {pdf.summary || "No summary generated."}
                </p>
              </div>

              {/* Flashcards */}
              <div className="mt-4">
                <h3 className="font-bold text-lg">Flashcards</h3>
                <pre className="whitespace-pre-wrap text-gray-300">
                  {pdf.flashcards || "No flashcards generated."}
                </pre>
              </div>

              {/* Quiz */}
              <div className="mt-4">
                <h3 className="font-bold text-lg">Quiz</h3>
                <pre className="whitespace-pre-wrap text-gray-300">
                  {pdf.quiz || "No quiz generated."}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                {pdf.file_url && (
                  <button
                    onClick={() => setPreviewUrl(pdf.file_url)}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white font-semibold"
                  >
                    👀 Preview
                  </button>
                )}
                {pdf.file_url && (
                  <a
                    href={pdf.file_url}
                    download
                    className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold inline-block"
                  >
                    ⬇ Download
                  </a>
                )}
                <button
                  onClick={() => handleDelete(pdf.id)}
                  disabled={deletingId === pdf.id}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
                >
                  {deletingId === pdf.id ? "Deleting..." : "🗑 Delete"}
                </button>
              </div>
            </div>
          ))
        )}

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">📜 Recent Activity</h2>
          <div className="space-y-4">
            {pdfs.slice(0, 5).map((pdf) => (
              <div
                key={`activity-${pdf.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {pdf.file_name}
                  </h3>
                  <p className="text-gray-500 text-sm">Uploaded successfully</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(pdf.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Preview */}
        {previewUrl && (
          <PDFPreview fileUrl={previewUrl} onClose={closePreview} />
        )}
      </div>
    </div>
  );
}