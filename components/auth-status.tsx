"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-24 animate-pulse rounded-full bg-black/5" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth"
        className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[#404852]"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-3 rounded-full border border-black/10 bg-white/80 px-3 py-2 md:flex">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
            {(session.user.name ?? "U").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="text-left">
          <p className="text-sm font-medium leading-none">{session.user.name ?? "Synq user"}</p>
          <p className="mt-1 text-xs text-[#404852]">{session.user.role}</p>
        </div>
      </div>
      <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign Out
      </Button>
    </div>
  );
}
