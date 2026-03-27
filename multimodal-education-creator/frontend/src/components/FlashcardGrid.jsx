import { useState } from "react";

function Flashcard({ card, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer h-48"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex flex-col items-center justify-center p-5 text-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">
            Card {index + 1} — Question
          </span>
          <p className="text-center font-semibold text-lg leading-snug">{card.question}</p>
          <span className="mt-4 text-xs opacity-60">Click to flip</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex flex-col items-center justify-center p-5 text-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Answer</span>
          <p className="text-center text-base leading-relaxed">{card.answer}</p>
          <span className="mt-4 text-xs opacity-60">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardGrid({ flashcards }) {
  if (!flashcards || flashcards.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Flashcards</h2>
      <p className="text-gray-500 text-sm mb-5">Click any card to reveal the answer.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {flashcards.map((card, i) => (
          <Flashcard key={i} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}
