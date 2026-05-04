import { create } from "zustand";

import type { SessionUser } from "@/features/auth/services/current-user";

const LEGACY_USER_STORAGE_KEY = "veriworkly-user-storage";

interface UserState {
  user: SessionUser | null;
  loading: boolean;
  isLoggedIn: boolean;

  // Actions
  setUser: (user: SessionUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  loading: true,
  isLoggedIn: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user?.email,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      loading: false,
    }),
}));

export function clearLegacyUserStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
}
