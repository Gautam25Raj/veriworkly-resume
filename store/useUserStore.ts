import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { SessionUser } from "@/features/auth/services/current-user";

interface UserState {
  user: SessionUser | null;
  loading: boolean;
  isLoggedIn: boolean;

  // Actions
  setUser: (user: SessionUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
    }),

    {
      name: "veriworkly-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
