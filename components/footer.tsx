import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/80">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-[Montserrat] text-2xl font-semibold">Synq.work</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#404852]">
            Premium workspace booking for teams that need polished meeting rooms, boardrooms, and collaboration spaces
            on demand.
          </p>
        </div>
        <div>
          <p className="font-[Montserrat] text-sm font-semibold uppercase tracking-[0.2em] text-[#404852]">
            Platform
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#404852]">
            <Link href="/search">Search Rooms</Link>
            <Link href="/booking">Booking Flow</Link>
            <Link href="/admin">Admin Panel</Link>
          </div>
        </div>
        <div>
          <p className="font-[Montserrat] text-sm font-semibold uppercase tracking-[0.2em] text-[#404852]">
            Contact
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#404852]">
            <span>hello@synqwork.com</span>
            <span>+91 98765 43210</span>
            <span>India-wide premium meeting spaces</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
