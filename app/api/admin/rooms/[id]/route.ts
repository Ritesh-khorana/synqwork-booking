import { NextResponse } from "next/server";
import { deleteRoom, updateRoom } from "@/lib/booking-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();

  try {
    const room = await updateRoom(id, payload);
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update room" },
      { status: 404 },
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
      { status: 404 },
    );
  }
}
