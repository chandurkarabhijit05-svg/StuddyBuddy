import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BrainCircuit,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  BarChart3,
} from "lucide-react";

// ─── Parse Quiz from Raw Text ──────────────────────────────
function parseQuiz(rawQuiz) {
  if (!rawQuiz || typeof rawQuiz !== "string") return [];

  const questions = [];
  
  // Normalize the text: remove markdown bold, extra spaces
  const normalized = rawQuiz
    .replace(/\*\*/g, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();

  // Split into question blocks using multiple patterns
  let blocks = [];
  
  // Try splitting by "Question N:" pattern
  const questionPattern = /(?:^|\n\n)(?:Question\s*\d+[:\.]?\s*)/i;
  if (normalized.match(questionPattern)) {
    blocks = normalized.split(questionPattern).filter(b => b.trim().length > 10);
  } else {
    // Fallback: split by numbered lines like "1.", "2." etc.
    const numberedPattern = /(?:^|\n\n)(?:\d+[\.:\)]\s+)/;
    if (normalized.match(numberedPattern)) {
      blocks = normalized.split(numberedPattern).filter(b => b.trim().length > 10);
    } else {
      // Last resort: split by double newlines
      blocks = normalized.split(/\n\s*\n/).filter(b => b.trim().length > 20);
    }
  }

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) return;

    // Extract question text (first non-option, non-answer line)
    let questionText = "";
    let questionEndIdx = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip if it's an option, answer, or explanation line
      if (line.match(/^[A-Da-d][\.\)]/)) continue;
      if (line.match(/correct\s*answer|answer\s*[:]/i)) continue;
      if (line.match(/explanation\s*[:]/i)) continue;
      if (line.match(/^---+/)) continue;
      
      questionText = line.replace(/^(Question\s*\d+[:\.]?\s*)/i, "").trim();
      questionEndIdx = i;
      break;
    }

    if (!questionText) {
      // Try first line as question
      questionText = lines[0].replace(/^(Question\s*\d+[:\.]?\s*)/i, "").trim();
      questionEndIdx = 0;
    }

    // Extract options
    const options = [];
    let correctAnswer = "";
    let explanation = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // Match options: "A. text", "A) text", "A text"
      const optMatch = line.match(/^([A-Da-d])[\.\)]\s*(.+)/);
      if (optMatch) {
        options.push({
          label: optMatch[1].toUpperCase(),
          text: optMatch[2].trim()
        });
        continue;
      }

      // Match correct answer: "Correct Answer: B", "Answer: B", "Correct: B"
      const ansMatch = line.match(/(?:correct\s+)?answer\s*[:)]\s*([A-Da-d])\b/i) ||
                       line.match(/correct\s*[:)]\s*([A-Da-d])\b/i);
      if (ansMatch) {
        correctAnswer = ansMatch[1].toUpperCase();
        continue;
      }

      // Match explanation
      const explMatch = line.match(/explanation\s*[:)]\s*(.+)/i);
      if (explMatch) {
        explanation = explMatch[1].trim();
        // Collect multi-line explanation
        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^(?:Question|\d+[\.:\)]|[A-Da-d][\.\)])/i)) {
          explanation += " " + lines[j].trim();
          j++;
        }
        continue;
      }
    }

    // Only add if we have a question and options
    if (questionText && options.length >= 2) {
      questions.push({
        id: idx,
        question: questionText,
        options,
        correctAnswer,
        explanation,
      });
    }
  });

  return questions;
}

