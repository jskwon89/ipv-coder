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

export async function GET(request: NextRequest) {
  return NextResponse.json({ isAdmin: isAdminRequest(request) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!verifyAdminPin(body.pin)) {
      return NextResponse.json({ isAdmin: false, error: "unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ isAdmin: true });
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken(),
      getAdminSessionCookieOptions()
    );
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

