"use client";

export type SessionOwner = "admin" | "user";

export const ADMIN_SESSION_CLEARED_EVENT = "primer:admin-session-cleared";
export const LAST_SESSION_OWNER_KEY = "primer:last-session-owner";

export function getLastSessionOwner(): SessionOwner | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(LAST_SESSION_OWNER_KEY);
  return value === "admin" || value === "user" ? value : null;
}

export function setLastSessionOwner(owner: SessionOwner) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_SESSION_OWNER_KEY, owner);
}

export function notifyAdminSessionCleared() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_SESSION_CLEARED_EVENT));
}

export async function clearAdminSession() {
  try {
    await fetch("/api/admin/session", {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch {
    /* Keep client state consistent even if the server cleanup request fails. */
  } finally {
    setLastSessionOwner("user");
    notifyAdminSessionCleared();
  }
}
