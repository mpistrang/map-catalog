"use client";

import { TYPE_LABELS, TYPE_COLORS, type ItemType } from "../types/catalog";

interface FilterBarProps {
  types: string[];
  regions: string[];
  selectedTypes: Set<string>;
  selectedRegions: Set<string>;
  onToggleType: (type: string) => void;
  onToggleRegion: (region: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function FilterBar({
  types,
  regions,
  selectedTypes,
  selectedRegions,
  onToggleType,
  onToggleRegion,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-medium text-gray-500 mb-2">Type</h4>
        <div className="flex flex-wrap gap-1.5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onToggleType(type)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                selectedTypes.has(type)
                  ? TYPE_COLORS[type as ItemType]?.pill || "bg-emerald-100 border-emerald-300 text-emerald-800"
                  : TYPE_COLORS[type as ItemType]?.pillMuted || "bg-white border-gray-200 text-gray-600"
              }`}
            >
              {TYPE_LABELS[type as ItemType] || type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-gray-500 mb-2">Region</h4>
        <div className="flex flex-wrap gap-1.5">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => onToggleRegion(region)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                selectedRegions.has(region)
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
