"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const appUrl =
      typeof window === "undefined" ? getAppUrl() : window.location.origin;
    const redirectTo = `${appUrl}/auth/callback?next=/reset-password`;
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo },
    );

    if (resetError) {
      setError(
        resetError.status === 429
          ? "Too many reset requests were made. Please wait a moment and try again."
          : "We could not send the reset email. Please check the address and try again.",
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-[var(--color-green)]/20 bg-[var(--color-green-soft)] px-4 py-4 text-sm leading-6 text-[var(--color-green)]"
      >
        If an EXP account exists for <strong>{email.trim()}</strong>, a password
        reset link is on its way. Check your inbox and spam folder. You can then{" "}
        <Link href="/login" className="font-semibold underline underline-offset-2">
          return to sign in
        </Link>
        .
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="recovery-email" className="text-sm font-medium">
          Work email
        </label>
        <input
          id="recovery-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-[var(--color-red)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Sending reset link..." : "Send reset link"}
      </Button>
    </form>
  );
}
