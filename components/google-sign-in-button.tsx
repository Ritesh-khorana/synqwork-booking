"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/google-icon";

export function GoogleSignInButton({ className = "" }: { className?: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/search";
  const enabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED);

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      disabled={!enabled}
      className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black transition hover:border-black/20 hover:bg-[#f8f8f6] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}
