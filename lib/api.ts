import type { SearchFilters } from "@/lib/types";

export async function fetchRooms(filters: SearchFilters = {}) {
  const params = new URLSearchParams();
  if (filters.location) params.set("location", filters.location);
  if (filters.date) params.set("date", filters.date);
  if (filters.slot) params.set("slot", filters.slot);
  if (filters.capacity) params.set("capacity", String(filters.capacity));
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));

  const response = await fetch(`/api/rooms?${params.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to fetch rooms");
  return response.json();
}
