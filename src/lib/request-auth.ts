import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface RequestActor {
  isAdmin: boolean;
  user: User | null;
  email: string;
  name: string;
}

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getBearerToken(request: NextRequest): string {
  const auth = request.headers.get('authorization') ?? '';
  const [scheme, token] = auth.split(/\s+/);
  return scheme?.toLowerCase() === 'bearer' && token ? token : '';
}

function getUserName(user: User | null, email: string): string {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  const value = metadata?.name || metadata?.full_name || metadata?.display_name;
  if (typeof value === 'string' && value.trim()) return value.trim();
  return email.split('@')[0] || '사용자';
}

export async function getRequestActor(request: NextRequest): Promise<RequestActor> {
  const isAdmin = isAdminRequest(request);
  const token = getBearerToken(request);
  if (!token) {
    return { isAdmin, user: null, email: '', name: isAdmin ? '관리자' : '' };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return { isAdmin, user: null, email: '', name: isAdmin ? '관리자' : '' };
  }

  const email = normalizeEmail(data.user.email);
  return { isAdmin, user: data.user, email, name: getUserName(data.user, email) };
}
