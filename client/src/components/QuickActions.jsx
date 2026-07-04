export default function QuickActions({
  onRefresh,
  onClearSearch,
  onScrollUpload,
}) {
  return (
    <div className="glass rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={onScrollUpload}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl py-3 transition"
        >
          📤 Upload PDF
        </button>

        <button
          onClick={onRefresh}
          className="bg-green-600 hover:bg-green-700 rounded-xl py-3 transition"
        >
          🔄 Refresh
        </button>

        <button
          onClick={onClearSearch}
          className="bg-yellow-500 hover:bg-yellow-600 rounded-xl py-3 transition"
        >
          🧹 Clear Search
        </button>

        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="bg-purple-600 hover:bg-purple-700 rounded-xl py-3 transition"
        >
          ⬆ Top
        </button>
      </div>
    </div>
  );
}