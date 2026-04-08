"use client";

import type { CatalogItem } from "../types/catalog";
import CatalogCard from "./CatalogCard";

interface CatalogGridProps {
  items: CatalogItem[];
  onItemClick: (item: CatalogItem) => void;
}

export default function CatalogGrid({ items, onItemClick }: CatalogGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <svg
          className="mx-auto w-12 h-12 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-sm">No items match your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <CatalogCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
