import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking-service";

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const result = await createBooking(payload);
    return NextResponse.json({
      message: "Booking confirmed",
      ...result,
      emailStatus: "mocked-sent",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking" },
      { status: 400 },
    );
  }
}
