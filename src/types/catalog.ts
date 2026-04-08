export interface CatalogLocation {
  name: string;
  state: string | null;
  region: string;
  lat: number | null;
  lng: number | null;
}

export type ItemType =
  | "trail-map"
  | "road-map"
  | "hiking-book"
  | "guidebook"
  | "brochure"
  | "atlas"
  | "city-map";

export interface CatalogItem {
  id: string;
  title: string;
  publisher: string;
  type: ItemType;
  category: string;
  location: CatalogLocation;
  tags: string[];
  image: string;
  notes: string;
}

export const TYPE_LABELS: Record<ItemType, string> = {
  "trail-map": "Trail Map",
  "road-map": "Road Map",
  "hiking-book": "Hiking Book",
  guidebook: "Guidebook",
  brochure: "Brochure",
  atlas: "Atlas",
  "city-map": "City Map",
};

export const TYPE_COLORS: Record<ItemType, { pill: string; pillMuted: string; dot: string }> = {
  "city-map":    { pill: "bg-blue-100 border-blue-300 text-blue-800",       pillMuted: "bg-blue-50 border-blue-200 text-blue-600",       dot: "#3b82f6" },
  "road-map":    { pill: "bg-red-100 border-red-300 text-red-800",          pillMuted: "bg-red-50 border-red-200 text-red-600",          dot: "#ef4444" },
  "trail-map":   { pill: "bg-green-100 border-green-300 text-green-800",    pillMuted: "bg-green-50 border-green-200 text-green-600",    dot: "#22c55e" },
  "hiking-book": { pill: "bg-amber-100 border-amber-300 text-amber-800",    pillMuted: "bg-amber-50 border-amber-200 text-amber-600",    dot: "#f59e0b" },
  guidebook:     { pill: "bg-purple-100 border-purple-300 text-purple-800",  pillMuted: "bg-purple-50 border-purple-200 text-purple-600",  dot: "#a855f7" },
  brochure:      { pill: "bg-teal-100 border-teal-300 text-teal-800",       pillMuted: "bg-teal-50 border-teal-200 text-teal-600",       dot: "#14b8a6" },
  atlas:         { pill: "bg-stone-100 border-stone-300 text-stone-800",     pillMuted: "bg-stone-50 border-stone-200 text-stone-600",     dot: "#78716c" },
};
