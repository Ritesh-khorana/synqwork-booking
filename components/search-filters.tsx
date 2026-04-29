"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
        <Input name="date" type="date" defaultValue={searchParams.get("date") ?? ""} />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Slot</label>
        <Select name="slot" defaultValue={searchParams.get("slot") ?? ""}>
          <option value="">Any slot</option>
          <option value="slot_1">09:00 - 10:00</option>
          <option value="slot_2">10:00 - 11:00</option>
          <option value="slot_3">11:00 - 12:00</option>
          <option value="slot_4">12:00 - 13:00</option>
          <option value="slot_5">14:00 - 15:00</option>
          <option value="slot_6">15:00 - 16:00</option>
          <option value="slot_7">16:00 - 17:00</option>
          <option value="slot_8">17:00 - 18:00</option>
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
