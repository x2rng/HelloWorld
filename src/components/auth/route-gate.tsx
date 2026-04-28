"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";

export function RouteGate({
  mode,
  children,
}: {
  mode: "guest" | "onboarding" | "avatar" | "app";
  children: React.ReactNode;
}) {
  const { hydrated, currentUser, derived } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (mode === "guest") {
      if (currentUser && derived?.stage === "app") router.replace("/dashboard");
      if (currentUser && derived?.stage === "avatar") router.replace("/avatar");
      if (currentUser && derived?.stage === "onboarding") router.replace("/onboarding");
      return;
    }

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (mode === "onboarding" && derived?.stage !== "onboarding") {
      router.replace(derived?.stage === "avatar" ? "/avatar" : "/dashboard");
    }

    if (mode === "avatar") {
      if (derived?.stage === "onboarding") router.replace("/onboarding");
      if (derived?.stage === "app" && pathname === "/avatar") router.replace("/dashboard");
    }

    if (mode === "app") {
      if (derived?.stage === "onboarding") router.replace("/onboarding");
      if (derived?.stage === "avatar") router.replace("/avatar");
    }
  }, [currentUser, derived?.stage, hydrated, mode, pathname, router]);

  if (!hydrated) {
    return <div className="min-h-screen bg-[var(--color-surface)]" />;
  }

  if (mode !== "guest" && !currentUser) {
    return null;
  }

  if (mode === "onboarding" && derived?.stage !== "onboarding") {
    return null;
  }

  if (mode === "app" && derived?.stage !== "app") {
    return null;
  }

  if (mode === "avatar" && derived?.stage === "onboarding") {
    return null;
  }

  if (mode === "avatar" && derived?.stage === "app") {
    return null;
  }

  return <>{children}</>;
}
