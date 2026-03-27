import { useState } from "react";
import Home from "./pages/Home";
import Generator from "./pages/Generator";

export default function App() {
  const [page, setPage] = useState<"home" | "generator">("home");
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goHome = () => { setPage("home"); setContent(null); setError(null); };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={goHome} className="text-xl font-extrabold text-blue-600 hover:text-blue-700 transition">
            📚 EduCreator
          </button>
          <div className="flex gap-3">
            <button
              onClick={goHome}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                page === "home" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setPage("generator")}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                page === "generator" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Generator
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {page === "home" ? (
          <Home onGetStarted={() => setPage("generator")} />
        ) : (
          <Generator
            content={content}
            setContent={setContent}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
        )}
      </main>

      <footer className="text-center text-gray-400 text-sm py-8 border-t border-gray-100 mt-10">
        Multimodal Education Creator · Built with React, FastAPI, Groq, ChromaDB
      </footer>
    </div>
  );
}
