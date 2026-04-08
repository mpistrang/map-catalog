"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  catalog,
  getUniqueTypes,
  getUniqueRegions,
} from "../lib/catalog";
import { createSearchIndex, searchCatalog } from "../lib/search";
import type { CatalogItem } from "../types/catalog";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import CatalogGrid from "../components/CatalogGrid";
import DetailModal from "../components/DetailModal";

const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
      Loading map...
    </div>
  ),
});

type ViewMode = "grid" | "map";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchIndex = useMemo(() => createSearchIndex(catalog), []);
  const types = useMemo(() => getUniqueTypes(), []);
  const regions = useMemo(() => getUniqueRegions(), []);

  const filteredItems = useMemo(() => {
    let results = searchCatalog(searchIndex, query);

    if (selectedTypes.size > 0) {
      results = results.filter((item) => selectedTypes.has(item.type));
    }
    if (selectedRegions.size > 0) {
      results = results.filter((item) =>
        selectedRegions.has(item.location.region)
      );
    }

    return results;
  }, [query, selectedTypes, selectedRegions, searchIndex]);

  const hasActiveFilters = selectedTypes.size > 0 || selectedRegions.size > 0;

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const toggleRegion = useCallback((region: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTypes(new Set());
    setSelectedRegions(new Set());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Map Catalog</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 mr-2">
                {filteredItems.length} item{filteredItems.length !== 1 && "s"}
              </span>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-white text-gray-500 hover:text-gray-700"
                  }`}
                  title="Grid view"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-200 ${
                    viewMode === "map"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-white text-gray-500 hover:text-gray-700"
                  }`}
                  title="Map view"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            resultCount={filteredItems.length}
            totalCount={catalog.length}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex gap-6">
          {/* Filters sidebar — desktop */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-28">
              <FilterBar
                types={types}
                regions={regions}
                selectedTypes={selectedTypes}
                selectedRegions={selectedRegions}
                onToggleType={toggleType}
                onToggleRegion={toggleRegion}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                {filtersOpen ? "Hide" : "Show"} Filters
                {hasActiveFilters && (
                  <span className="ml-1 text-emerald-600">
                    ({selectedTypes.size + selectedRegions.size})
                  </span>
                )}
              </button>
              {filtersOpen && (
                <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                  <FilterBar
                    types={types}
                    regions={regions}
                    selectedTypes={selectedTypes}
                    selectedRegions={selectedRegions}
                    onToggleType={toggleType}
                    onToggleRegion={toggleRegion}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
              )}
            </div>

            {viewMode === "grid" ? (
              <CatalogGrid
                items={filteredItems}
                onItemClick={setSelectedItem}
              />
            ) : (
              <MapView
                items={filteredItems}
                onItemClick={setSelectedItem}
              />
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
