export default function StatsCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-xl ${color}
      hover:scale-105 transition-transform duration-300`}
    >
      <div className="text-4xl">{icon}</div>

      <h3 className="mt-4 text-lg font-semibold">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}