import axios from "axios";
import TopicInput from "../components/TopicInput";
import Loader from "../components/Loader";
import FlashcardGrid from "../components/FlashcardGrid";
import ImageGallery from "../components/ImageGallery";

const API_BASE = "";

export default function Generator({ content, setContent, isLoading, setIsLoading, error, setError }) {
  const handleGenerate = async (topic, isSearch = false) => {
    setIsLoading(true);
    setError(null);
    setContent(null);

    try {
      if (isSearch) {
        const res = await axios.get(`${API_BASE}/search`, { params: { query: topic } });
        const results = res.data.results;
        if (results.length === 0) {
          setError("No matching topics found. Try generating it first!");
        } else {
          // Show search results as a simple list
          setContent({ searchResults: results, query: topic });
        }
      } else {
        const res = await axios.post(`${API_BASE}/generate-content`, { topic });
        setContent(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <TopicInput onGenerate={handleGenerate} isLoading={isLoading} />

      {isLoading && <Loader message="Generating your lesson…" />}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {content && content.searchResults && (
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Search Results for "{content.query}"
          </h2>
          {content.searchResults.map((r, i) => (
            <div key={i} className="border-b last:border-0 py-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-blue-700">{r.topic}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {(r.similarity * 100).toFixed(0)}% match
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{r.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {content && !content.searchResults && (
        <>
          {/* Topic Header */}
          <div className="card max-w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <p className="text-sm uppercase tracking-widest opacity-75 mb-1">Topic</p>
            <h1 className="text-3xl font-extrabold mb-3">{content.topic}</h1>
            <p className="text-blue-100 text-base leading-relaxed">{content.summary}</p>
          </div>

          {/* Explanation */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Explanation</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.explanation}</p>
          </div>

          {/* Key Points */}
          {content.keyPoints?.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Points</h2>
              <ul className="space-y-3">
                {content.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FlashcardGrid flashcards={content.flashcards} />
          <ImageGallery imageUrls={content.image_urls} flashcards={content.flashcards} />
        </>
      )}
    </div>
  );
}
