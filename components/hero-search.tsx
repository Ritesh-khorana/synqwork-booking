"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function HeroSearch() {
  const router = useRouter();

  function onSubmit(formData: FormData) {
    const location = formData.get("location")?.toString();
    const date = formData.get("date")?.toString();
    const capacity = formData.get("capacity")?.toString();

    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (capacity) params.set("capacity", capacity);

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form action={onSubmit} className="glass-panel mt-10 grid gap-4 rounded-[32px] p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
      <div className="rounded-[24px] border border-black/5 bg-white px-4 py-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#404852]">Location</label>
        <Select name="location" className="border-0 bg-transparent px-0 py-0 pr-8">
          <option value="">Search by city</option>
          <option value="Gurugram">Gurugram</option>
          <option value="New Delhi">New Delhi</option>
          <option value="Noida">Noida</option>
        </Select>
      </div>
      <div className="rounded-[24px] border border-black/5 bg-white px-4 py-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#404852]">Date</label>
        <Input type="date" name="date" className="border-0 bg-transparent px-0 py-0 pr-8" />
      </div>
      <div className="rounded-[24px] border border-black/5 bg-white px-4 py-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#404852]">Team Size</label>
        <Input type="number" min="1" name="capacity" placeholder="4 or more" className="border-0 bg-transparent px-0 py-0 pr-28" />
      </div>
      <Button variant="secondary" className="h-full min-h-[68px] px-7 whitespace-nowrap">
        <Search className="mr-2 h-4 w-4" />
        Find Rooms
      </Button>
    </form>
  );
}
