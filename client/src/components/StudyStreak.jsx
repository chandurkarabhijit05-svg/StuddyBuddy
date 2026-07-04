export default function StudyStreak({ totalPDFs }) {
  const streak = Math.min(totalPDFs, 30);

  return (
    <div className="glass rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        🔥 Study Streak
      </h2>

      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <p className="text-5xl font-bold text-orange-400">
            {streak}
          </p>
          <p className="text-gray-400">
            Day Streak
          </p>
        </div>

        <div>
          <p className="text-lg">
            🏆 Keep learning every day!
          </p>

          <p className="text-gray-400">
            Upload one PDF daily to maintain your streak.
          </p>
        </div>
      </div>
    </div>
  );
}