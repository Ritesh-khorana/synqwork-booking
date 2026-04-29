import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type RoomCardProps = {
  room: {
    id: string;
    name: string;
    capacity: number;
    pricePerHour: number;
    image: string;
    rating: number;
    reviewCount: number;
    availabilityScore: number;
    amenities: string[];
    type: string;
    location?: {
      name: string;
      city: string;
    } | null;
  };
};

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
      <div className="relative h-60">
        <Image src={room.image} alt={room.name} fill className="object-cover" />
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full bg-[#FFDE59]/30 px-3 py-1 text-xs font-semibold text-black">
              {room.type}
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{room.name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#404852]">
              <MapPin className="h-4 w-4" />
              <span>{room.location?.name}, {room.location?.city}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-black px-3 py-2 text-center text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">From</p>
            <p className="font-[Montserrat] text-lg font-semibold">{formatCurrency(room.pricePerHour)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-[#404852]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f6f2] px-3 py-2">
            <Users className="h-4 w-4" />
            {room.capacity} seats
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f6f2] px-3 py-2">
            <Star className="h-4 w-4 fill-current text-[#FFDE59]" />
            {room.rating} ({room.reviewCount})
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f6f2] px-3 py-2">
            {room.availabilityScore}% available today
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {room.amenities.map((amenity) => (
            <span key={amenity} className="rounded-full border border-black/8 px-3 py-2 text-xs text-[#404852]">
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href={`/booking?roomId=${room.id}`} className="flex-1">
            <Button className="w-full">Book Now</Button>
          </Link>
          <Link href={`/search?roomId=${room.id}`} className="flex-1">
            <Button variant="ghost" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
