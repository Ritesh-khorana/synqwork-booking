import { NextRequest, NextResponse } from "next/server";
import { listRooms } from "@/lib/booking-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rooms = await listRooms({
    location: searchParams.get("location") ?? undefined,
    date: searchParams.get("date") ?? undefined,
    slot: searchParams.get("slot") ?? undefined,
    capacity: searchParams.get("capacity") ? Number(searchParams.get("capacity")) : undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  });

  return NextResponse.json({ rooms });
}
