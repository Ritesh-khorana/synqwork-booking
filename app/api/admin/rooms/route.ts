import { NextResponse } from "next/server";
import { createRoom, listRooms } from "@/lib/booking-service";

export async function GET() {
  return NextResponse.json({ rooms: await listRooms() });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const room = await createRoom(payload);
  return NextResponse.json({ room }, { status: 201 });
}
