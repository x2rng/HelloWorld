"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarRenderer } from "@/components/avatar/avatar-renderer";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/achievements", label: "Achievements" },
];

export function AppFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, derived, logout } = useApp();

  if (!currentUser || !derived) return null;

  return (
    <main className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="glass-panel sticky top-4 z-20 rounded-[32px] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white">L</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">LevelUp</p>
                  <h1 className="text-lg font-semibold">{title}</h1>
                </div>
              </Link>
              <BadgePill tone="blue">Level {derived.level.level}</BadgePill>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "rounded-full px-4 py-2 text-sm font-medium",
                    pathname === item.href ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{currentUser.account.fullName}</p>
                <p className="text-sm text-[var(--color-muted)]">@{currentUser.account.username}</p>
              </div>
              <AvatarRenderer avatar={currentUser.avatar!} size={74} className="rounded-[22px] p-3" />
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{subtitle}</p>
        </header>

        {children}
      </div>
    </main>
  );
}
