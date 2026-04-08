"use client";

import { TYPE_LABELS, TYPE_COLORS, type CatalogItem } from "../types/catalog";

interface CatalogCardProps {
  item: CatalogItem;
  onClick: (item: CatalogItem) => void;
}

function getThumbFilename(image: string): string {
  return image.replace(/\.(jpe?g|png|webp|tiff?)$/i, ".jpg");
}

export default function CatalogCard({ item, onClick }: CatalogCardProps) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden
                 hover:shadow-md hover:border-gray-300 transition-all text-left w-full"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={`/images/thumbs/${getThumbFilename(item.image)}`}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <span
          className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border mb-1.5 ${TYPE_COLORS[item.type].pill}`}
        >
          {TYPE_LABELS[item.type]}
        </span>
        <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{item.publisher}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.location.name}</p>
      </div>
    </button>
  );
}
