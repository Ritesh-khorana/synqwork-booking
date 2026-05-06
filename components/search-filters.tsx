"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { timeSlots } from "@/lib/data";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/locations", { cache: "no-store" });
      const data = await response.json().catch(() => ({ locations: [] }));
      const unique = Array.from(new Set((data.locations ?? []).map((l: { city?: string }) => l.city).filter(Boolean)));
      setCities(unique);
    })();
  }, []);

  const normalizedLocation = useMemo(() => {
    const value = searchParams.get("location") ?? "";
    return value.toLowerCase() === "new delhi" ? "Delhi" : value;
  }, [searchParams]);

  function onSubmit(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString());

    ["location", "date", "slot", "capacity"].forEach((key) => {
      const value = formData.get(key)?.toString();
      if (value) params.set(key, value);
      else params.delete(key);
    });

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form action={onSubmit} className="glass-panel grid gap-4 rounded-[30px] p-5 md:grid-cols-5 md:items-end">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Location</label>
        <Select name="location" defaultValue={normalizedLocation}>
          <option value="">Any city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
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
      <Button variant="secondary" className="h-[50px]">
        Find Rooms
      </Button>
    </form>
  );
}
