import { NextResponse } from "next/server";
import { getRoomById } from "@/lib/supabase-service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ room });
}
