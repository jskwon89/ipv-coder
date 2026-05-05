"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  ADMIN_SESSION_CLEARED_EVENT,
  setLastSessionOwner,
} from "@/lib/session-policy";

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/session", { credentials: "same-origin" });
        const data = await res.json();
        if (alive) setIsAdmin(!!data.isAdmin);
      } catch {
        if (alive) setIsAdmin(false);
      } finally {
        if (alive) setLoading(false);
      }
    };
    checkSession();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const handleAdminSessionCleared = () => setIsAdmin(false);
    window.addEventListener(ADMIN_SESSION_CLEARED_EVENT, handleAdminSessionCleared);
    return () => {
      window.removeEventListener(ADMIN_SESSION_CLEARED_EVENT, handleAdminSessionCleared);
    };
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ pin }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.isAdmin) {
        if (data.userSignedOut) {
          await supabase.auth.signOut();
        }
        setLastSessionOwner("admin");
        setLoading(false);
        setIsAdmin(true);
        return true;
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
    setIsAdmin(false);
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    fetch("/api/admin/session", {
      method: "DELETE",
      credentials: "same-origin",
    }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
