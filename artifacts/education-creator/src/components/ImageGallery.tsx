import { useState } from "react";

interface ImageCardProps {
  url: string;
  label: string;
  index: number;
}

function ImageCard({ url, label, index }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="card p-0 overflow-hidden">
      <div className="relative bg-gray-100 h-52 flex items-center justify-center">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full" style={{ animation: "spin 1s linear infinite" }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        {error ? (
          <div className="text-center text-gray-400 px-4">
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        ) : (
          <img
            src={url}
            alt={label}
            className="w-full h-52 object-cover"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-gray-500 font-medium">Card {index + 1}</p>
        <p className="text-sm text-gray-700 mt-0.5" style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{label}</p>
      </div>
    </div>
  );
}

export default function ImageGallery({ imageUrls, flashcards }: { imageUrls: string[]; flashcards: any[] }) {
  if (!imageUrls?.length) return null;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Image Gallery</h2>
      <p className="text-gray-500 text-sm mb-5">Visual aids sourced from Wikipedia or AI-generated.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {imageUrls.map((url, i) => (
          <ImageCard key={i} url={url} label={flashcards?.[i]?.question || `Flashcard ${i + 1}`} index={i} />
        ))}
      </div>
    </section>
  );
}
