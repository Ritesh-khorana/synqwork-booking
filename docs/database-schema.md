# Database Schema

The app currently uses in-memory seed data, but the collections are designed for MongoDB or PostgreSQL-backed persistence.

## Users

```ts
{
  id: string;
  name: string;
  email: string;
  company: string;
  role: "admin" | "member";
}
```

## Locations

```ts
{
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  description: string;
  heroImage: string;
  mapEmbedLabel: string;
}
```

## Rooms

```ts
{
  id: string;
  locationId: string;
  name: string;
  slug: string;
  type: "Focus Room" | "Meeting Room" | "Boardroom";
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  image: string;
  rating: number;
  reviewCount: number;
  availabilityScore: number;
  featured?: boolean;
}
```

## TimeSlots

```ts
{
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  peakMultiplier: number;
}
```

## Bookings

```ts
{
  id: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  attendees: number;
  notes?: string;
  totalAmount: number;
  createdAt: string;
}
```

## Suggested Indexes

- `users.email`
- `locations.slug`
- `rooms.locationId`
- `rooms.slug`
- `bookings.roomId + bookings.date`
- `bookings.userId + bookings.createdAt`
