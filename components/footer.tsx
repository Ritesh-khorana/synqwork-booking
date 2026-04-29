import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/80">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-[Montserrat] text-2xl font-semibold">SynqWork</p>
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
          </div>
        </div>
        <div>
          <p className="font-[Montserrat] text-sm font-semibold uppercase tracking-[0.2em] text-[#404852]">
            Contact
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#404852]">
  <a href="mailto:info@synq.work" className="hover:underline">
    info@synq.work
  </a>
  <a href="tel:+918700128721" className="hover:underline">
    +91-8700128721
  </a>
  <span>Book Meeting Room in Delhi, Gurgaon and Noida</span>
</div>
        </div>
      </div>
    </footer>
  );
}