// ─── Option Card ───────────────────────────────────────────
function OptionCard({ option, selected, correct, showResult, onSelect, index }) {
  const getStyles = () => {
    if (!showResult) {
      return selected
        ? "bg-violet-500/20 border-violet-500/50 text-white shadow-lg shadow-violet-500/10"
        : "bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-500/40 hover:bg-slate-800/50";
    }

    if (correct) {
      return "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/40";
    }

    if (selected && !correct) {
      return "bg-rose-500/20 border-rose-500/50 text-rose-300 ring-2 ring-rose-500/40";
    }

    return "bg-slate-800/20 border-slate-800/30 text-slate-600 opacity-40";
  };

  const getIcon = () => {
    if (!showResult) {
      return selected ? (
        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
      );
    }

    if (correct) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (selected && !correct) return <XCircle className="w-5 h-5 text-rose-400" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-700" />;
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!showResult ? { scale: 1.02, x: 4 } : {}}
      whileTap={!showResult ? { scale: 0.98 } : {}}
      onClick={() => !showResult && onSelect(option.label)}
      disabled={showResult}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${getStyles()}`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 text-left">
        <span className="text-sm font-medium">
          <span className="font-bold mr-2">{option.label}.</span>
          {option.text}
        </span>
      </div>
      {showResult && correct && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0 px-2.5 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
          <span className="text-xs font-bold text-emerald-400">✓ CORRECT</span>
        </motion.div>
      )}
      {showResult && selected && !correct && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0 px-2.5 py-1 bg-rose-500/20 rounded-lg border border-rose-500/30">
          <span className="text-xs font-bold text-rose-400">✗ YOUR ANSWER</span>
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Question Card ─────────────────────────────────────────
function QuestionCard({ question, index, answers, showResult, onSelect }) {
  const isAnswered = answers[question.id] !== undefined;
  const isCorrect = answers[question.id] === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className={`relative p-6 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
        showResult
          ? isCorrect
            ? "bg-emerald-500/5 border-emerald-500/20"
            : "bg-rose-500/5 border-rose-500/20"
          : isAnswered
          ? "bg-violet-500/5 border-violet-500/20"
          : "bg-slate-800/30 border-slate-700/30"
      }`}
    >
      <div className="flex items-start gap-3 mb-5">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
          showResult
            ? isCorrect
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-rose-500/20 text-rose-400"
            : isAnswered
            ? "bg-violet-500/20 text-violet-400"
            : "bg-slate-700/50 text-slate-400"
        }`}>
          {showResult ? (isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />) : (index + 1)}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white leading-relaxed">{question.question}</h3>
          {showResult && (
            <div className="mt-2 flex flex-wrap gap-2">
              {!isAnswered && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-medium text-amber-400">
                  <AlertCircle className="w-3 h-3" /> Skipped
                </span>
              )}
              {isAnswered && !isCorrect && question.correctAnswer && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Correct Answer: {question.correctAnswer}
                </span>
              )}
              {isAnswered && !isCorrect && !question.correctAnswer && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-medium text-orange-400">
                  <AlertCircle className="w-3 h-3" /> Correct answer not detected
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, optIndex) => (
          <OptionCard
            key={option.label}
            option={option}
            selected={answers[question.id] === option.label}
            correct={option.label === question.correctAnswer}
            showResult={showResult}
            onSelect={() => onSelect(question.id, option.label)}
            index={optIndex}
          />
        ))}
      </div>

      <AnimatePresence>
        {showResult && question.explanation && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-medium">Explanation: </span>
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Results Screen ──────────────────────────────────────
function ResultsScreen({ score, total, answers, questions, onRetry }) {
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isPassing = percentage >= 70;

  const getGrade = () => {
    if (percentage >= 90) return { label: "Outstanding!", color: "text-amber-400", icon: Trophy };
    if (percentage >= 80) return { label: "Great Job!", color: "text-emerald-400", icon: Award };
    if (percentage >= 70) return { label: "Good Work!", color: "text-blue-400", icon: CheckCircle2 };
    if (percentage >= 50) return { label: "Keep Trying!", color: "text-orange-400", icon: Target };
    return { label: "Study More!", color: "text-rose-400", icon: AlertCircle };
  };

  const grade = getGrade();
  const GradeIcon = grade.icon;
  const correctCount = score;
  const wrongCount = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer).length;
  const unanswered = questions.filter(q => answers[q.id] === undefined).length;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
      <div className="relative inline-flex mb-8">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
          <motion.circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
            className={isPerfect ? "text-amber-400" : isPassing ? "text-emerald-400" : "text-rose-400"}
            strokeDasharray={2 * Math.PI * 70}
            initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - percentage / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${grade.color}`}>{percentage}%</span>
          <span className="text-xs text-slate-500 mt-1">{score}/{total}</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <GradeIcon className={`w-6 h-6 ${grade.color}`} />
          <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
        </div>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          {isPerfect ? "Perfect score! You're mastering this material!" : isPassing ? "Solid understanding! Review the questions you missed." : "Keep practicing! Review the material and try again."}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <p className="text-2xl font-bold text-emerald-400">{correctCount}</p>
          <p className="text-xs text-emerald-400/70">Correct</p>
        </div>
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <p className="text-2xl font-bold text-rose-400">{wrongCount}</p>
          <p className="text-xs text-rose-400/70">Wrong</p>
        </div>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <p className="text-2xl font-bold text-amber-400">{unanswered}</p>
          <p className="text-xs text-amber-400/70">Skipped</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex justify-center gap-3">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20">
          <RotateCcw className="w-4 h-4" /> Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────
function ProgressBar({ current, total, answered }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">Question {current + 1} of {total}</span>
        <span className="text-xs text-slate-500">{answered}/{total} answered</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          initial={{ width: 0 }} animate={{ width: `${((current + 1) / total) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>
    </div>
  );
}

