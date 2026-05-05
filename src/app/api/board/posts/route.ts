import { NextRequest } from 'next/server';
import { notifyNewBoardPost } from '@/lib/discord';
import { getRequestActor } from '@/lib/request-auth';
import { getSiteUrl } from '@/lib/site-url';
import { supabaseAdmin } from '@/lib/supabase-admin';

const CATEGORIES = new Set(['free', 'qna']);

function normalizeCategory(value: string | null): 'free' | 'qna' {
  return value === 'qna' ? 'qna' : 'free';
}

function trimText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function GET(request: NextRequest) {
  try {
    const category = normalizeCategory(request.nextUrl.searchParams.get('category'));
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit')) || 20, 1), 50);
    const offset = Math.max(Number(request.nextUrl.searchParams.get('offset')) || 0, 0);

    const { data, error, count } = await supabaseAdmin
      .from('board_posts')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    return Response.json({ posts: data ?? [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to load posts';
    return Response.json({ error: message, posts: [], total: 0 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await getRequestActor(request);
    if (!actor.user || !actor.email) {
      return Response.json({ error: 'login required' }, { status: 401 });
    }

    const body = await request.json();
    const category = trimText(body.category);
    const title = trimText(body.title);
    const content = trimText(body.content);

    if (!CATEGORIES.has(category)) {
      return Response.json({ error: 'invalid category' }, { status: 400 });
    }
    if (!title || !content) {
      return Response.json({ error: 'title and content are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('board_posts')
      .insert({
        id,
        category,
        title,
        content,
        author_email: actor.email,
        author_name: actor.name,
        view_count: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;

    await notifyNewBoardPost({
      id,
      category,
      title,
      authorEmail: actor.email,
      url: `${getSiteUrl()}/board/${id}`,
    });

    return Response.json({ post: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to create post';
    return Response.json({ error: message }, { status: 500 });
  }
}
