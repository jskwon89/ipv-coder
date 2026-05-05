import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isAdminRequest,
  verifyAdminPin,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseProjectRef(): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  try {
    return new URL(supabaseUrl).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

function getSupabaseAuthCookieNames(request: NextRequest): string[] {
  const names = new Set<string>([
    "supabase-auth-token",
    "sb-access-token",
    "sb-refresh-token",
  ]);
  const projectRef = getSupabaseProjectRef();
  if (projectRef) {
    names.add(`sb-${projectRef}-auth-token`);
    for (let index = 0; index <= 5; index += 1) {
      names.add(`sb-${projectRef}-auth-token.${index}`);
    }
    names.add(`sb-${projectRef}-auth-token-code-verifier`);
  }
  for (const cookie of request.cookies.getAll()) {
    if (
      cookie.name.startsWith("sb-") &&
      (cookie.name.includes("auth-token") || cookie.name.includes("code-verifier"))
    ) {
      names.add(cookie.name);
    }
  }
  return [...names];
}

function expireSupabaseAuthCookies(response: NextResponse, request: NextRequest) {
  for (const name of getSupabaseAuthCookieNames(request)) {
    response.cookies.set(name, "", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ isAdmin: isAdminRequest(request) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!verifyAdminPin(body.pin)) {
      return NextResponse.json({ isAdmin: false, error: "unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ isAdmin: true, userSignedOut: true });
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken(),
      getAdminSessionCookieOptions()
    );
    expireSupabaseAuthCookies(response, request);
    return response;
  } catch {
    return NextResponse.json({ isAdmin: false, error: "login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ isAdmin: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
