"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Check, LoaderCircle, MapPin, Users } from "lucide-react";
import { BookingStepper } from "@/components/booking-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { timeSlots } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const defaultDate = new Date().toISOString().slice(0, 10);

type BookingRoom = {
  id: string;
  locationId: string;
  name: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  location?: {
    id: string;
    name: string;
    city: string;
  } | null;
};

export function BookingExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetRoomId = searchParams.get("roomId");
  const hasPresetRoom = Boolean(presetRoomId);
  const [step, setStep] = useState(0);
  const [, startTransition] = useTransition();
  const [roomOptions, setRoomOptions] = useState<BookingRoom[]>([]);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: defaultDate,
    slotId: "",
    roomId: presetRoomId ?? "",
    name: "",
    email: "",
    contactNumber: "",
    company: "",
    attendees: 4,
    notes: "",
  });

  const selectedRoom = useMemo(() => roomOptions.find((room) => room.id === form.roomId), [form.roomId, roomOptions]);
  const selectedLocation = selectedRoom?.location;
  const selectedSlot = timeSlots.find((slot) => slot.id === form.slotId);
  const total = selectedRoom && selectedSlot ? Math.round(selectedRoom.pricePerHour * selectedSlot.peakMultiplier) : 0;

  useEffect(() => {
    startTransition(async () => {
      const response = await fetch("/api/rooms", { cache: "no-store" });
      const data = await response.json();
      setRoomOptions(data.rooms ?? []);
    });
  }, [startTransition]);

  useEffect(() => {
    if (!form.date) return;
    startTransition(async () => {
      const response = await fetch(`/api/availability?date=${form.date}`);
      const data = await response.json();
      const roomAvailability = data.availability as { roomId: string; availableSlots: string[] }[];
      setAvailability(
        roomAvailability.reduce<Record<string, string[]>>((accumulator, item) => {
          accumulator[item.roomId] = item.availableSlots;
          return accumulator;
        }, {}),
      );
    });
  }, [form.date, form.roomId, startTransition]);

  useEffect(() => {
    if (presetRoomId) {
      // When a room is preselected (e.g. "Book Now" from listing),
      // start at "Choose slot" so we never skip time selection.
      setStep(1);
    }
  }, [presetRoomId]);

  const filteredRooms = useMemo(
    () => roomOptions.filter((room) => room.capacity >= form.attendees),
    [form.attendees, roomOptions],
  );

  function nextStep() {
    setError("");
    setStep((value) => {
      // If a room is preselected, skip "Pick room" after choosing a slot.
      if (hasPresetRoom && value === 1) return 3;
      return Math.min(value + 1, 4);
    });
  }

  function previousStep() {
    setError("");
    setStep((value) => {
      // If a room is preselected, skip "Pick room" when going back from details.
      if (hasPresetRoom && value === 3) return 1;
      return Math.max(value - 1, 0);
    });
  }

  async function confirmBooking() {
    if (!form.roomId || !form.slotId || !form.name || !form.email || !form.contactNumber || !form.company) {
      setError("Please complete all booking details before confirming.");
      return;
    }

    setSubmitting(true);
    setError("");

    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to complete booking.");
      return;
    }

    router.push(
      `/confirmation?bookingId=${data.booking.id}&room=${encodeURIComponent(data.room.name)}&slot=${encodeURIComponent(
        `${data.slot.startTime} - ${data.slot.endTime}`,
      )}&date=${encodeURIComponent(data.booking.date)}`,
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#404852]">Booking Flow</p>
        <h1 className="mt-4 text-4xl font-semibold text-balance md:text-5xl">Reserve the right room in five guided steps.</h1>
      </div>
      <BookingStepper currentStep={step} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[34px] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
          {step === 0 && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Step 1</p>
              <h2 className="mt-3 text-3xl font-semibold">Select your date</h2>
              <div className="mt-6">
                <Input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Step 2</p>
              <h2 className="mt-3 text-3xl font-semibold">Choose your time slot</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, slotId: slot.id }))}
                    className={`rounded-3xl border p-4 text-left transition ${
                      form.slotId === slot.id ? "border-black bg-black text-white" : "border-black/10 bg-[#f8f8f6]"
                    }`}
                  >
                    <p className="font-medium">{slot.label}</p>
                    <p className={`mt-2 text-sm ${form.slotId === slot.id ? "text-white/75" : "text-[#404852]"}`}>
                      Multiplier {slot.peakMultiplier}x
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Step 3</p>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="mt-3 text-3xl font-semibold">Pick your room</h2>
                  <p className="mt-3 text-sm leading-7 text-[#404852]">Filtered by attendee count and live availability for the chosen date.</p>
                </div>
                <div className="w-full md:max-w-48">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Attendees</label>
                  <Input type="number" min="1" value={form.attendees} onChange={(event) => setForm((current) => ({ ...current, attendees: Number(event.target.value) }))} />
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                {filteredRooms.map((room) => {
                  const available = !form.slotId || (availability[room.id] ?? []).includes(form.slotId);
                  const isSelected = form.roomId === room.id;
                  const location = room.location;

                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, roomId: room.id }))}
                      className={`rounded-[28px] border p-5 text-left transition ${
                        isSelected ? "border-black bg-black text-white" : "border-black/10 bg-[#f8f8f6]"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="inline-flex rounded-full bg-[#FFDE59]/70 px-3 py-1 text-xs font-semibold text-black">
                            {room.type}
                          </div>
                          <h3 className="mt-3 text-2xl font-semibold">{room.name}</h3>
                          <div className={`mt-3 flex flex-wrap gap-4 text-sm ${isSelected ? "text-white/80" : "text-[#404852]"}`}>
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4" /> {location?.city}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Users className="h-4 w-4" /> {room.capacity} seats
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">{formatCurrency(room.pricePerHour)}</p>
                          <p className={`mt-2 text-sm ${available ? "text-emerald-500" : "text-rose-400"}`}>
                            {available ? "Available for selected slot" : "Slot unavailable"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Step 4</p>
              <h2 className="mt-3 text-3xl font-semibold">Enter booking details</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                <Input placeholder="Work email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
                <Input
                  placeholder="Contact number"
                  inputMode="tel"
                  value={form.contactNumber}
                  onChange={(event) => setForm((current) => ({ ...current, contactNumber: event.target.value }))}
                />
                <Input placeholder="Company name" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} />
                <Select value={String(form.attendees)} onChange={(event) => setForm((current) => ({ ...current, attendees: Number(event.target.value) }))}>
                  {[2, 4, 6, 8, 10, 12].map((value) => (
                    <option key={value} value={value}>
                      {value} attendees
                    </option>
                  ))}
                </Select>
                <div className="md:col-span-2">
                  <Input placeholder="Notes, event purpose, or setup requests" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Step 5</p>
              <h2 className="mt-3 text-3xl font-semibold">Ready to confirm</h2>
              <div className="mt-6 rounded-[28px] border border-black/10 bg-[#f8f8f6] p-5">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Check className="h-5 w-5" />
                  <p className="font-medium">All booking details are complete.</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#404852]">
                  Click confirm to create the booking and route to the confirmation screen.
                </p>
              </div>
            </div>
          )}

          {error ? <p className="mt-6 text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 0 && <Button variant="ghost" onClick={previousStep}>Back</Button>}
            {step < 4 && (
              <Button
                onClick={nextStep}
                disabled={
                  (step === 1 && !form.slotId) ||
                  (step === 2 && !form.roomId) ||
                  (step === 3 && (!form.name || !form.email || !form.contactNumber || !form.company))
                }
              >
                Continue
              </Button>
            )}
            {step === 4 && (
              <Button onClick={confirmBooking} disabled={submitting}>
                {submitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Booking
              </Button>
            )}
          </div>
        </div>

        <aside className="rounded-[34px] border border-black/8 bg-black p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.1)] md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-[#FFDE59]">Booking Summary</p>
          <h2 className="mt-3 text-3xl font-semibold">{selectedRoom?.name ?? "Select a room"}</h2>
          <div className="mt-6 space-y-4 text-sm text-white/75">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-[#FFDE59]" />
              <span>{form.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-[#FFDE59]" />
              <span>{form.attendees} attendees</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#FFDE59]" />
              <span>{selectedLocation?.name ?? "Choose location"}</span>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] bg-white/8 p-5">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Time slot</span>
              <span>{selectedSlot?.label ?? "Not selected"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/70">
              <span>Base rate</span>
              <span>{selectedRoom ? formatCurrency(selectedRoom.pricePerHour) : "TBD"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/70">
              <span>Confirmation</span>
              <span>Instant reservation</span>
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.18em] text-white/60">Total</span>
                <span className="text-3xl font-semibold text-[#FFDE59]">{total ? formatCurrency(total) : "TBD"}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
