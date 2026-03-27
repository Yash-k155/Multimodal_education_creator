export default function Loader({ message = "Generating content..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-blue-600 font-semibold text-lg">{message}</p>
      <p className="text-gray-400 text-sm">This may take a few seconds…</p>
    </div>
  );
}
