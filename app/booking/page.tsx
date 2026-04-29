import { Suspense } from "react";
import { BookingExperience } from "@/components/booking-experience";

export default function BookingPage() {
  return (
    <div className="section-shell py-12 md:py-16">
      <Suspense fallback={<div className="rounded-[34px] border border-black/8 bg-white p-8">Loading booking flow...</div>}>
        <BookingExperience />
      </Suspense>
    </div>
  );
}
