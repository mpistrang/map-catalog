import Fuse, { type IFuseOptions } from "fuse.js";
import type { CatalogItem } from "../types/catalog";

const fuseOptions: IFuseOptions<CatalogItem> = {
  keys: [
    { name: "title", weight: 3 },
    { name: "publisher", weight: 2 },
    { name: "location.name", weight: 2 },
    { name: "location.state", weight: 1.5 },
    { name: "location.region", weight: 1 },
    { name: "tags", weight: 1 },
    { name: "category", weight: 1 },
    { name: "notes", weight: 0.5 },
  ],
  threshold: 0.35,
  includeScore: true,
};

export function createSearchIndex(items: CatalogItem[]): Fuse<CatalogItem> {
  return new Fuse(items, fuseOptions);
}

export function searchCatalog(
  fuse: Fuse<CatalogItem>,
  query: string
): CatalogItem[] {
  if (!query.trim()) return fuse.getIndex().docs as unknown as CatalogItem[];
  return fuse.search(query).map((result) => result.item);
}
