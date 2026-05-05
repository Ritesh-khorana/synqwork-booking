import { NextRequest, NextResponse } from "next/server";
import { getAvailabilityForRoom, getAvailabilitySnapshot } from "@/lib/supabase-service";

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get("roomId");
  const date = request.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  if (roomId) {
    return NextResponse.json(await getAvailabilityForRoom(roomId, date));
  }

  return NextResponse.json({ availability: await getAvailabilitySnapshot(date) });
}
