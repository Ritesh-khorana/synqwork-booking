import { CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const bookingId = typeof params.bookingId === "string" ? params.bookingId : "SYNQ-DEMO";
  const room = typeof params.room === "string" ? params.room : "Your selected room";
  const centre = typeof params.centre === "string" ? params.centre : "";
  const city = typeof params.city === "string" ? params.city : "";
  const slot = typeof params.slot === "string" ? params.slot : "Scheduled slot";
  const date = typeof params.date === "string" ? params.date : "Upcoming date";

  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-3xl rounded-[36px] border border-black/8 bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDE59]">
          <CalendarCheck2 className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-[#404852]">Booking Confirmed</p>
        <h1 className="mt-4 text-4xl font-semibold text-balance">Your meeting room is locked in.</h1>
        <p className="mt-4 text-lg leading-8 text-[#404852]">Confirmation ID <span className="font-semibold text-black">{bookingId}</span></p>
        <div className="mt-6 text-left text-[#404852]">
          <p><span className="font-semibold text-black">Room:</span> {room}</p>
          <p><span className="font-semibold text-black">Centre:</span> {centre}</p>
          <p><span className="font-semibold text-black">City:</span> {city}</p>
          <p><span className="font-semibold text-black">Booking Date:</span> {date}</p>
          <p><span className="font-semibold text-black">Time:</span> {slot}</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/search"><Button>Book Another Room</Button></a>
        </div>
      </div>
    </div>
  );
}
