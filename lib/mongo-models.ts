import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String },
    image: { type: String },
    provider: { type: String, enum: ["google", "credentials"], default: "credentials" },
    role: { type: String, enum: ["admin", "user"], required: true, default: "user" },
  },
  { versionKey: false },
);

const locationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    mapEmbedLabel: { type: String, required: true },
  },
  { versionKey: false },
);

const roomSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    locationId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Focus Room", "Meeting Room", "Boardroom"], required: true },
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    amenities: { type: [String], default: [] },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    availabilityScore: { type: Number, required: true },
    featured: { type: Boolean, default: false },
  },
  { versionKey: false },
);

const bookingSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    roomId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ["confirmed", "pending", "cancelled"], required: true },
    attendees: { type: Number, required: true },
    notes: { type: String },
    contactNumber: { type: String },
    totalAmount: { type: Number, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false },
);

const timeSlotSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    peakMultiplier: { type: Number, required: true },
  },
  { versionKey: false },
);

export const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema);
export const LocationModel = mongoose.models.Location ?? mongoose.model("Location", locationSchema);
export const RoomModel = mongoose.models.Room ?? mongoose.model("Room", roomSchema);
export const BookingModel = mongoose.models.Booking ?? mongoose.model("Booking", bookingSchema);
export const TimeSlotModel = mongoose.models.TimeSlot ?? mongoose.model("TimeSlot", timeSlotSchema);
