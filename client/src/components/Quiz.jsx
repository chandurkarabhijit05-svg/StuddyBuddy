import { useState } from "react";

export default function Quiz({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  if (!quiz) return null;

  // Split questions by blank line
  const questions = quiz.split("\n\n").filter(Boolean);

  const checkScore = () => {
    let marks = 0;

    questions.forEach((q, index) => {
      const lines = q.split("\n");

      const answerLine = lines.find((line) =>
        line.toLowerCase().includes("correct")
      );

      if (!answerLine) return;

      const correct = answerLine.split(":")[1]?.trim();

      if (answers[index] === correct) {
        marks++;
      }
    });

    setScore(marks);
  };

  return (
    <div className="glass p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">
        AI Quiz
      </h2>

      {questions.map((q, index) => {
        const lines = q.split("\n");

        const question = lines[0];

        const options = lines.filter(
          (line) =>
            line.startsWith("A") ||
            line.startsWith("B") ||
            line.startsWith("C") ||
            line.startsWith("D")
        );

        return (
          <div key={index} className="mb-8">
            <h3 className="font-bold mb-3">
              {question}
            </h3>

            {options.map((option) => (
              <label
                key={option}
                className="block cursor-pointer mb-2"
              >
                <input
                  type="radio"
                  name={`q${index}`}
                  value={option}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [index]: e.target.value,
                    })
                  }
                />

                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        );
      })}

      <button
        onClick={checkScore}
        className="gradient px-6 py-3 rounded"
      >
        Submit Quiz
      </button>

      {score !== null && (
        <h2 className="mt-6 text-2xl font-bold text-green-400">
          Score: {score} / {questions.length}
        </h2>
      )}
    </div>
  );
}