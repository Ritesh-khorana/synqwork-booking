import { bookings, locations, rooms, timeSlots, users } from "@/lib/data";
import { BookingModel, LocationModel, RoomModel, TimeSlotModel, UserModel } from "@/lib/mongo-models";

let seeded = false;

export async function ensureDatabaseSeeded() {
  if (seeded) {
    return;
  }

  // Keep Mongo in sync with the bundled "seed" dataset:
  // - Insert missing entities (by stable `id`)
  // - Never overwrite admin edits to locations/rooms/slots (Vercel cold starts would revert them)
  // - Never overwrite existing user role or existing bookings
  await Promise.all([
    UserModel.bulkWrite(
      users.map((user) => ({
        updateOne: {
          filter: { id: user.id },
          update: { $setOnInsert: user },
          upsert: true,
        },
      })),
      { ordered: false },
    ),
    LocationModel.bulkWrite(
      locations.map((location) => ({
        updateOne: {
          filter: { id: location.id },
          update: { $setOnInsert: location },
          upsert: true,
        },
      })),
      { ordered: false },
    ),
    RoomModel.bulkWrite(
      rooms.map((room) => ({
        updateOne: {
          filter: { id: room.id },
          update: { $setOnInsert: room },
          upsert: true,
        },
      })),
      { ordered: false },
    ),
    TimeSlotModel.bulkWrite(
      timeSlots.map((slot) => ({
        updateOne: {
          filter: { id: slot.id },
          update: { $setOnInsert: slot },
          upsert: true,
        },
      })),
      { ordered: false },
    ),
    BookingModel.bulkWrite(
      bookings.map((booking) => ({
        updateOne: {
          filter: { id: booking.id },
          update: { $setOnInsert: booking },
          upsert: true,
        },
      })),
      { ordered: false },
    ),
  ]);

  seeded = true;
}
