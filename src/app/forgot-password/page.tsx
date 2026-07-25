import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password."
      description="Enter the email connected to your EXP account and we will send you a secure reset link."
      footer={
        <>
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-blue)]">
            Return to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
