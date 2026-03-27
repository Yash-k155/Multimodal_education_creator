import { useState } from "react";

export default function TopicInput({ onGenerate, isLoading }) {
  const [topic, setTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) onGenerate(topic.trim());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) onGenerate(searchQuery.trim(), true);
  };

  const suggestions = [
    "Photosynthesis",
    "Quantum Physics",
    "The French Revolution",
    "Machine Learning",
    "DNA Replication",
    "Climate Change",
  ];

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate Educational Content</h2>
      <p className="text-gray-500 mb-6">Enter any topic and get a complete lesson with flashcards and images.</p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Photosynthesis, Quantum Physics…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          disabled={isLoading}
        />
        <button type="submit" className="btn-primary" disabled={isLoading || !topic.trim()}>
          {isLoading ? "Generating…" : "Generate"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setTopic(s)}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
            disabled={isLoading}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-500 mb-2 font-medium">Search previous topics:</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stored topics…"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            disabled={isLoading}
          />
          <button type="submit" className="btn-secondary" disabled={isLoading || !searchQuery.trim()}>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
