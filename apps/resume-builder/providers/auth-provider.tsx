"use client";

import { useEffect } from "react";

import type { SessionUser } from "@/features/auth/services/current-user";

import { clearLegacyUserStorage, useUserStore } from "../store/useUserStore";

export function AuthInitializer({
  initialUser,
}: {
  initialUser: SessionUser | null;
}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    clearLegacyUserStorage();
    setUser(initialUser);
  }, [initialUser, setUser]);

  return null;
}
