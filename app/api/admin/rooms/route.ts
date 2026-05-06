import { NextResponse } from "next/server";
import { createRoom, listAdminRooms } from "@/lib/supabase-service";
import { getSupabaseClient } from "@/lib/supabase";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET() {
  try {
    return NextResponse.json({ rooms: await listAdminRooms() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load rooms" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const payload = await request.json();
  try {
    let centreId = (payload.locationId ?? payload.centreId) as string | undefined;
    if (!centreId) {
      return NextResponse.json({ error: "Location is required." }, { status: 400 });
    }

    if (!isUuid(centreId)) {
      const fallbackName = (payload.centreName as string | undefined)?.trim();
      const fallbackCity = (payload.city as string | undefined)?.trim();
      if (!fallbackName || !fallbackCity) {
        return NextResponse.json({ error: "Invalid location selected. Missing centre details." }, { status: 400 });
      }
      const supabase = getSupabaseClient();
      const { data: existing, error: existingError } = await supabase
        .from("centres")
        .select("id")
        .eq("name", fallbackName)
        .eq("city", fallbackCity)
        .limit(1)
        .maybeSingle();
      if (existingError) throw new Error(existingError.message);

      if (existing?.id) {
        centreId = existing.id as string;
      } else {
        const { data: createdRows, error: createCentreError } = await supabase
          .from("centres")
          .insert([{ name: fallbackName, city: fallbackCity, address: `${fallbackName}, ${fallbackCity}` }])
          .select("id");
        if (createCentreError) throw new Error(createCentreError.message);
        const created = Array.isArray(createdRows) ? createdRows[0] : createdRows;
        if (!created?.id) throw new Error("Unable to resolve centre for selected location.");
        centreId = created.id as string;
      }
    }

    const room = await createRoom({
      centreId,
      name: payload.name,
      capacity: Number(payload.capacity),
      pricePerHour: Number(payload.pricePerHour),
      imageUrl: payload.image ?? payload.imageUrl ?? null,
      description: Array.isArray(payload.amenities) ? payload.amenities.join(", ") : payload.description ?? null,
      isActive: true,
    });
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create room" },
      { status: 400 },
    );
  }
}
