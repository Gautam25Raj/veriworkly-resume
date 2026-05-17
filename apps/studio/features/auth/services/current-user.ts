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

type MasterProfileSummaryPayload = {
  profile?: { userId?: string };
  summary?: Partial<
    Pick<
      SessionUser,
      | "id"
      | "email"
      | "name"
      | "createdAt"
      | "emailVerified"
      | "autoSyncEnabled"
      | "shareResumeCount"
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

    const payload = (await response.json()) as { data?: MasterProfileSummaryPayload };
    const summary = payload.data?.summary;

    if (!summary) return null;

    return {
      id: summary.id ?? payload.data?.profile?.userId ?? "",
      email: summary.email ?? "",
      name: summary.name,
      createdAt: summary.createdAt,
      emailVerified: summary.emailVerified,
      autoSyncEnabled: summary.autoSyncEnabled,
      shareResumeCount: summary.shareResumeCount,
    } satisfies Partial<SessionUser>;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser(force = false): Promise<SessionUser | null> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    try {
      const { cookies } = await import("next/headers");

      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      const summary = await fetchMasterProfileSummary(cookieHeader);
      if (!summary?.id || !summary?.email) return null;
      return summary as SessionUser;
    } catch {
      return null;
    }
  }

  if (!force && memoryCache) return memoryCache;

  try {
    const summary = await fetchMasterProfileSummary();
    if (!summary?.id || !summary?.email) {
      memoryCache = null;
      return null;
    }

    memoryCache = summary as SessionUser;

    return memoryCache;
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

export async function updateCurrentUserName(name: string): Promise<SessionUser> {
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
