"use client";

import { useEffect, useRef } from "react";

import type { SessionUser } from "@/features/auth/services/current-user";

import { clearLegacyUserStorage, useUserStore } from "../store/useUserStore";

export function AuthInitializer({
  initialUser,
}: {
  initialUser: SessionUser | null;
}) {
  const setUser = useUserStore((state) => state.setUser);
  const initialized = useRef(false);

  useEffect(() => {
    clearLegacyUserStorage();
  }, []);

  if (!initialized.current) {
    setUser(initialUser);
    initialized.current = true;
  }

  return null;
}
