"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function InviteAuthForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    if (mode === "signup") {
      const redirectTo = `${window.location.origin}/auth/callback?next=/invite/${token}/accept`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            role: "EMPLOYEE",
            invite_token: token,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.replace(`/invite/${token}/accept?name=${encodeURIComponent(fullName)}`);
        router.refresh();
        return;
      }

      setMessage("Check your email to confirm the account, then EXP will finish joining the workspace.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace(`/invite/${token}/accept`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex rounded-full border border-black/8 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={
            mode === "signup"
              ? "h-10 flex-1 rounded-full bg-[var(--color-ink)] text-sm font-medium text-white"
              : "h-10 flex-1 rounded-full text-sm font-medium text-[var(--color-muted)]"
          }
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={
            mode === "login"
              ? "h-10 flex-1 rounded-full bg-[var(--color-ink)] text-sm font-medium text-white"
              : "h-10 flex-1 rounded-full text-sm font-medium text-[var(--color-muted)]"
          }
        >
          Log in
        </button>
      </div>

      {mode === "signup" ? (
        <div className="space-y-2">
          <label htmlFor="invite-full-name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="invite-full-name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="invite-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="invite-email"
          readOnly
          value={email}
          className="h-12 w-full rounded-2xl border border-black/8 bg-black/[0.03] px-4 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="invite-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="invite-password"
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
      </div>

      {error ? <p className="text-sm text-[var(--color-red)]">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--color-green)]">{message}</p> : null}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Continuing..." : mode === "signup" ? "Create account" : "Log in and accept"}
      </Button>
    </form>
  );
}
