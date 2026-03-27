import { useState } from "react";

interface Flashcard {
  question: string;
  answer: string;
}

function Flashcard({ card, index }: { card: Flashcard; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="cursor-pointer h-48" style={{ perspective: "1000px" }} onClick={() => setFlipped(!flipped)}>
      <div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.5s" }}
      >
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-5 text-white"
          style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Card {index + 1} — Question</span>
          <p className="text-center font-semibold text-lg leading-snug">{card.question}</p>
          <span className="mt-4 text-xs opacity-60">Click to flip</span>
        </div>
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-5 text-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #10b981, #0f766e)" }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Answer</span>
          <p className="text-center text-base leading-relaxed">{card.answer}</p>
          <span className="mt-4 text-xs opacity-60">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardGrid({ flashcards }: { flashcards: Flashcard[] }) {
  if (!flashcards?.length) return null;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Flashcards</h2>
      <p className="text-gray-500 text-sm mb-5">Click any card to reveal the answer.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {flashcards.map((card, i) => <Flashcard key={i} card={card} index={i} />)}
      </div>
    </section>
  );
}
