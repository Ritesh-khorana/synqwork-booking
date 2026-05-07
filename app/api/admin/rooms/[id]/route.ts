import { NextResponse } from "next/server";
import { deleteRoom, updateRoom } from "@/lib/supabase-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();

  try {
    const room = await updateRoom(id, {
      centreId: payload.locationId ?? payload.centreId,
      name: payload.name,
      capacity: payload.capacity !== undefined ? Number(payload.capacity) : undefined,
      pricePerHour: payload.pricePerHour !== undefined ? Number(payload.pricePerHour) : undefined,
      type: payload.type,
      amenities: Array.isArray(payload.amenities) ? payload.amenities : undefined,
      imageUrl: payload.image ?? payload.imageUrl,
      description: Array.isArray(payload.amenities) ? payload.amenities.join(", ") : payload.description,
      isActive: payload.isActive,
    });
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update room" },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const room = await deleteRoom(id);
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete room" },
      { status: 400 },
    );
  }
}
