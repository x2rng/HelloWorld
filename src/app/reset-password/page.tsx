import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure your account"
      title="Choose a new password."
      description="Set a new password for your EXP account. After the update, you can sign in again with your new credentials."
      footer={
        <>
          Need a fresh link?{" "}
          <Link
            href="/forgot-password"
            className="font-semibold text-[var(--color-blue)]"
          >
            Request another email
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
