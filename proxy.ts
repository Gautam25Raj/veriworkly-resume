import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type AuthSession = {
  user?: {
    email?: string | null;
  };
} | null;

const ADMIN_ONLY_PREFIXES = ["/admin"];
const PROTECTED_PREFIXES = ["/admin", "/profile"];

function normalizeEmail(email?: string | null) {
  return (email ?? "").trim().toLowerCase();
}

function isPathProtected(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function getSessionFromBackend(
  request: NextRequest,
): Promise<AuthSession> {
  const backendBaseUrl =
    process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

  if (!backendBaseUrl) return null;

  try {
    const response = await fetch(`${backendBaseUrl}/auth/get-session`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as AuthSession;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = isPathProtected(pathname, PROTECTED_PREFIXES);
  const requiresAdmin = isPathProtected(pathname, ADMIN_ONLY_PREFIXES);

  const isLoginPage = pathname === "/login";

  if (!requiresAuth && !isLoginPage) {
    return NextResponse.next();
  }

  const session = await getSessionFromBackend(request);
  const isAuthenticated = Boolean(session?.user?.email);

  const configuredAdmin = normalizeEmail(process.env.ADMIN_EMAIL);
  const currentUser = normalizeEmail(session?.user?.email);

  const isAdmin =
    isAuthenticated &&
    Boolean(configuredAdmin) &&
    currentUser === configuredAdmin;

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(isAdmin ? "/admin" : "/dashboard", request.url),
      );
    }

    return NextResponse.next();
  }

  if (requiresAuth) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);

      return NextResponse.redirect(loginUrl);
    }

    if (requiresAdmin && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/login"],
};
