import type { AppStore } from "@/lib/types";

const STORAGE_KEY = "levelup-prototype-store";

export const emptyStore: AppStore = {
  currentUserId: null,
  users: {},
};

export function readStore(): AppStore {
  if (typeof window === "undefined") {
    return emptyStore;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore;
    }

    const parsed = JSON.parse(raw) as AppStore;
    return {
      currentUserId: parsed.currentUserId ?? null,
      users: parsed.users ?? {},
    };
  } catch {
    return emptyStore;
  }
}

export function writeStore(store: AppStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
