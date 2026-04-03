import * as jose from "jose";

import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

type AuthSession = {
  user?: {
    email: string;
  };
} | null;

const ADMIN_ONLY_PREFIXES = ["/admin"];
const PROTECTED_PREFIXES = ["/admin", "/profile"];

function isPathProtected(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function getSessionLocally(request: NextRequest): Promise<AuthSession> {
  const BASE_NAME = "veriworkly-auth.session_token";
  const SECURE_NAME = `__Secure-${BASE_NAME}`;

  const token =
    request.cookies.get(SECURE_NAME)?.value ||
    request.cookies.get(BASE_NAME)?.value;

  if (!token) return null;

  const secretStr = process.env.AUTH_SECRET;

  if (!secretStr) {
    console.error("Middleware Error: AUTH_SECRET missing from Environment");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jose.jwtVerify(token, secret);

    const user = (payload.session as any)?.user || payload.user;

    if (user?.email) {
      return {
        user: {
          email: user.email.toLowerCase().trim(),
        },
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function getSessionFromBackend(
  request: NextRequest,
): Promise<{ session: AuthSession; newCookies: string[] }> {
  const backendBaseUrl =
    process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

  if (!backendBaseUrl) return { session: null, newCookies: [] };

  try {
    const headers = new Headers();
    headers.set("cookie", request.headers.get("cookie") ?? "");

    headers.set("x-forwarded-host", request.nextUrl.host);
    headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";

    headers.set("x-forwarded-for", clientIp);

    const response = await fetch(`${backendBaseUrl}/auth/get-session`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return { session: null, newCookies: [] };

    const session = (await response.json()) as AuthSession;

    const newCookies = response.headers.getSetCookie();

    return { session, newCookies };
  } catch {
    return { session: null, newCookies: [] };
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

  let session = await getSessionLocally(request);
  let cookiesToSet: string[] = [];

  if (!session) {
    const backendResult = await getSessionFromBackend(request);

    session = backendResult.session;
    cookiesToSet = backendResult.newCookies;
  }

  const isAuthenticated = Boolean(session?.user?.email);
  const configuredAdmin = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();

  const currentUser = session?.user?.email || "";

  const isAdmin =
    isAuthenticated &&
    configuredAdmin !== "" &&
    currentUser === configuredAdmin;

  let response: NextResponse;

  if (isLoginPage) {
    if (isAuthenticated) {
      const dest = isAdmin ? "/admin" : "/dashboard";
      response = NextResponse.redirect(new URL(dest, request.url));
    } else {
      response = NextResponse.next();
    }
  } else if (requiresAuth) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("next", pathname);
      response = NextResponse.redirect(loginUrl);
    } else if (requiresAdmin && !isAdmin) {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  if (cookiesToSet.length > 0) {
    cookiesToSet.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/login"],
};
