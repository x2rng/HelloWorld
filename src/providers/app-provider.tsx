"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { applyAvatar, applyCompletedAction, applyOnboarding, buildDerivedUserView } from "@/lib/progression";
import { readStore, writeStore } from "@/lib/storage";
import type { AccountSetup, AppStore, AvatarConfig, DerivedUserView, OnboardingData, StoredUser } from "@/lib/types";

type AppContextValue = {
  hydrated: boolean;
  store: AppStore;
  currentUser: StoredUser | null;
  derived: DerivedUserView | null;
  register: (payload: AccountSetup) => { ok: true } | { ok: false; message: string };
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string };
  logout: () => void;
  saveOnboarding: (payload: OnboardingData) => void;
  saveAvatar: (payload: AvatarConfig) => void;
  completeAction: (actionId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const subscribe = () => () => {};

function randomId() {
  return `lvl-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AppStore>(() => readStore());
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    if (hydrated) {
      writeStore(store);
    }
  }, [hydrated, store]);

  const currentUser = store.currentUserId ? store.users[store.currentUserId] ?? null : null;
  const derived = currentUser ? buildDerivedUserView(currentUser) : null;

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      store,
      currentUser,
      derived,
      register(payload) {
        const duplicate = Object.values(store.users).find((user) => user.account.email.toLowerCase() === payload.email.toLowerCase());
        if (duplicate) {
          return { ok: false, message: "An account with this email already exists." };
        }

        const id = randomId();
        const now = new Date().toISOString();
        const nextUser: StoredUser = {
          id,
          createdAt: now,
          updatedAt: now,
          account: payload,
          progress: {
            totalXp: 0,
            completedActions: [],
            earnedAchievements: [],
            events: [],
            streakDays: 0,
          },
        };

        setStore((previous) => ({
          currentUserId: id,
          users: {
            ...previous.users,
            [id]: nextUser,
          },
        }));

        return { ok: true };
      },
      login(email, password) {
        const match = Object.values(store.users).find(
          (user) => user.account.email.toLowerCase() === email.toLowerCase() && user.account.password === password,
        );
        if (!match) {
          return { ok: false, message: "We could not find a matching account." };
        }

        setStore((previous) => ({
          ...previous,
          currentUserId: match.id,
        }));

        return { ok: true };
      },
      logout() {
        setStore((previous) => ({
          ...previous,
          currentUserId: null,
        }));
      },
      saveOnboarding(payload) {
        if (!currentUser) return;
        const updated = applyOnboarding(currentUser, payload);
        setStore((previous) => ({
          ...previous,
          users: {
            ...previous.users,
            [updated.id]: updated,
          },
        }));
      },
      saveAvatar(payload) {
        if (!currentUser) return;
        const updated = applyAvatar(currentUser, payload);
        setStore((previous) => ({
          ...previous,
          users: {
            ...previous.users,
            [updated.id]: updated,
          },
        }));
      },
      completeAction(actionId) {
        if (!currentUser) return;
        const updated = applyCompletedAction(currentUser, actionId);
        setStore((previous) => ({
          ...previous,
          users: {
            ...previous.users,
            [updated.id]: updated,
          },
        }));
      },
    }),
    [currentUser, derived, hydrated, store],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider.");
  }
  return context;
}
