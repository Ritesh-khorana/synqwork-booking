import { format } from "date-fns";
import { getSupabaseClient } from "@/lib/supabase";
import { timeSlots } from "@/lib/data";
import type { AvailabilityResponse, SearchFilters } from "@/lib/types";

type CentreRow = {
  id: string;
  name: string;
  address: string;
  city: string;
  google_map_link: string | null;
  created_at: string;
};

type RoomRow = {
  id: string;
  centre_id: string;
  name: string;
  capacity: number;
  price_per_hour: number;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

type BookingRow = {
  id: string;
  room_id: string;
  centre_id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_amount: number;
  notes: string | null;
  status: "confirmed" | "cancelled";
  created_at: string;
};

function minutes(time: string) {
  const [h, m] = time.split(":").map((v) => Number(v));
  return h * 60 + m;
}

function overlaps(slotStart: string, slotEnd: string, bookingStart: string, bookingEnd: string) {
  const s1 = minutes(slotStart);
  const e1 = minutes(slotEnd);
  const s2 = minutes(bookingStart);
  const e2 = minutes(bookingEnd);
  return s1 < e2 && s2 < e1;
}

export async function listCentres() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("centres")
    .select("id,name,address,city,google_map_link,created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CentreRow[];
}

export async function listRooms(filters: SearchFilters = {}) {
  const supabase = getSupabaseClient();
  // Base query (rooms + join centre)
  let query = supabase
    .from("rooms")
    .select(
      "id,centre_id,name,capacity,price_per_hour,image_url,description,is_active,created_at, centres:centres(id,name,address,city,google_map_link,created_at)",
    )
    .eq("is_active", true);

  if (filters.capacity) query = query.gte("capacity", filters.capacity);
  // Price range removed from UI, but keep compatibility if query params exist.
  if (filters.minPrice) query = query.gte("price_per_hour", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price_per_hour", filters.maxPrice);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as (RoomRow & { centres: CentreRow | CentreRow[] | null })[];
  let mapped = rows.map((room) => {
    const centre = Array.isArray(room.centres) ? room.centres[0] : room.centres;
    return ({
    id: room.id,
    locationId: room.centre_id,
    name: room.name,
    slug: room.name.toLowerCase().replaceAll(" ", "-"),
    type: "Meeting Room",
    capacity: room.capacity,
    pricePerHour: room.price_per_hour,
    amenities: [],
    image: room.image_url ?? "",
    rating: 4.7,
    reviewCount: 12,
    availabilityScore: 80,
    featured: false,
    location: centre
      ? {
          id: centre.id,
          name: centre.name,
          city: centre.city,
        }
      : null,
    });
  });

  if (filters.location) {
    const want = filters.location.toLowerCase();
    mapped = mapped.filter((r) => r.location?.city?.toLowerCase() === want);
  }

  if (!filters.date || !filters.slot) {
    return mapped;
  }

  const availabilityList = await Promise.all(mapped.map((room) => getAvailabilityForRoom(room.id, filters.date!)));
  const availabilityMap = new Map(availabilityList.map((item) => [item.roomId, item.availableSlots]));
  return mapped.filter((room) => (availabilityMap.get(room.id) ?? []).includes(filters.slot as string));
}

export async function listAdminRooms() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id,centre_id,name,capacity,price_per_hour,image_url,description,is_active,created_at, centres:centres(id,name,city)",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as (RoomRow & {
    centres: Pick<CentreRow, "id" | "name" | "city"> | Pick<CentreRow, "id" | "name" | "city">[] | null;
  })[];
  return rows.map((room) => {
    const centre = Array.isArray(room.centres) ? room.centres[0] : room.centres;
    return ({
    id: room.id,
    locationId: room.centre_id,
    name: room.name,
    type: "Meeting Room",
    capacity: room.capacity,
    pricePerHour: room.price_per_hour,
    availabilityScore: 80,
    location: centre
      ? {
          name: centre.name,
          city: centre.city,
        }
      : null,
    });
  });
}

export async function getRoomById(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id,centre_id,name,capacity,price_per_hour,image_url,description,is_active,created_at, centres:centres(id,name,address,city,google_map_link,created_at)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const room = data as unknown as RoomRow & { centres: CentreRow | CentreRow[] | null };
  const centre = Array.isArray(room.centres) ? room.centres[0] : room.centres;
  return {
    id: room.id,
    locationId: room.centre_id,
    name: room.name,
    slug: room.name.toLowerCase().replaceAll(" ", "-"),
    type: "Meeting Room",
    capacity: room.capacity,
    pricePerHour: room.price_per_hour,
    amenities: [],
    image: room.image_url ?? "",
    rating: 4.7,
    reviewCount: 12,
    availabilityScore: 80,
    featured: false,
    location: centre
      ? {
          id: centre.id,
          name: centre.name,
          city: centre.city,
        }
      : null,
  };
}

export async function getAvailabilityForRoom(roomId: string, date = format(new Date(), "yyyy-MM-dd")): Promise<AvailabilityResponse> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time,end_time,status")
    .eq("room_id", roomId)
    .eq("date", date)
    .neq("status", "cancelled");
  if (error) throw new Error(error.message);

  const bookings = (data ?? []) as Pick<BookingRow, "start_time" | "end_time" | "status">[];
  const availableSlots = timeSlots
    .filter((slot) => !bookings.some((b) => overlaps(slot.startTime, slot.endTime, b.start_time, b.end_time)))
    .map((slot) => slot.id);

  return { roomId, date, availableSlots };
}

