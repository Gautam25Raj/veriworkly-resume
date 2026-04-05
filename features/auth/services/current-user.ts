import { backendApiUrl } from "@/lib/constants";
import { useUserStore } from "@/store/useUserStore";

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
};

type SessionPayload = { user?: SessionUser };

let memoryCache: SessionUser | null = null;

export async function fetchCurrentUser(
  force = false,
): Promise<SessionUser | null> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await fetch(backendApiUrl("/auth/get-session"), {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      if (!response.ok) return null;
      const payload = (await response.json()) as SessionPayload;

      return payload?.user ?? null;
    } catch {
      return null;
    }
  }

  if (!force && memoryCache) return memoryCache;

  try {
    const response = await fetch(backendApiUrl("/auth/get-session"), {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      memoryCache = null;
      return null;
    }

    const payload = (await response.json()) as SessionPayload;
    const user = payload?.user ?? null;

    memoryCache = user;

    return user;
  } catch {
    return null;
  }
}

export async function signOutCurrentUser() {
  try {
    await fetch(backendApiUrl("/auth/sign-out"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({}),
    });
  } finally {
    memoryCache = null;
    if (typeof window !== "undefined") {
      useUserStore.getState().logout();
    }
  }
}
