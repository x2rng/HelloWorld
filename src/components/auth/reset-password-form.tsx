"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callbackFailed = Boolean(searchParams.get("auth_error"));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your new password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match. Please enter them again.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      const missingSession =
        updateError.name === "AuthSessionMissingError" ||
        updateError.message.toLowerCase().includes("session");

      setError(
        missingSession
          ? "This reset link is invalid or has expired. Request a new link and try again."
          : updateError.message,
      );
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    window.location.assign("/login?password_reset=success");
  }

  if (callbackFailed) {
    return (
      <div className="space-y-4">
        <p
          role="alert"
          className="rounded-3xl border border-[var(--color-red)]/20 bg-red-50 px-4 py-4 text-sm leading-6 text-[var(--color-red)]"
        >
          This reset link is invalid or has expired. Request a new password reset
          email to continue.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex text-sm font-semibold text-[var(--color-blue)] underline underline-offset-2"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
        <p className="text-xs text-[var(--color-muted)]">Use at least 8 characters.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-new-password" className="text-sm font-medium">
          Confirm new password
        </label>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-[var(--color-red)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Updating password..." : "Update password"}
      </Button>
    </form>
  );
}
