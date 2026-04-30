"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Find Meeting Rooms" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="section-shell flex items-center gap-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="https://synqwork.com/wp-content/uploads/2026/04/Synq-work-logo-hq-e1774606827316.png"
            alt="Synq.work"
            width={160}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="ml-auto hidden items-center justify-end gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-[#404852] transition hover:text-black"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/booking"
            className="whitespace-nowrap rounded-full bg-[#FFDE59] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#FCDE59]"
          >
            Book Now
          </Link>
        </nav>

        <button
          className="ml-auto rounded-full border border-black/10 p-3 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("section-shell pb-4 md:hidden", open ? "block" : "hidden")}>
        <div className="glass-panel rounded-3xl p-4">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="rounded-full bg-[#FFDE59] px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-[#FCDE59]"
              onClick={() => setOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
Message Md Zunaid
