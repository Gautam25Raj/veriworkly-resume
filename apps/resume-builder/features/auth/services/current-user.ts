import { backendApiUrl } from "@/lib/constants";

import { useUserStore } from "@/store/useUserStore";

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  createdAt?: string;
  emailVerified?: boolean;
  autoSyncEnabled?: boolean;
  shareResumeCount?: number;
};

type SessionPayload = { user?: SessionUser };
type MasterProfileSummaryPayload = {
  summary?: Partial<
    Pick<
      SessionUser,
      "createdAt" | "emailVerified" | "autoSyncEnabled" | "shareResumeCount"
    >
  >;
};

let memoryCache: SessionUser | null = null;

async function fetchMasterProfileSummary(cookieHeader?: string) {
  try {
    const response = await fetch(backendApiUrl("/profiles/master"), {
      method: "GET",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      credentials: cookieHeader ? undefined : "include",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: MasterProfileSummaryPayload;
    };

    return payload.data?.summary ?? null;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser(
  force = false,
): Promise<SessionUser | null> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    try {
      const { cookies } = await import("next/headers");

      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const response = await fetch(backendApiUrl("/auth/get-session"), {
        headers: { Cookie: cookieHeader },
      });

      if (!response.ok) return null;

      const payload = (await response.json()) as SessionPayload;
      const summary = payload?.user
        ? await fetchMasterProfileSummary(cookieHeader)
        : null;

      return payload?.user
        ? {
            ...payload.user,
            ...summary,
          }
        : null;
    } catch {
      return null;
    }
  }

  if (!force && memoryCache) return memoryCache;

  try {
    const response = await fetch(backendApiUrl("/auth/get-session"), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      memoryCache = null;
      return null;
    }

    const payload = (await response.json()) as SessionPayload;
    const user = payload?.user ?? null;

    if (!user) {
      memoryCache = null;
      return null;
    }

    const summary = await fetchMasterProfileSummary();
    const mergedUser = {
      ...user,
      ...summary,
    };

    memoryCache = mergedUser;

    return mergedUser;
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

export async function updateCurrentUserName(
  name: string,
): Promise<SessionUser> {
  const response = await fetch(backendApiUrl("/users/me/name"), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
    };

    throw new Error(payload.message || "Could not update name");
  }

  const payload = (await response.json()) as {
    data?: SessionUser;
  };

  const updatedUser = payload.data;

  if (!updatedUser) {
    throw new Error("Could not update name");
  }

  const summary = await fetchMasterProfileSummary();
  const merged = {
    ...updatedUser,
    ...summary,
  };

  memoryCache = merged;

  return merged;
}
