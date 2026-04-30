import { format } from "date-fns";
import { bookings, locations, rooms, timeSlots, users } from "@/lib/data";
import { ensureDatabaseSeeded } from "@/lib/database-seed";
import { BookingModel, LocationModel, RoomModel, TimeSlotModel, UserModel } from "@/lib/mongo-models";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import type { AvailabilityResponse, Booking, Location, Room, SearchFilters, TimeSlot, User } from "@/lib/types";

type CreateBookingInput = {
  userId?: string;
  roomId: string;
  date: string;
  slotId: string;
  name: string;
  email: string;
  contactNumber: string;
  company: string;
  attendees: number;
  notes?: string;
};

type RoomWithLocation = Room & { location?: Location | null };
type AvailabilitySnapshot = AvailabilityResponse & { roomName: string; locationId: string };

function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function bootstrapDatabase() {
  if (!isDatabaseConfigured()) {
    return false;
  }

  await connectToDatabase();
  await ensureDatabaseSeeded();
  return true;
}

async function getAllLocations(): Promise<Location[]> {
  if (!(await bootstrapDatabase())) {
    return locations;
  }

  return plain(await LocationModel.find().lean()) as unknown as Location[];
}

async function getAllRooms(): Promise<Room[]> {
  if (!(await bootstrapDatabase())) {
    return rooms;
  }

  return plain(await RoomModel.find().lean()) as unknown as Room[];
}

async function getAllBookings(): Promise<Booking[]> {
  if (!(await bootstrapDatabase())) {
    return bookings;
  }

  return plain(await BookingModel.find().lean()) as unknown as Booking[];
}

async function getAllUsers(): Promise<User[]> {
  if (!(await bootstrapDatabase())) {
    return users;
  }

  return plain(await UserModel.find().lean()) as unknown as User[];
}

export async function getLocations() {
  return getAllLocations();
}

export async function getTimeSlots(): Promise<TimeSlot[]> {
  if (!(await bootstrapDatabase())) {
    return timeSlots;
  }

  return plain(await TimeSlotModel.find().lean()) as unknown as TimeSlot[];
}

function matchesRoomFilters(room: RoomWithLocation, filters: SearchFilters) {
  if (filters.location && room.location?.city.toLowerCase() !== filters.location.toLowerCase()) return false;
  if (filters.capacity && room.capacity < filters.capacity) return false;
  if (filters.minPrice && room.pricePerHour < filters.minPrice) return false;
  if (filters.maxPrice && room.pricePerHour > filters.maxPrice) return false;
  return true;
}

export async function listRooms(filters: SearchFilters = {}) {
  const [roomList, locationList] = await Promise.all([getAllRooms(), getAllLocations()]);
  const locationMap = new Map(locationList.map((location) => [location.id, location]));
  const roomCards = roomList.map((room) => ({
    ...room,
    location: locationMap.get(room.locationId) ?? null,
  }));

  if (!filters.date || !filters.slot) {
    return roomCards.filter((room) => matchesRoomFilters(room, filters));
  }

  const availabilityList = await Promise.all(roomCards.map((room) => getAvailabilityForRoom(room.id, filters.date)));
  const availabilityMap = new Map(availabilityList.map((item) => [item.roomId, item.availableSlots]));

  return roomCards.filter(
    (room) =>
      matchesRoomFilters(room, filters) &&
      (availabilityMap.get(room.id) ?? []).includes(filters.slot as string),
  );
}

export async function getRoomById(id: string) {
  const [roomList, locationList] = await Promise.all([getAllRooms(), getAllLocations()]);
  const room = roomList.find((item) => item.id === id);
  if (!room) return null;

  return {
    ...room,
    location: locationList.find((location) => location.id === room.locationId) ?? null,
  };
}

export async function getAvailabilityForRoom(
  roomId: string,
  date = format(new Date(), "yyyy-MM-dd"),
): Promise<AvailabilityResponse> {
  const [bookingList, slotList] = await Promise.all([getAllBookings(), getTimeSlots()]);
  const reservedSlots = bookingList
    .filter((booking) => booking.roomId === roomId && booking.date === date && booking.status !== "cancelled")
    .map((booking) => `${booking.startTime}-${booking.endTime}`);

  const availableSlots = slotList
    .filter((slot) => !reservedSlots.includes(`${slot.startTime}-${slot.endTime}`))
    .map((slot) => slot.id);

  return {
    roomId,
    date,
    availableSlots,
  };
}

export async function getAvailabilitySnapshot(date: string): Promise<AvailabilitySnapshot[]> {
  const roomList = await getAllRooms();
  return Promise.all(
    roomList.map(async (room) => ({
      ...(await getAvailabilityForRoom(room.id, date)),
      roomName: room.name,
      locationId: room.locationId,
    })),
  );
}

export async function getSlotById(slotId: string): Promise<TimeSlot | undefined> {
  const slotList = await getTimeSlots();
  return slotList.find((slot) => slot.id === slotId);
}

