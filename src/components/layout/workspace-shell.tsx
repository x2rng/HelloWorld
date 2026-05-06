import Link from "next/link";
import type { AppRole, ProfileRecord } from "@/lib/exp-types";
import { BadgePill } from "@/components/ui/badge-pill";
import { SignOutButton } from "@/components/auth/sign-out-button";

const navByRole: Record<AppRole, Array<{ href: string; label: string }>> = {
  ADMIN: [
    { href: "/admin", label: "Admin" },
    { href: "/admin/tracks", label: "Tracks" },
    { href: "/admin/employees", label: "Employees" },
    { href: "/admin/assignments", label: "Assignments" },
  ],
  EMPLOYEE: [
    { href: "/employee", label: "Employee" },
    { href: "/employee/onboarding", label: "Onboarding" },
  ],
};

export function WorkspaceShell({
  profile,
  title,
  subtitle,
  children,
}: {
  profile: ProfileRecord;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const navItems = navByRole[profile.role];

  return (
    <main className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="glass-panel sticky top-4 z-20 rounded-[32px] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white">
                  E
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    EXP
                  </p>
                  <h1 className="text-lg font-semibold">{title}</h1>
                </div>
              </Link>
              <BadgePill tone="blue">{profile.role}</BadgePill>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{profile.full_name ?? profile.email}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {profile.workspace?.name ?? "Workspace pending"}
                </p>
              </div>
              <SignOutButton />
            </div>
          </div>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{subtitle}</p>
        </header>

        {children}
      </div>
    </main>
  );
}
