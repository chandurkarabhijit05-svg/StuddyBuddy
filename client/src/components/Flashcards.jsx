export default function Flashcards({
  flashcards
}) {

  return (
    <div className="glass p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Flashcards
      </h2>

      <pre>
        {flashcards}
      </pre>
    </div>
  );
}