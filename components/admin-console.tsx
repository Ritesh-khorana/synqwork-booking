"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

type AdminRoom = {
  id: string;
  locationId: string;
  name: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  availabilityScore: number;
  location?: {
    name: string;
    city: string;
  } | null;
};

type AdminBooking = {
  id: string;
  date: string;
  startTime: string;
  status: string;
  totalAmount: number;
  room?: { name: string } | null;
  user?: { name: string; company: string } | null;
  location?: { city: string } | null;
};

type AdminPayload = {
  summary: {
    totalRooms: number;
    totalLocations: number;
    totalBookings: number;
    confirmedBookings: number;
    revenue: number;
    occupancyRate: number;
  };
  bookings: AdminBooking[];
};

type AdminLocation = {
  id: string;
  name: string;
  city: string;
};

export function AdminConsole() {
  const fallbackLocations: AdminLocation[] = [
    { id: "fb_delhi_aloft_aerocity", name: "Aloft Aerocity", city: "Delhi" },
    { id: "fb_gurgaon_sas_towers", name: "SAS Towers", city: "Gurgaon" },
    { id: "fb_gurgaon_dlf_cyber_greens", name: "DLF Cyber Greens", city: "Gurgaon" },
    { id: "fb_gurgaon_gsc_towers", name: "GSC Towers", city: "Gurgaon" },
    { id: "fb_noida_ks_corporate_towers", name: "KS Corporate Towers", city: "Noida" },
    { id: "fb_mumbai_sahar_plaza", name: "Sahar Plaza", city: "Mumbai" },
    { id: "fb_faridabad_sahibabad_centre", name: "Sahibabad Centre", city: "Faridabad" },
    { id: "fb_chennai_olympia_tech_park", name: "Olympia Tech Park", city: "Chennai" },
  ];
  const cityOrder = ["Delhi", "Gurgaon", "Noida", "Mumbai", "Faridabad", "Chennai"];
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adminError, setAdminError] = useState("");
  const [dbConfigured, setDbConfigured] = useState(true);
  const effectiveLocations = locations.length ? locations : fallbackLocations;
  const cityOptions = cityOrder.filter((city) => effectiveLocations.some((location) => location.city === city));
  const [form, setForm] = useState({
    name: "",
    type: "Meeting Room",
    capacity: 6,
    pricePerHour: 1500,
    locationId: "",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    amenities: "Screen, WiFi, Whiteboard",
    rating: 4.7,
    reviewCount: 12,
    availabilityScore: 80,
    slug: "",
  });

  async function refresh() {
    const [roomsResponse, bookingsResponse, locationsResponse, statusResponse] = await Promise.all([
      fetch("/api/admin/rooms"),
      fetch("/api/admin/bookings"),
      fetch("/api/locations"),
      fetch("/api/admin/status"),
    ]);
    const roomsData = await roomsResponse.json();
    const bookingsData = await bookingsResponse.json();
    const locationsData = await locationsResponse.json();
    const statusData = await statusResponse.json().catch(() => ({}));
    setRooms(roomsData.rooms);
    setPayload(bookingsData);
    setLocations(locationsData.locations ?? []);
    setDbConfigured(Boolean(statusData.supabaseConfigured));
  }

  useEffect(() => {
    void refresh();
  }, []);

  const selectedCity = form.locationId
    ? (effectiveLocations.find((location) => location.id === form.locationId)?.city ?? "")
    : "";
  const centresForSelectedCity = selectedCity
    ? effectiveLocations.filter((location) => location.city === selectedCity)
    : [];
  const selectedCentre = effectiveLocations.find((location) => location.id === form.locationId) ?? null;

  useEffect(() => {
    if (form.locationId) return;
    const firstCity = cityOptions[0];
    if (!firstCity) return;
    const firstCentre = effectiveLocations.find((location) => location.city === firstCity);
    if (!firstCentre) return;
    setForm((current) => ({ ...current, locationId: firstCentre.id }));
  }, [cityOptions, effectiveLocations, form.locationId]);

  async function saveRoom() {
    setAdminError("");
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replaceAll(" ", "-"),
      type: form.type,
      capacity: Number(form.capacity),
      pricePerHour: Number(form.pricePerHour),
      locationId: form.locationId,
      centreName: selectedCentre?.name ?? "",
      city: selectedCentre?.city ?? "",
      image: form.image,
      amenities: form.amenities.split(",").map((item) => item.trim()),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      availabilityScore: Number(form.availabilityScore),
      featured: false,
    };

    if (!payload.locationId) {
      setAdminError("Please select a valid location.");
      return;
    }

    if (editingId) {
      const response = await fetch(`/api/admin/rooms/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setAdminError(data?.error ?? "Unable to update room.");
        return;
      }
    } else {
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setAdminError(data?.error ?? "Unable to create room.");
        return;
      }
    }

    setEditingId(null);
    setForm({
      name: "",
      type: "Meeting Room",
      capacity: 6,
      pricePerHour: 1500,
      locationId: "",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      amenities: "Screen, WiFi, Whiteboard",
      rating: 4.7,
      reviewCount: 12,
      availabilityScore: 80,
      slug: "",
    });
    await refresh();
  }

  async function removeRoom(id: string) {
    await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    if (editingId === id) {
      setEditingId(null);
    }
    await refresh();
  }

  function editRoom(room: AdminRoom) {
    setEditingId(room.id);
    setForm((current) => ({
      ...current,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      pricePerHour: room.pricePerHour,
      locationId: room.locationId,
      slug: room.name.toLowerCase().replaceAll(" ", "-"),
    }));
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[30px] border border-black/8 bg-white p-6">
        <h2 className="text-2xl font-semibold">{editingId ? "Edit Room" : "Add New Room"}</h2>
        {!dbConfigured ? (
          <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Persistence is disabled because Supabase is not configured. Add{" "}
            <span className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in Vercel Environment Variables.
          </div>
        ) : null}
        {adminError ? <p className="mt-4 text-sm font-medium text-rose-600">{adminError}</p> : null}
        <div className="mt-5 grid gap-4">
          <Input placeholder="Room name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
            <option value="Focus Room">Focus Room</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Boardroom">Boardroom</option>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: Number(event.target.value) }))} />
            <Input type="number" placeholder="Price / hour" value={form.pricePerHour} onChange={(event) => setForm((current) => ({ ...current, pricePerHour: Number(event.target.value) }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">City</label>
              <Select
                value={selectedCity}
                onChange={(event) => {
                  const city = event.target.value;
                  const firstCentre = effectiveLocations.find((location) => location.city === city);
                  setForm((current) => ({ ...current, locationId: firstCentre?.id ?? "" }));
                }}
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">Centre</label>
              <Select
                value={form.locationId}
                onChange={(event) => setForm((current) => ({ ...current, locationId: event.target.value }))}
              >
                {centresForSelectedCity.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <Input placeholder="Image URL" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} />
          <Input placeholder="Amenities separated by commas" value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} />
          <Button onClick={saveRoom}>{editingId ? "Update Room" : "Create Room"}</Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-black/8 bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Rooms</p>
            <p className="mt-2 text-3xl font-semibold">{payload?.summary.totalRooms ?? 0}</p>
          </div>
          <div className="rounded-[28px] border border-black/8 bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Bookings</p>
            <p className="mt-2 text-3xl font-semibold">{payload?.summary.totalBookings ?? 0}</p>
          </div>
          <div className="rounded-[28px] border border-black/8 bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[#404852]">Revenue</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(payload?.summary.revenue ?? 0)}</p>
          </div>
        </div>

        <div className="rounded-[30px] border border-black/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Room Inventory</h2>
            <p className="text-sm text-[#404852]">{rooms.length} rooms</p>
          </div>
          <div className="mt-6 space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="flex flex-col gap-4 rounded-[24px] border border-black/8 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{room.name}</p>
                  <p className="text-sm text-[#404852]">
                    {room.location?.city} | {room.capacity} seats | {formatCurrency(room.pricePerHour)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => editRoom(room)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => removeRoom(room.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-black/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Bookings</h2>
            <p className="text-sm text-[#404852]">{payload?.bookings.length ?? 0} records</p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[#404852]">
                <tr className="border-b border-black/8">
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 pr-4">Room</th>
                  <th className="py-3 pr-4">Schedule</th>
                  <th className="py-3 pr-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payload?.bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-black/5">
                    <td className="py-4 pr-4">
                      <p className="font-medium">{booking.user?.name}</p>
                      <p className="text-[#404852]">{booking.user?.company}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <p className="font-medium">{booking.room?.name}</p>
                      <p className="text-[#404852]">{booking.location?.city}</p>
                    </td>
                    <td className="py-4 pr-4">{booking.date}, {booking.startTime}</td>
                    <td className="py-4 pr-4 font-medium">{formatCurrency(booking.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
