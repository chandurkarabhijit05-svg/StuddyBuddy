import { useState } from "react";
import Quiz from "./Quiz";
import supabase from "../services/supabase";
import { toast } from "react-toastify";

import { useEffect } from "react";

export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [uploadedId, setUploadedId] = useState(null);

  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [quiz, setQuiz] = useState("");

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a PDF first");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user_id = session.user.id;

      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("user_id", user_id);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadedId(data.id);
      toast.success("PDF Uploaded Successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= SUMMARY =================
  const handleSummary = async () => {
    if (!file || !uploadedId) {
      toast.error("Upload PDF first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("id", uploadedId);

      const res = await fetch("http://localhost:5000/api/summary", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      toast.error("Summary generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= FLASHCARDS =================
  const handleFlashcards = async () => {
    if (!file || !uploadedId) {
      toast.error("Upload PDF first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("id", uploadedId);

      const res = await fetch("http://localhost:5000/api/flashcards", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setFlashcards(data.flashcards);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  // ================= QUIZ =================
  const handleQuiz = async () => {
    if (!file || !uploadedId) {
      toast.error("Upload PDF first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("id", uploadedId);

      const res = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setQuiz(data.quiz);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };
  const loadChatHistory = async () => {
  if (!uploadedId) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/chat/${uploadedId}`
    );

    const data = await res.json();

    setChatHistory(data);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  loadChatHistory();
}, [uploadedId]);

  // ================= CHAT =================
  const handleChat = async () => {
    if (!file || !uploadedId) {
      toast.error("Upload PDF first");
      return;
    }

    if (!question.trim()) {
      toast.error("Enter a question");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("id", uploadedId);
      formData.append("question", question);

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Chat request failed");
      }

 const data = await res.json();
setAnswer(data.answer);

await loadChatHistory();

setQuestion("");

setQuestion("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  const downloadSummary = () => {
    if (!summary) {
      toast.error("Generate a summary first.");
      return;
    }

    const blob = new Blob([summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "AI-Summary.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadFlashcards = () => {
    if (!flashcards) {
      toast.error("Generate flashcards first.");
      return;
    }

    const blob = new Blob([flashcards], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "AI-Flashcards.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadQuiz = () => {
    if (!quiz) {
      toast.error("Generate quiz first.");
      return;
    }

    const blob = new Blob([quiz], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "AI-Quiz.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  const sendEmail = async () => {
  try {
    const email = prompt("Enter your email:");

    if (!email) return;

    const res = await fetch("http://localhost:5000/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        summary,
        flashcards,
        quiz,
        chatHistory: chatHistory
          .map(
            (chat) =>
              `Q: ${chat.question}\nA: ${chat.answer}`
          )
          .join("\n\n"),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Email sent successfully!");
    } else {
      alert(data.error?.message || "Failed to send email");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  return (
    <div className="glass p-8">
      <h2 className="text-xl font-bold">Chat with PDF 💬</h2>

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          setFile(e.target.files[0]);
          // Reset downstream state when new file selected
          setUploadedId(null);
          setSummary("");
          setFlashcards("");
          setQuiz("");
          setAnswer("");
          setChatHistory([]);
        }}
      />

      {file && (
        <p className="mt-3 text-green-400">Selected: {file.name}</p>
      )}

      {/* QUESTION INPUT */}
      <input
        type="text"
        placeholder="Ask anything from the PDF..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 outline-none"
      />

      {/* BUTTONS */}
      <div className="flex gap-3 mt-5 flex-wrap">
        <button
          onClick={handleUpload}
          className="gradient px-5 py-2 rounded flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            "Upload PDF"
          )}
        </button>

        <button
          onClick={handleSummary}
          disabled={loading || !uploadedId}
          className="gradient px-5 py-2 rounded disabled:opacity-50"
        >
          Summary
        </button>
        <button
  onClick={sendEmail}
  className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white"
>
  📧 Send Report
</button>

        <button
          onClick={handleFlashcards}
          disabled={loading || !uploadedId}
          className="gradient px-5 py-2 rounded disabled:opacity-50"
        >
          Flashcards
        </button>

        <button
          onClick={handleQuiz}
          disabled={loading || !uploadedId}
          className="gradient px-5 py-2 rounded disabled:opacity-50"
        >
          Quiz
        </button>

        <button
          onClick={handleChat}
          disabled={loading || !uploadedId}
          className="gradient px-6 py-3 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {/* OUTPUTS */}
      {chatHistory.length > 0 && (
  <div className="glass p-6 mt-6 rounded-2xl">
    <h2 className="text-2xl font-bold mb-5">
      💬 AI Chat
    </h2>

    {chatHistory.map((chat, index) => (
      <div
        key={index}
        className="mb-6 border-b border-white/10 pb-4"
      >
        <div className="text-blue-400 font-semibold">
          🙋 You
        </div>

        <p className="mb-3">
          {chat.question}
        </p>

        <div className="text-green-400 font-semibold">
          🤖 AI
        </div>

        <p className="whitespace-pre-wrap">
          {chat.answer}
        </p>
      </div>
    ))}
  </div>
)}

      {summary && (
        <div className="glass rounded-2xl p-6 mt-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-bold">Summary</h2>
          <p className="mt-2 whitespace-pre-wrap">{summary}</p>
          <button
            onClick={downloadSummary}
            className="gradient px-5 py-2 rounded mt-4"
          >
            📥 Download Summary
          </button>
        </div>
      )}

      {flashcards && (
        <div className="glass p-5 mt-5">
          <h2 className="text-xl font-bold">Flashcards</h2>
          <pre className="mt-2 whitespace-pre-wrap">{flashcards}</pre>
          <button
            onClick={downloadFlashcards}
            className="gradient px-5 py-2 rounded mt-4"
          >
            📥 Download Flashcards
          </button>
        </div>
      )}

      {quiz && (
        <>
          <Quiz quiz={quiz} />
          <button
            onClick={downloadQuiz}
            className="gradient px-5 py-2 rounded mt-4"
          >
            📥 Download Quiz
          </button>
        </>
      )}
    </div>
  );
}