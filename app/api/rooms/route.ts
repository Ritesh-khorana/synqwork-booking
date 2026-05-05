import { NextRequest, NextResponse } from "next/server";
import { listRooms } from "@/lib/supabase-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const rooms = await listRooms({
      location: searchParams.get("location") ?? undefined,
      date: searchParams.get("date") ?? undefined,
      slot: searchParams.get("slot") ?? undefined,
      capacity: searchParams.get("capacity") ? Number(searchParams.get("capacity")) : undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load rooms" },
      { status: 500 },
    );
  }
}
