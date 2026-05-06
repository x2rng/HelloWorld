"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    workspaceName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const redirectTo =
      typeof window === "undefined"
        ? `${getAppUrl()}/auth/callback?next=/auth/bootstrap`
        : `${window.location.origin}/auth/callback?next=/auth/bootstrap`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: form.fullName,
          workspace_name: form.workspaceName,
          role: "ADMIN",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/auth/bootstrap");
      router.refresh();
      return;
    }

    setSuccess(
      "Check your email to confirm the account. After confirmation, you will be signed into EXP.",
    );
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="register-full-name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="register-full-name"
          required
          value={form.fullName}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              fullName: event.target.value,
            }))
          }
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="register-workspace-name" className="text-sm font-medium">
          Workspace name
        </label>
        <input
          id="register-workspace-name"
          required
          value={form.workspaceName}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              workspaceName: event.target.value,
            }))
          }
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
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              email: event.target.value,
            }))
          }
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="register-password"
          required
          minLength={8}
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              password: event.target.value,
            }))
          }
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
      </div>
      {error ? <p className="sm:col-span-2 text-sm text-[var(--color-red)]">{error}</p> : null}
      {success ? (
        <div className="sm:col-span-2 rounded-3xl border border-[var(--color-green)]/20 bg-[var(--color-green-soft)] px-4 py-3 text-sm text-[var(--color-green)]">
          {success}{" "}
          <Link href="/login" className="font-semibold underline underline-offset-2">
            Return to sign in
          </Link>
          .
        </div>
      ) : null}
      <Button type="submit" size="lg" className="sm:col-span-2 w-full" disabled={loading}>
        {loading ? "Creating workspace..." : "Create workspace"}
      </Button>
    </form>
  );
}
