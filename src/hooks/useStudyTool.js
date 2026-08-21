import { useState } from "react";
import { toast } from "react-toastify";
import { generateSummary, generateFlashcards, generateQuiz } from "../api/groq.js";

export function useStudyTools(pdfText) {
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (generateFn, setter, label) => {
    if (!pdfText) {
      toast.error("Upload PDF first");
      return;
    }
    setLoading(true);
    try {
      const response = await generateFn(pdfText);
      setter(response.choices[0].message.content);
      toast.success(`${label} generated!`);
    } catch (error) {
      console.error(error);
      toast.error(`${label} generation failed: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTools = () => {
    setSummary("");
    setFlashcards("");
    setQuiz("");
  };

  return {
    summary,
    flashcards,
    quiz,
    loading,
    handleSummary: () => run(generateSummary, setSummary, "Summary"),
    handleFlashcards: () => run(generateFlashcards, setFlashcards, "Flashcards"),
    handleQuiz: () => run(generateQuiz, setQuiz, "Quiz"),
    resetTools,
  };
}