async function generateNextId(prefix: string, ids: string[]) {
  const used = new Set(
    ids
      .map((value) => Number(value.replace(`${prefix}_`, "")))
      .filter((value) => Number.isFinite(value)),
  );
  let candidate = used.size + 1;

  while (used.has(candidate)) {
    candidate += 1;
  }

  return `${prefix}_${candidate}`;
}

export async function createBooking(input: CreateBookingInput) {
  const [roomList, locationList, userList, bookingList] = await Promise.all([
    getAllRooms(),
    getAllLocations(),
    getAllUsers(),
    getAllBookings(),
  ]);

  // Prevent back-date bookings (compare yyyy-MM-dd strings).
  const today = format(new Date(), "yyyy-MM-dd");
  if (input.date < today) {
    throw new Error("Bookings cannot be made for past dates. Please choose today or a future date.");
  }

  const room = roomList.find((item) => item.id === input.roomId);
  if (!room) {
    throw new Error("Room not found.");
  }

  const slot = await getSlotById(input.slotId);
  if (!slot) {
    throw new Error("Time slot not found.");
  }

  const availability = await getAvailabilityForRoom(input.roomId, input.date);
  if (!availability.availableSlots.includes(input.slotId)) {
    throw new Error("Selected slot is no longer available.");
  }

  const existingUser = userList.find((user) => user.email === input.email);
  const customer =
    existingUser ??
    ({
      id: await generateNextId("user", userList.map((user) => user.id)),
      name: input.name,
      email: input.email,
      phone: input.contactNumber,
      company: input.company,
      provider: "credentials",
      role: "user",
    } satisfies User);

  const booking: Booking = {
    id: await generateNextId("booking", bookingList.map((item) => item.id)),
    userId: customer.id,
    roomId: room.id,
    date: input.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "confirmed",
    attendees: input.attendees,
    notes: input.notes,
    contactNumber: input.contactNumber,
    totalAmount: Math.round(room.pricePerHour * slot.peakMultiplier),
    createdAt: new Date().toISOString(),
  };

  if (await bootstrapDatabase()) {
    if (!existingUser) {
      await UserModel.create(customer);
    }
    await BookingModel.create(booking);
  } else {
    if (!existingUser) users.push(customer);
    bookings.push(booking);
  }

  return {
    booking,
    user: customer,
    room,
    location: locationList.find((location) => location.id === room.locationId) ?? null,
    slot,
  };
}

export async function getAdminSummary() {
  const [roomList, locationList, bookingList, slotList] = await Promise.all([
    getAllRooms(),
    getAllLocations(),
    getAllBookings(),
    getTimeSlots(),
  ]);
  const confirmedBookings = bookingList.filter((booking) => booking.status === "confirmed");
  const revenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const occupancyBase = roomList.length * slotList.length || 1;

  return {
    totalRooms: roomList.length,
    totalLocations: locationList.length,
    totalBookings: bookingList.length,
    confirmedBookings: confirmedBookings.length,
    revenue,
    occupancyRate: Math.min(100, Math.round((confirmedBookings.length / occupancyBase) * 100)),
  };
}

export async function getAdminBookings() {
  const [bookingList, roomList, userList, locationList] = await Promise.all([
    getAllBookings(),
    getAllRooms(),
    getAllUsers(),
    getAllLocations(),
  ]);

  return bookingList.map((booking) => {
    const room = roomList.find((item) => item.id === booking.roomId) ?? null;
    const user = userList.find((item) => item.id === booking.userId) ?? null;
    const location = locationList.find((item) => item.id === room?.locationId) ?? null;
    return {
      ...booking,
      room,
      user,
      location,
    };
  });
}

export async function createRoom(input: Omit<Room, "id">) {
  const roomList = await getAllRooms();
  const room = {
    ...input,
    id: await generateNextId("room", roomList.map((item) => item.id)),
  };

  if (await bootstrapDatabase()) {
    await RoomModel.create(room);
  } else {
    rooms.push(room);
  }

  return room;
}

export async function updateRoom(id: string, input: Partial<Omit<Room, "id">>) {
  if (await bootstrapDatabase()) {
    const room = await RoomModel.findOneAndUpdate({ id }, input, { new: true }).lean();
    if (!room) {
      throw new Error("Room not found.");
    }

    return plain(room) as unknown as Room;
  }

  const roomIndex = rooms.findIndex((room) => room.id === id);
  if (roomIndex === -1) {
    throw new Error("Room not found.");
  }

  rooms[roomIndex] = {
    ...rooms[roomIndex],
    ...input,
  };

  return rooms[roomIndex];
}

export async function deleteRoom(id: string) {
  if (await bootstrapDatabase()) {
    const room = await RoomModel.findOneAndDelete({ id }).lean();
    if (!room) {
      throw new Error("Room not found.");
    }

    await BookingModel.deleteMany({ roomId: id });
    return plain(room) as unknown as Room;
  }

  const roomIndex = rooms.findIndex((room) => room.id === id);
  if (roomIndex === -1) {
    throw new Error("Room not found.");
  }

  const [removed] = rooms.splice(roomIndex, 1);
  for (let index = bookings.length - 1; index >= 0; index -= 1) {
    if (bookings[index].roomId === id) {
      bookings.splice(index, 1);
    }
  }

  return removed;
}
