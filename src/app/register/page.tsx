"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RouteGate } from "@/components/auth/route-gate";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-provider";

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <RouteGate mode="guest">
      <AuthShell
        eyebrow="Start fresh"
        title="Create your LevelUp identity."
        description="This first step sets up the account. The next steps shape the profile, dashboard, and avatar around who you want to become."
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--color-blue)]">
              Log in
            </Link>
          </>
        }
      >
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="register-full-name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="register-full-name"
              required
              value={form.fullName}
              onChange={(event) => setForm((previous) => ({ ...previous, fullName: event.target.value }))}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="register-username"
              required
              value={form.username}
              onChange={(event) => setForm((previous) => ({ ...previous, username: event.target.value }))}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="register-email"
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="register-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="register-password"
              required
              minLength={6}
              type="password"
              value={form.password}
              onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
            />
          </div>
          {error ? <p className="sm:col-span-2 text-sm text-[var(--color-red)]">{error}</p> : null}
          <Button type="submit" size="lg" className="sm:col-span-2 w-full">
            Continue to onboarding
          </Button>
        </form>
      </AuthShell>
    </RouteGate>
  );
}
