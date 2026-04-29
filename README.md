# Synq.work MVP

Synq.work is a premium meeting room booking platform built with Next.js, Tailwind CSS, and REST-style API routes. The MVP includes:

- Conversion-focused landing page
- Search and listing experience with filters
- Five-step booking flow with instant confirmation
- Admin console for rooms and bookings
- API routes and seeded sample data

## Tech Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS 4
- TypeScript
- MongoDB-ready service layer with automatic seed fallback

## Folder Structure

```text
app/
  admin/
  api/
    admin/
    availability/
    booking/
    rooms/
  auth/
  booking/
  confirmation/
  search/
components/
  ui/
lib/
docs/
```

## API Endpoints

- `GET /api/rooms`
- `GET /api/rooms/:id`
- `GET /api/availability`
- `POST /api/booking`
- `GET /api/admin/bookings`
- `GET /api/admin/rooms`
- `POST /api/admin/rooms`
- `PATCH /api/admin/rooms/:id`
- `DELETE /api/admin/rooms/:id`

## Persistence

- If `MONGODB_URI` is set, the app connects to MongoDB with Mongoose.
- On a fresh database, demo users, locations, rooms, slots, and bookings are auto-seeded on first access.
- If `MONGODB_URI` is not set, the app falls back to the bundled in-memory demo dataset.

## Google OAuth

Google OAuth is optional and not required for the booking workflow.

If you want to enable it later:
- Configure `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.
- Use this callback URL during local development:

```text
http://localhost:3000/api/auth/callback/google
```

- Google users are created automatically in MongoDB with role `user`.
- Admin access is restricted to users with role `admin`.
- Set `SYNQ_ADMIN_EMAILS` (comma-separated) to automatically grant admin on login and keep roles in sync.

## QR Flow

- Point your QR code at `http://localhost:3000/qr` to send anyone directly to the booking flow.
- You can also deep-link to a specific room with `http://localhost:3000/qr?roomId=room_4`

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Windows Portable Runtime

If your Windows PATH does not expose `node` or `npm`, use the bundled helper scripts:

```powershell
.\run-dev.ps1
.\run-build.ps1
.\run-start.ps1
```

## Notes

- Add `MONGODB_URI` and optionally `MONGODB_DB` in your environment to enable persistence.
- The app now supports both MongoDB persistence and an in-memory demo fallback.
- Confirmation and notification behavior are mocked for demo-readiness.
