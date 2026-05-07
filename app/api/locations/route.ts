import { NextResponse } from "next/server";
import { listCentres } from "@/lib/supabase-service";

export async function GET() {
  try {
    const centres = await listCentres();
    const required = [
      { name: "Aloft Aerocity", city: "Delhi", address: "Aloft Aerocity, Delhi" },
      { name: "SAS Towers", city: "Gurgaon", address: "SAS Towers, Sector-38, Gurgaon" },
      { name: "DLF Cyber Greens", city: "Gurgaon", address: "DLF Cyber Greens, DLF Cyber City, Gurgaon" },
      { name: "GSC Towers", city: "Gurgaon", address: "GSC Towers, Sector-30, South City-1, Gurgaon" },
      { name: "Noida Centre", city: "Noida", address: "Noida" },
      { name: "Mumbai Centre", city: "Mumbai", address: "Mumbai" },
      { name: "Chennai Centre", city: "Chennai", address: "Chennai" },
    ];
    const merged = [...centres];
    for (const r of required) {
      if (!merged.find((c) => c.name === r.name && c.city === r.city)) {
        merged.push({
          id: `virtual-${r.name.toLowerCase().replaceAll(" ", "-")}`,
          name: r.name,
          city: r.city,
          address: r.address,
          google_map_link: null,
          created_at: new Date().toISOString(),
        });
      }
    }
    const locations = merged.map((c) => ({
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
