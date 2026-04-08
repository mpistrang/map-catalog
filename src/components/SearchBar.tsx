"use client";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function SearchBar({
  query,
  onQueryChange,
  resultCount,
  totalCount,
}: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search maps, guides, locations..."
        className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   bg-white text-gray-900 placeholder-gray-400"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {query && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {resultCount} of {totalCount}
        </span>
      )}
    </div>
  );
}
