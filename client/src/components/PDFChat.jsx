import { useState } from "react";

export default function PDFChat({ pdfId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfId,
          question,
        }),
      });

      const data = await res.json();

      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      alert("Failed to get answer");
    }

    setLoading(false);
  };

  return (
    <div className="glass rounded-2xl p-6 mt-6">
      <h3 className="text-2xl font-bold mb-4">
        🤖 Ask AI
      </h3>

      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about this PDF..."
        className="w-full p-3 rounded text-black"
      />

      <button
        onClick={askAI}
        className="gradient mt-4 px-6 py-2 rounded-lg"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4">
          <h4 className="font-bold mb-2">
            AI Answer
          </h4>

          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}