import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/exp-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <AuthShell
      eyebrow="Create workspace"
      title="Set up the first admin account for EXP."
      description="This phase creates the real authenticated admin and bootstraps the workspace/profile records that all future onboarding flows depend on."
      footer={
        <>
          Already have a workspace account?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-blue)]">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
