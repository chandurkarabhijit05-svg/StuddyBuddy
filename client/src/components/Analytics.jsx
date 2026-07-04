import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Analytics({
  totalPDFs,
  totalSummaries,
  totalFlashcards,
  totalQuizzes,
}) {
  const barData = [
    { name: "PDFs", value: totalPDFs },
    { name: "Summary", value: totalSummaries },
    { name: "Flashcards", value: totalFlashcards },
    { name: "Quiz", value: totalQuizzes },
  ];

  const pieData = [
    {
      name: "Completed",
      value: totalSummaries + totalFlashcards + totalQuizzes,
    },
    {
      name: "Pending",
      value:
        totalPDFs * 3 -
        (totalSummaries + totalFlashcards + totalQuizzes),
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">
      <div className="glass p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-5">
          📊 AI Analytics
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#7c3aed" radius={[10,10,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-5">
          🥧 Completion
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={110}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}