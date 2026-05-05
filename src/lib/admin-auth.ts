import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "primer_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type SameSite = "lax" | "strict" | "none";

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as SameSite,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function getAdminPin(): string | null {
  return process.env.ADMIN_PIN?.trim() || null;
}

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPin();
}

function getSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update("primer-admin-session").digest("hex");
}

export function verifyAdminPin(pin: unknown): boolean {
  const expected = getAdminPin();
  if (!expected || typeof pin !== "string") return false;
  return safeEqual(pin, expected);
}

export function createAdminSessionToken(): string {
  const token = getSessionToken();
  if (!token) {
    throw new Error("ADMIN_PIN is not configured");
  }
  return token;
}

export function isAdminRequest(request: NextRequest): boolean {
  const expected = getSessionToken();
  const actual = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return !!expected && !!actual && safeEqual(actual, expected);
}

