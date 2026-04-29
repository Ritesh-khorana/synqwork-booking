export type RoomType = "Focus Room" | "Meeting Room" | "Boardroom";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  image?: string;
  provider?: "google" | "credentials";
  role: "admin" | "user";
};

export type Location = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  description: string;
  heroImage: string;
  mapEmbedLabel: string;
};

export type Room = {
  id: string;
  locationId: string;
  name: string;
  slug: string;
  type: RoomType;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  image: string;
  rating: number;
  reviewCount: number;
  availabilityScore: number;
  featured?: boolean;
};

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  attendees: number;
  notes?: string;
  contactNumber?: string;
  totalAmount: number;
  createdAt: string;
};

export type TimeSlot = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  peakMultiplier: number;
};

export type SearchFilters = {
  location?: string;
  date?: string;
  slot?: string;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type AvailabilityResponse = {
  roomId: string;
  date: string;
  availableSlots: string[];
};
