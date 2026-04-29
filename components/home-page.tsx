import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarRange, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { RoomCard } from "@/components/room-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { locations, rooms } from "@/lib/data";

const testimonials = [
  {
    quote: "The booking flow feels instantly familiar, but much more polished for enterprise buyers.",
    name: "Nisha Kapoor",
    role: "Workplace Lead, Northstar Labs",
  },
  {
    quote: "We closed three client workshops in one week because the experience from search to confirmation was frictionless.",
    name: "Rohan Sen",
    role: "Founder, PitchDock",
  },
  {
    quote: "The premium feel matters. Synq.work makes the room experience look as credible as our brand.",
    name: "Aditi Rao",
    role: "Operations Head, AltLedger",
  },
];

const roomTypes = [
  { name: "4 Seater", label: "Quick syncs", desc: "Fast, private spaces for 1:1s, standups, and focused client calls." },
  { name: "8 Seater", label: "Team rituals", desc: "Balanced spaces for sprint planning, product reviews, and hiring panels." },
  { name: "Boardroom", label: "High stakes", desc: "Investor-grade rooms with premium AV, service, and acoustic privacy." },
];

const steps = [
  {
    title: "Search your city",
    desc: "Discover premium spaces by location, date, budget, and capacity with availability-first results.",
    icon: MapPin,
  },
  {
    title: "Choose the best slot",
    desc: "BookMyShow-inspired flow keeps decisions progressive: date, time, room, details, then confirmation.",
    icon: CalendarRange,
  },
  {
    title: "Confirm instantly",
    desc: "Receive a clean confirmation summary and email-ready booking details.",
    icon: ShieldCheck,
  },
];

export function HomePage() {
  const featuredRooms = rooms.filter((room) => room.featured).map((room) => ({
    ...room,
    location: locations.find((location) => location.id === room.locationId) ?? null,
  }));

  return (
    <div>
      <section className="section-shell relative py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm text-[#404852]">
              <Sparkles className="h-4 w-4 text-[#FFDE59]" />
              Investor-ready premium workspace booking
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
              Book Meeting Rooms Instantly
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#404852]">
              Synq.work helps teams find, compare, and confirm high-trust meeting spaces across premium business
              districts with a booking flow built for speed and confidence.
            </p>
            <HeroSearch />
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#404852]">
              <span>Real-time availability</span>
              <span>Flexible pricing</span>
              <span>Instant confirmations</span>
            </div>
          </div>

          <div className="mesh-surface relative overflow-hidden rounded-[36px] border border-black/8 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
            <div className="absolute right-6 top-6 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#FFDE59]">
              Premium inventory
            </div>
            <div className="relative h-[560px] overflow-hidden rounded-[28px]">
              <Image
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                alt="Premium meeting room"
                fill
                className="object-cover"
              />
            </div>
            <div className="glass-panel absolute bottom-8 left-8 max-w-sm rounded-[28px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#404852]">This week&apos;s best seller</p>
              <h3 className="mt-3 text-2xl font-semibold">Atlas Boardroom</h3>
              <p className="mt-2 text-sm leading-6 text-[#404852]">
                Investor-facing, service-backed, and bookable in under a minute.
              </p>
              <Link href="/booking?roomId=room_4" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Start booking <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <SectionHeading
          eyebrow="Featured Locations"
          title="Business districts where teams actually want to meet."
          description="Inspired by workspace leaders, designed with higher trust, faster conversion, and clearer room differentiation."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {locations.map((location) => (
            <div key={location.id} className="overflow-hidden rounded-[30px] border border-black/8 bg-white">
              <div className="relative h-56">
                <Image src={location.heroImage} alt={location.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-[#404852]">{location.city}</p>
                <h3 className="mt-2 text-2xl font-semibold">{location.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#404852]">{location.description}</p>
                <p className="mt-4 text-sm text-black">{location.address}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <div className="rounded-[38px] bg-black px-6 py-10 text-white md:px-10 md:py-14">
          <SectionHeading
            eyebrow="Room Types"
            title="Designed for focus, collaboration, and board-level moments."
            description="The product deliberately separates use-cases so teams understand value quickly and convert with less hesitation."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {roomTypes.map((type) => (
              <div key={type.name} className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#FFDE59]">{type.label}</p>
                <h3 className="mt-3 text-3xl font-semibold">{type.name}</h3>
                <p className="mt-4 text-sm leading-7 text-white/75">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <SectionHeading
          eyebrow="Featured Inventory"
          title="Rooms that balance premium perception with booking speed."
          description="Fast-loading cards, clear price anchors, and explicit availability cues lift confidence before checkout."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <SectionHeading
          eyebrow="How It Works"
          title="A progressive booking flow that reduces drop-off."
          description="Borrow the best mental model from ticketing and workspace platforms, then tailor it to enterprise room booking."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel rounded-[28px] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDE59] text-black">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#404852]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-20">
        <SectionHeading
          eyebrow="Testimonials"
          title="Built to feel credible to founders, operators, and enterprise buyers."
          description="The visual direction stays minimal and premium while the product language stays practical and conversion-led."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
              <p className="text-lg leading-8 text-[#404852]">&quot;{item.quote}&quot;</p>
              <div className="mt-8">
                <p className="font-[Montserrat] text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-[#404852]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 pb-20 md:py-20 md:pb-24">
        <div className="mesh-surface rounded-[38px] border border-black/8 px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#404852]">Launch Synced Spaces</p>
              <h2 className="mt-4 text-4xl font-semibold text-balance md:text-5xl">
                Ready to host Synq.work as your meeting room sales engine?
              </h2>
            </div>
            <Link href="/search">
              <Button className="min-w-44">Explore Rooms</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

