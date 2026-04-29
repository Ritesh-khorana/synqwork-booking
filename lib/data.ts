import { addDays, format } from "date-fns";
import type { Booking, Location, Room, TimeSlot, User } from "@/lib/types";

const today = new Date();

export const users: User[] = [
  {
    id: "user_1",
    name: "Aarav Mehta",
    email: "aarav@synqwork.com",
    company: "Synq Ventures",
    provider: "credentials",
    role: "admin",
  },
  {
    id: "user_2",
    name: "Ananya Shah",
    email: "ananya@launchpad.in",
    company: "Launchpad",
    provider: "credentials",
    role: "user",
  },
];

export const locations: Location[] = [
  {
    id: "loc_1",
    slug: "gurugram-cyber-greens",
    name: "Cyber Greens",
    city: "Gurugram",
    address: "DLF Cyber Greens, DLF Cyber City, Gurugram",
    description: "Premium Meeting Rooms in DLF Cyber Greens, Near DLF Cyber Hub.",
    heroImage:"import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "synqwork.com" },
      { protocol: "https", hostname: "www.synqwork.com" },
    ],
  },
};

export default nextConfig;",
    mapEmbedLabel: "Cyber Greens Gurugram",
  },
  {
    id: "loc_2",
    slug: "new-delhi-gsc",
    name: "GSC",
    city: "Gurgaon",
    address: "South City-1, Gurgaon",
    description: "Executive meeting rooms designed for investor calls, pitches, and client reviews.",
    heroImage:"https://synqwork.com/wp-content/uploads/2026/04/managed-office-and-private-office-suit-at-GSC-Towers-Gurgaon-by-synqwork-scaled-e1775822954507.jpg",
    mapEmbedLabel: "Gurgaon",
  },
  {
    id: "loc_3",
    slug: "noida-sas-tower",
    name: "SAS Tower",
    city: "Gurgaon",
    address: "Sector 38, Gurgaon",
    description: "Modern meeting rooms for fast-moving teams and vendor sessions.",
    heroImage:
      "https://synqwork.com/wp-content/uploads/2026/04/SAS-towers-managed-office-space-in-gurgaon-by-synqwork.png",
    mapEmbedLabel: "SAS Tower Gurgaon",
  },
  {
    id: "loc_4",
    slug: "chennai-aloft",
    name: "Aloft Aerocity",
    city: "Delhi",
    address: "Aloft, Aerocity, Delhi",
    description: "Premium hotel-grade meeting rooms for workshops, leadership syncs, and client visits.",
    heroImage:
      "https://synqwork.com/wp-content/uploads/2026/04/aloft-aerocity-managed-office-and-meeting-roon-in-aerocity-by-synqwork.webp",
    mapEmbedLabel: "Aloft Delhi",
  },
];

export const rooms: Room[] = [
  {
    id: "room_1",
    locationId: "loc_1",
    name: "Orbit 4",
    slug: "orbit-4",
    type: "Focus Room",
    capacity: 4,
    pricePerHour: 900,
    amenities: ["4K Display", "Video Conferencing", "High-Speed WiFi"],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    reviewCount: 126,
    availabilityScore: 88,
    featured: true,
  },
  {
    id: "room_2",
    locationId: "loc_1",
    name: "Halo 8",
    slug: "halo-8",
    type: "Meeting Room",
    capacity: 8,
    pricePerHour: 1600,
    amenities: ["Whiteboard", "Conference Cam", "Coffee Service"],
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 93,
    availabilityScore: 72,
    featured: true,
  },
  {
    id: "room_3",
    locationId: "loc_2",
    name: "Sprint Lab",
    slug: "sprint-lab",
    type: "Meeting Room",
    capacity: 8,
    pricePerHour: 1400,
    amenities: ["Workshop Wall", "Screen Casting", "Snacks"],
    image:
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    reviewCount: 64,
    availabilityScore: 81,
  },
  {
    id: "room_4",
    locationId: "loc_3",
    name: "Atlas Boardroom",
    slug: "atlas-boardroom",
    type: "Boardroom",
    capacity: 14,
    pricePerHour: 3200,
    amenities: ["Concierge", "65-inch Screen", "Private Pantry"],
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 151,
    availabilityScore: 68,
    featured: true,
  },
  {
    id: "room_5",
    locationId: "loc_4",
    name: "Canvas 6",
    slug: "canvas-6",
    type: "Meeting Room",
    capacity: 6,
    pricePerHour: 1200,
    amenities: ["Natural Light", "Zoom Setup", "Soundproofing"],
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    reviewCount: 48,
    availabilityScore: 84,
  },
  {
    id: "room_6",
    locationId: "loc_3",
    name: "Meridian 10",
    slug: "meridian-10",
    type: "Boardroom",
    capacity: 10,
    pricePerHour: 2600,
    amenities: ["Dual Displays", "AC Controls", "Tea & Coffee"],
    image:
      "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 72,
    availabilityScore: 77,
  },
  {
    id: "room_7",
    locationId: "loc_2",
    name: "CP Studio 6",
    slug: "cp-studio-6",
    type: "Meeting Room",
    capacity: 6,
    pricePerHour: 1500,
    amenities: ["55-inch Display", "Video Conferencing", "Coffee & Tea"],
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    reviewCount: 58,
    availabilityScore: 82,
    featured: true,
  },
  {
    id: "room_8",
    locationId: "loc_3",
    name: "Noida Focus 4",
    slug: "noida-focus-4",
    type: "Focus Room",
    capacity: 4,
    pricePerHour: 950,
    amenities: ["Soundproofing", "High-Speed WiFi", "Screen Casting"],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    reviewCount: 41,
    availabilityScore: 86,
  },
  {
    id: "room_9",
    locationId: "loc_4",
    name: "Chennai Boardroom 12",
    slug: "chennai-boardroom-12",
    type: "Boardroom",
    capacity: 12,
    pricePerHour: 2800,
    amenities: ["Concierge", "65-inch Screen", "Whiteboard Wall"],
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 66,
    availabilityScore: 74,
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "slot_1", label: "09:00 - 10:00", startTime: "09:00", endTime: "10:00", peakMultiplier: 1 },
  { id: "slot_2", label: "10:00 - 11:00", startTime: "10:00", endTime: "11:00", peakMultiplier: 1.1 },
  { id: "slot_3", label: "11:00 - 12:00", startTime: "11:00", endTime: "12:00", peakMultiplier: 1.1 },
  { id: "slot_4", label: "12:00 - 13:00", startTime: "12:00", endTime: "13:00", peakMultiplier: 1 },
  { id: "slot_5", label: "14:00 - 15:00", startTime: "14:00", endTime: "15:00", peakMultiplier: 1.15 },
  { id: "slot_6", label: "15:00 - 16:00", startTime: "15:00", endTime: "16:00", peakMultiplier: 1.1 },
  { id: "slot_7", label: "16:00 - 17:00", startTime: "16:00", endTime: "17:00", peakMultiplier: 1 },
  { id: "slot_8", label: "17:00 - 18:00", startTime: "17:00", endTime: "18:00", peakMultiplier: 0.95 },
];

export const bookings: Booking[] = [
  {
    id: "booking_1",
    userId: "user_2",
    roomId: "room_2",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    attendees: 6,
    notes: "Quarterly planning session",
    totalAmount: 1760,
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking_2",
    userId: "user_2",
    roomId: "room_4",
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    startTime: "15:00",
    endTime: "16:00",
    status: "confirmed",
    attendees: 10,
    notes: "Investor meeting",
    totalAmount: 3520,
    createdAt: new Date().toISOString(),
  },
];