export async function getAvailabilitySnapshot(date: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("rooms").select("id,centre_id").eq("is_active", true);
  if (error) throw new Error(error.message);
  const rooms = (data ?? []) as Pick<RoomRow, "id" | "centre_id">[];
  return Promise.all(
    rooms.map(async (room) => ({
      ...(await getAvailabilityForRoom(room.id, date)),
      roomName: room.id,
      locationId: room.centre_id,
    })),
  );
}

export async function createRoom(input: {
  centreId: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  imageUrl?: string;
  description?: string;
  isActive?: boolean;
}) {
  const supabase = getSupabaseClient();
  const row = {
    centre_id: input.centreId,
    name: input.name,
    capacity: input.capacity,
    price_per_hour: input.pricePerHour,
    image_url: input.imageUrl ?? null,
    description: input.description ?? null,
    is_active: input.isActive ?? true,
  };

  // Supabase types can infer `never` without generated Database types; use array insert and pick first row.
  const { data, error } = await supabase.from("rooms").insert([row]).select("*");
  if (error) throw new Error(error.message);
  const created = Array.isArray(data) ? data[0] : data;
  if (!created) throw new Error("Unable to create room.");
  return created as RoomRow;
}

export async function updateRoom(id: string, input: Partial<{
  centreId: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
  description: string;
  isActive: boolean;
}>) {
  const supabase = getSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (input.centreId !== undefined) patch.centre_id = input.centreId;
  if (input.name !== undefined) patch.name = input.name;
  if (input.capacity !== undefined) patch.capacity = input.capacity;
  if (input.pricePerHour !== undefined) patch.price_per_hour = input.pricePerHour;
  if (input.imageUrl !== undefined) patch.image_url = input.imageUrl;
  if (input.description !== undefined) patch.description = input.description;
  if (input.isActive !== undefined) patch.is_active = input.isActive;

  const { data, error } = await supabase.from("rooms").update(patch).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as RoomRow;
}

export async function deleteRoom(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("rooms").delete().eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as RoomRow;
}

export async function createBooking(input: {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalAmount: number;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  notes?: string;
}) {
  const supabase = getSupabaseClient();
  // look up centre_id from room
  const { data: room, error: roomErr } = await supabase.from("rooms").select("centre_id").eq("id", input.roomId).single();
  if (roomErr) throw new Error(roomErr.message);

  const bookingRow = {
    room_id: input.roomId,
    centre_id: (room as Pick<RoomRow, "centre_id">).centre_id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company_name: input.companyName ?? null,
    date: input.date,
    start_time: input.startTime,
    end_time: input.endTime,
    total_hours: input.totalHours,
    total_amount: input.totalAmount,
    notes: input.notes ?? null,
    status: "confirmed" as const,
  };

  const { data, error } = await supabase.from("bookings").insert([bookingRow]).select("*");
  if (error) throw new Error(error.message);
  const created = Array.isArray(data) ? data[0] : data;
  if (!created) throw new Error("Unable to create booking.");
  return created as BookingRow;
}

export async function getAdminBookings() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id,date,start_time,end_time,status,total_amount, rooms:rooms(name), centres:centres(city)")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);

  type AdminBookingRow = {
    id: string;
    date: string;
    start_time: string;
    status: "confirmed" | "cancelled";
    total_amount: number;
    rooms: { name: string } | { name: string }[] | null;
    centres: { city: string } | { city: string }[] | null;
    name?: string;
    company_name?: string | null;
  };

  const rows = (data ?? []) as unknown as AdminBookingRow[];

  return rows.map((b) => {
    const room = Array.isArray(b.rooms) ? b.rooms[0] : b.rooms;
    const centre = Array.isArray(b.centres) ? b.centres[0] : b.centres;
    return {
      id: b.id,
      date: b.date,
      startTime: b.start_time,
      status: b.status,
      totalAmount: b.total_amount,
      room: room ? { name: room.name } : null,
      user: { name: b.name ?? "", company: b.company_name ?? "" },
      location: centre ? { city: centre.city } : null,
    };
  });
}

export async function getAdminSummary() {
  const supabase = getSupabaseClient();
  const [roomsRes, centresRes, bookingsRes] = await Promise.all([
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase.from("centres").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("total_amount,status"),
  ]);

  if (roomsRes.error) throw new Error(roomsRes.error.message);
  if (centresRes.error) throw new Error(centresRes.error.message);
  if (bookingsRes.error) throw new Error(bookingsRes.error.message);

  const bookings = (bookingsRes.data ?? []) as Array<{ total_amount: number; status: "confirmed" | "cancelled" }>;
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const revenue = confirmed.reduce((sum, b) => sum + Number(b.total_amount ?? 0), 0);

  return {
    totalRooms: roomsRes.count ?? 0,
    totalLocations: centresRes.count ?? 0,
    totalBookings: bookings.length,
    confirmedBookings: confirmed.length,
    revenue,
    occupancyRate: 0,
  };
}
