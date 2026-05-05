import { NextResponse } from "next/server";
import { getAdminBookings, getAdminSummary } from "@/lib/supabase-service";

export async function GET() {
  return NextResponse.json({
    summary: await getAdminSummary(),
    bookings: await getAdminBookings(),
  });
}
