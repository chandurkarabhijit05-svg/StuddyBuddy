export default function Notifications({ totalPDFs }) {
  const notifications = [
    {
      id: 1,
      icon: "📄",
      text: `You have uploaded ${totalPDFs} PDF(s).`,
    },
    {
      id: 2,
      icon: "🤖",
      text: "AI Summary, Flashcards and Quiz are available.",
    },
    {
      id: 3,
      icon: "🚀",
      text: "Keep uploading PDFs to improve your study progress!",
    },
  ];

  return (
    <div className="glass rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        🔔 Notifications
      </h2>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b border-gray-600 pb-3"
          >
            <div className="text-3xl">{item.icon}</div>

            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}