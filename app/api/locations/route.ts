import { NextResponse } from "next/server";
import { listCentres } from "@/lib/supabase-service";

export async function GET() {
  try {
    const centres = await listCentres();
    const locations = centres.map((c) => ({
      id: c.id,
      name: c.name,
      city: c.city,
      address: c.address,
      slug: c.name.toLowerCase().replaceAll(" ", "-"),
      description: "",
      heroImage: "",
      mapEmbedLabel: "",
    }));
    return NextResponse.json({ locations });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load locations" },
      { status: 500 },
    );
  }
}
