"use client";

import { useEffect, useCallback } from "react";
import { TYPE_LABELS, type CatalogItem, type ItemType } from "../types/catalog";

interface DetailModalProps {
  item: CatalogItem | null;
  onClose: () => void;
}

const TYPE_COLORS: Record<ItemType, string> = {
  "trail-map": "bg-green-100 text-green-800",
  "road-map": "bg-blue-100 text-blue-800",
  "hiking-book": "bg-amber-100 text-amber-800",
  guidebook: "bg-purple-100 text-purple-800",
  brochure: "bg-rose-100 text-rose-800",
  atlas: "bg-indigo-100 text-indigo-800",
  "city-map": "bg-cyan-100 text-cyan-800",
};

function getLargeFilename(image: string): string {
  return image.replace(/\.(jpe?g|png|webp|tiff?)$/i, ".jpg");
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (item) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center
                     rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="bg-gray-100 flex items-center justify-center">
          <img
            src={`/images/large/${getLargeFilename(item.image)}`}
            alt={item.title}
            className="max-h-[60vh] w-auto object-contain"
          />
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-2 ${TYPE_COLORS[item.type]}`}
              >
                {TYPE_LABELS[item.type]}
              </span>
              <h2 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{item.publisher}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                Location
              </span>
              <p className="text-gray-700">{item.location.name}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                Region
              </span>
              <p className="text-gray-700">{item.location.region}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                Category
              </span>
              <p className="text-gray-700">{item.category}</p>
            </div>
            {item.location.state && (
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">
                  State
                </span>
                <p className="text-gray-700">{item.location.state}</p>
              </div>
            )}
          </div>

          {item.tags.length > 0 && (
            <div className="mt-4">
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.notes && (
            <div className="mt-4">
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                Notes
              </span>
              <p className="text-gray-700 text-sm mt-1">{item.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
