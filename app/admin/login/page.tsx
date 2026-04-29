"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setError(data?.error ?? "Unable to sign in.");
      return;
    }

    router.replace(next);
  }

  return (
    <div className="section-shell grid min-h-[calc(100vh-120px)] place-items-center py-12">
      <div className="w-full max-w-md rounded-[34px] border border-black/8 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#404852]">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in to manage Synq.work</h1>
        <p className="mt-3 text-sm leading-6 text-[#404852]">
          This login protects the admin dashboard. Client booking remains open.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={submitting || !username || !password}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
