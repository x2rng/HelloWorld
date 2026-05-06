import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/exp-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace."
      description="Use your real EXP account to enter the admin or employee experience attached to your workspace."
      footer={
        <>
          Need an admin workspace?{" "}
          <Link href="/register" className="font-semibold text-[var(--color-blue)]">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
