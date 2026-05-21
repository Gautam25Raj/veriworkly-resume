import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SyncSection from "@/app/(main)/(dashboard)/settings/components/SyncSection";

type MockUserState = {
  user: { id: string; email: string; name?: string } | null;
  loading: boolean;
  isLoggedIn: boolean;
};

const mockUserState = vi.hoisted(() => ({
  current: {
    user: null,
    loading: false,
    isLoggedIn: false,
  } as MockUserState,
}));

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

vi.mock("@/store/useUserStore", () => ({
  useUserStore: (selector: (state: MockUserState) => unknown) => selector(mockUserState.current),
}));

describe("sync settings contract", () => {
  beforeEach(() => {
    mockUserState.current = {
      user: null,
      loading: false,
      isLoggedIn: false,
    };
  });

  it("disables auto sync while the user is logged out", () => {
    const html = renderToStaticMarkup(<SyncSection />);

    expect(html).toContain("Sign in to enable background synchronization.");
    expect(html).toMatch(/<input[^>]*type="checkbox"[^>]*disabled/);
    expect(html).not.toMatch(/<input[^>]*type="checkbox"[^>]*checked/);
  });

  it("keeps the auto sync control available while the user is logged in", () => {
    mockUserState.current = {
      user: { id: "user-1", email: "user@example.com", name: "User" },
      loading: false,
      isLoggedIn: true,
    };

    const html = renderToStaticMarkup(<SyncSection />);

    expect(html).toContain("Manage background synchronization.");
    expect(html).not.toMatch(/<input[^>]*type="checkbox"[^>]*disabled/);
  });
});
