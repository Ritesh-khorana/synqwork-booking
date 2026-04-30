import { NextResponse } from "next/server";
import { getLocations } from "@/lib/booking-service";

export async function GET() {
  return NextResponse.json({ locations: await getLocations() });
}