// ─── Main Quiz Component ───────────────────────────────────
export default function Quiz({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = useMemo(() => parseQuiz(quiz), [quiz]);

  // DEBUG: Log parsing results
  console.log("Raw quiz:", quiz?.substring(0, 200));
  console.log("Parsed questions:", questions.length);
  questions.forEach((q, i) => console.log(`Q${i+1}: correct=${q.correctAnswer}, options=${q.options.length}`));

  if (!quiz || questions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <div className="inline-flex p-5 bg-slate-800/30 rounded-3xl mb-4">
          <HelpCircle className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-500">No Quiz Available</h3>
        <p className="text-sm text-slate-600 mt-1">Generate a quiz from your PDF first</p>
      </motion.div>
    );
  }

  const handleSelect = (questionId, optionLabel) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
  };

  const handleSubmit = () => setShowResults(true);

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const calculateScore = () => questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const answeredCount = Object.keys(answers).length;

  if (showResults) {
    return (
      <section className="w-full max-w-3xl mx-auto px-4 py-8">
        <ResultsScreen score={calculateScore()} total={questions.length} answers={answers} questions={questions} onRetry={handleRetry} />
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-400" /> Review Answers
          </h3>
          {questions.map((q, index) => (
            <QuestionCard key={q.id} question={q} index={index} answers={answers} showResult={true} onSelect={handleSelect} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl border border-violet-500/20">
            <BrainCircuit className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Quiz</h2>
            <p className="text-sm text-slate-500">Test your knowledge</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl">
          <Target className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-400">{questions.length} questions</span>
        </div>
      </motion.div>

      <ProgressBar current={currentQuestion} total={questions.length} answered={answeredCount} />

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {questions.map((q, index) => (
            <QuestionCard key={q.id} question={q} index={index} answers={answers} showResult={false} onSelect={handleSelect} />
          ))}
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <AlertCircle className="w-4 h-4" />
          <span>{answeredCount === questions.length ? "All questions answered!" : `${questions.length - answeredCount} questions remaining`}</span>
        </div>
        <motion.button whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }} whileTap={{ scale: 0.95 }}
          onClick={handleSubmit} disabled={answeredCount === 0}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
            answeredCount > 0 ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20" : "bg-slate-800/50 text-slate-600 cursor-not-allowed"
          }`}>
          <Sparkles className="w-5 h-5" /> Submit Quiz <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}