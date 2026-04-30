"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { timeSlots } from "@/lib/data";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);

  function onSubmit(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString());

    ["location", "date", "slot", "capacity", "minPrice", "maxPrice"].forEach((key) => {
      const value = formData.get(key)?.toString();
      if (value) params.set(key, value);
      else params.delete(key);
    });

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form action={onSubmit} className="glass-panel grid gap-4 rounded-[30px] p-5 md:grid-cols-6 md:items-end">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Location</label>
        <Select name="location" defaultValue={searchParams.get("location") ?? ""}>
          <option value="">Any city</option>
          <option value="Gurugram">Gurugram</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="New Delhi">New Delhi</option>
          <option value="Noida">Noida</option>
          <option value="Chennai">Chennai</option>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Date</label>
        <Input name="date" type="date" min={today} defaultValue={searchParams.get("date") ?? ""} />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Slot</label>
        <Select name="slot" defaultValue={searchParams.get("slot") ?? ""}>
          <option value="">Any slot</option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Capacity</label>
        <Input name="capacity" type="number" min="1" placeholder="4+" defaultValue={searchParams.get("capacity") ?? ""} />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input name="minPrice" type="number" placeholder="Min" defaultValue={searchParams.get("minPrice") ?? ""} />
          <Input name="maxPrice" type="number" placeholder="Max" defaultValue={searchParams.get("maxPrice") ?? ""} />
        </div>
      </div>
      <Button variant="secondary" className="h-[50px]">
        Find Rooms
      </Button>
    </form>
  );
}
