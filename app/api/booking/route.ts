import { NextResponse } from "next/server";
import { timeSlots } from "@/lib/data";
import { getRoomById, createBooking as createSupabaseBooking } from "@/lib/supabase-service";
import { sendBookingEmails } from "@/lib/email";

function compactBookingId(centreName: string, date: string, bookingId: string) {
  const centre = centreName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5) || "CENTR";
  const d = date.replaceAll("-", "").slice(2);
  const suffix = bookingId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(-4).padStart(4, "0");
  return `SW-${centre}-${d}${suffix}`;
}

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const roomId = payload.roomId as string | undefined;
    const date = payload.date as string | undefined;
    const rawSlotIds = (payload.slotIds as string[] | undefined) ?? [];
    const fallbackSlotId = payload.slotId as string | undefined;
    const slotIds = rawSlotIds.length > 0 ? rawSlotIds : fallbackSlotId ? [fallbackSlotId] : [];
    const name = payload.name as string | undefined;
    const email = payload.email as string | undefined;
    const phone = (payload.contactNumber as string | undefined) ?? (payload.phone as string | undefined);
    const companyName = payload.company as string | undefined;
    const notes = payload.notes as string | undefined;

    if (!roomId || !date || slotIds.length === 0 || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
    }

    const room = await getRoomById(roomId);
    if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });

    const slots = slotIds.map((id) => timeSlots.find((s) => s.id === id)).filter(Boolean);
    if (slots.length !== slotIds.length) {
      return NextResponse.json({ error: "Invalid time slot selection." }, { status: 400 });
    }

    const startTime = slots[0]!.startTime;
    const endTime = slots[slots.length - 1]!.endTime;
    const totalHours = slots.length;
    const totalAmount = Math.round(room.pricePerHour * totalHours);

    const booking = await createSupabaseBooking({
      roomId,
      date,
      startTime,
      endTime,
      totalHours,
      totalAmount,
      name,
      email,
      phone,
      companyName,
      notes,
    });
    const displayId = compactBookingId(room.location?.name ?? "CENTRE", booking.date, booking.id);
    const slotLabel = `${startTime} - ${endTime}`;
    await sendBookingEmails({
      bookingId: displayId,
      customerEmail: email,
      customerName: name,
      roomName: room.name,
      centreName: room.location?.name ?? "",
      city: room.location?.city ?? "",
      address: room.location ? `${room.location.name}, ${room.location.city}` : "",
      date: booking.date,
      time: slotLabel,
      amount: booking.total_amount,
    });

    return NextResponse.json({
      message: "Booking confirmed",
      booking: {
        id: booking.id,
        displayId,
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        status: booking.status,
        totalAmount: booking.total_amount,
      },
      room: { name: room.name, centre: room.location?.name ?? "", city: room.location?.city ?? "" },
      slot: { startTime, endTime },
      emailStatus: "mocked-sent",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking" },
      { status: 400 },
    );
  }
}
