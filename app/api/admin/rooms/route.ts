import { NextResponse } from "next/server";
import { createRoom, listAdminRooms } from "@/lib/supabase-service";

export async function GET() {
  try {
    return NextResponse.json({ rooms: await listAdminRooms() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load rooms" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const payload = await request.json();
  try {
    const room = await createRoom({
      centreId: payload.locationId ?? payload.centreId,
      name: payload.name,
      capacity: Number(payload.capacity),
      pricePerHour: Number(payload.pricePerHour),
      imageUrl: payload.image ?? payload.imageUrl ?? null,
      description: Array.isArray(payload.amenities) ? payload.amenities.join(", ") : payload.description ?? null,
      isActive: true,
    });
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create room" },
      { status: 400 },
    );
  }
}
