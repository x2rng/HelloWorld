"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { ProfileRecord } from "@/lib/exp-types";
import { cx } from "@/lib/utils";

type Destination = {
  href: string;
  label: string;
  icon: "home" | "journey" | "skills" | "feed" | "player";
  matches: (pathname: string) => boolean;
};

const destinations: Destination[] = [
  {
    href: "/employee",
    label: "Home",
    icon: "home",
    matches: (pathname) => pathname === "/employee",
  },
  {
    href: "/employee/onboarding",
    label: "Journey",
    icon: "journey",
    matches: (pathname) => pathname.startsWith("/employee/onboarding"),
  },
  {
    href: "/employee/skills",
    label: "Skills",
    icon: "skills",
    matches: (pathname) => pathname.startsWith("/employee/skills"),
  },
  {
    href: "/employee/feed",
    label: "Feed",
    icon: "feed",
    matches: (pathname) =>
      pathname.startsWith("/employee/feed") ||
      pathname.startsWith("/employee/activities"),
  },
  {
    href: "/employee/player",
    label: "Player",
    icon: "player",
    matches: (pathname) =>
      pathname.startsWith("/employee/player") ||
      pathname.startsWith("/employee/avatar"),
  },
];

function DestinationIcon({ icon }: { icon: Destination["icon"] }) {
  if (icon === "home") {
    return <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z" />;
  }
  if (icon === "journey") {
    return (
      <>
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <path d="M8.5 18h2.3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    );
  }
  if (icon === "skills") {
    return (
      <>
        <path d="m12 3 2.2 5.3L20 10l-5.8 1.7L12 17l-2.2-5.3L4 10l5.8-1.7L12 3Z" />
        <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
      </>
    );
  }
  if (icon === "feed") {
    return (
      <>
        <path d="M5 5h14M5 12h14M5 19h9" />
        <circle cx="3" cy="5" r=".7" fill="currentColor" stroke="none" />
        <circle cx="3" cy="12" r=".7" fill="currentColor" stroke="none" />
        <circle cx="3" cy="19" r=".7" fill="currentColor" stroke="none" />
      </>
    );
  }
  return (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.7-5 3.2-7.5 7.5-7.5s6.8 2.5 7.5 7.5" />
    </>
  );
}

function DestinationLink({
  destination,
  active,
  mobile = false,
}: {
  destination: Destination;
  active: boolean;
  mobile?: boolean;
}) {
  return (
    <Link
      href={destination.href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "group relative flex items-center transition",
        mobile
          ? "min-w-0 flex-1 flex-col justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold"
          : "gap-3 rounded-2xl px-3 py-3 text-sm font-semibold",
        active
          ? "bg-white text-slate-950 shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
          : "text-white/48 hover:bg-white/[0.055] hover:text-white/85",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cx("size-5 shrink-0", active ? "text-blue-600" : "text-current")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <DestinationIcon icon={destination.icon} />
      </svg>
      <span>{destination.label}</span>
      {!mobile && active ? (
        <span className="absolute -left-2 h-6 w-1 rounded-full bg-blue-500" />
      ) : null}
    </Link>
  );
}

export function EmployeeGameShell({
  profile,
  children,
}: {
  profile: ProfileRecord;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const firstName = (profile.full_name ?? profile.email).split(" ")[0];

  return (
    <main className="workspace-theme min-h-screen">
      <div className="mx-auto min-h-screen max-w-[96rem] lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen border-r border-white/8 bg-[#090c12]/92 p-4 backdrop-blur-xl lg:flex lg:flex-col">
          <Link href="/employee" className="flex items-center gap-3 px-2 py-2">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
              E
            </span>
            <div>
              <p className="text-sm font-semibold text-white">EXP</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                Player workspace
              </p>
            </div>
          </Link>

          <nav className="mt-8 space-y-1.5" aria-label="Employee destinations">
            {destinations.map((destination) => (
              <DestinationLink
                key={destination.href}
                destination={destination}
                active={destination.matches(pathname)}
              />
            ))}
          </nav>

          <Link
            href="/employee/activities"
            className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(59,130,246,0.2)] transition hover:-translate-y-0.5 hover:bg-blue-400"
          >
            <span className="text-lg leading-none">+</span>
            Log activity
          </Link>

          <div className="mt-auto rounded-[22px] border border-white/8 bg-white/[0.035] p-3">
            <p className="truncate text-sm font-semibold text-white">{firstName}</p>
            <p className="mt-1 truncate text-xs text-white/38">
              {profile.workspace?.name ?? "EXP workspace"}
            </p>
            <div className="mt-3 border-t border-white/8 pt-3">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/8 bg-[#07090e]/88 px-4 py-3 backdrop-blur-xl lg:hidden">
            <Link href="/employee" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
                E
              </span>
              <div>
                <p className="text-sm font-semibold text-white">EXP</p>
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/35">
                  {destinations.find((destination) => destination.matches(pathname))?.label ??
                    "Home"}
                </p>
              </div>
            </Link>
            <Link
              href="/employee/activities"
              className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Log activity
            </Link>
          </header>

          <div className="px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
            {children}
          </div>
        </div>
      </div>

      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex items-stretch rounded-[24px] border border-white/10 bg-[#0d1119]/95 p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:hidden"
        aria-label="Employee destinations"
      >
        {destinations.map((destination) => (
          <DestinationLink
            key={destination.href}
            destination={destination}
            active={destination.matches(pathname)}
            mobile
          />
        ))}
      </nav>
    </main>
  );
}
