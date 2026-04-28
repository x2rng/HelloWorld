"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RouteGate } from "@/components/auth/route-gate";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-provider";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <RouteGate mode="guest">
      <AuthShell
        eyebrow="Welcome back"
        title="Return to your growth dashboard."
        description="Log in to continue the version of yourself you are building."
        footer={
          <>
            New here?{" "}
            <Link href="/register" className="font-semibold text-[var(--color-blue)]">
              Create an account
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
            />
          </div>
          {error ? <p className="text-sm text-[var(--color-red)]">{error}</p> : null}
          <Button type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>
      </AuthShell>
    </RouteGate>
  );
}
