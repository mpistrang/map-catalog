import catalogData from "../../catalog.json";
import type { CatalogItem } from "../types/catalog";

export const catalog: CatalogItem[] = catalogData as CatalogItem[];

export function getUniqueTypes(): string[] {
  return [...new Set(catalog.map((item) => item.type))].sort();
}

export function getUniqueRegions(): string[] {
  return [...new Set(catalog.map((item) => item.location.region))].sort();
}

export function getUniqueStates(): string[] {
  return [
    ...new Set(
      catalog
        .map((item) => item.location.state)
        .filter((s): s is string => s !== null)
    ),
  ].sort();
}

export function getUniqueTags(): string[] {
  return [...new Set(catalog.flatMap((item) => item.tags))].sort();
}

export function getUniqueCategories(): string[] {
  return [...new Set(catalog.map((item) => item.category))].sort();
}
