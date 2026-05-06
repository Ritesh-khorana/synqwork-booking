import { SearchFilters } from "@/components/search-filters";
import { RoomCard } from "@/components/room-card";
import { SectionHeading } from "@/components/section-heading";
import { listRooms } from "@/lib/supabase-service";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rooms = await listRooms({
    location:
      typeof params.location === "string"
        ? params.location.toLowerCase() === "new delhi"
          ? "Delhi"
          : params.location
        : undefined,
    date: typeof params.date === "string" ? params.date : undefined,
    slot: typeof params.slot === "string" ? params.slot : undefined,
    capacity: typeof params.capacity === "string" ? Number(params.capacity) : undefined,
    minPrice: typeof params.minPrice === "string" ? Number(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined,
  });

  return (
    <div className="section-shell py-12 md:py-16">
      <SectionHeading
        eyebrow="Search Rooms"
        title="Compare premium meeting inventory with clarity."
        description="Fast discovery, progressive filtering, and explicit availability cues keep the search experience sharp on both desktop and mobile."
      />
      <div className="mt-8">
        <SearchFilters />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm text-[#404852]">{rooms.length} room{rooms.length === 1 ? "" : "s"} available</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
