import { NextRequest } from 'next/server';
import { getRequestActor } from '@/lib/request-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

function trimText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

async function getPost(id: string) {
  const { data, error } = await supabaseAdmin
    .from('board_posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

function canManage(actor: Awaited<ReturnType<typeof getRequestActor>>, authorEmail: string) {
  return actor.isAdmin || (!!actor.email && actor.email === authorEmail);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await getPost(id);
    if (!post) {
      return Response.json({ error: 'post not found' }, { status: 404 });
    }

    const nextViewCount = Number(post.view_count ?? 0) + 1;
    const { data: updatedPost } = await supabaseAdmin
      .from('board_posts')
      .update({ view_count: nextViewCount })
      .eq('id', id)
      .select()
      .single();

    const { data: comments, error: commentsError } = await supabaseAdmin
      .from('board_comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    if (commentsError) throw commentsError;

    return Response.json({ post: updatedPost ?? { ...post, view_count: nextViewCount }, comments: comments ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to load post';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const actor = await getRequestActor(request);
    const post = await getPost(id);
    if (!post) {
      return Response.json({ error: 'post not found' }, { status: 404 });
    }
    if (!canManage(actor, post.author_email)) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const title = trimText(body.title);
    const content = trimText(body.content);
    if (!title || !content) {
      return Response.json({ error: 'title and content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('board_posts')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    return Response.json({ post: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to update post';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const actor = await getRequestActor(request);
    const post = await getPost(id);
    if (!post) {
      return Response.json({ error: 'post not found' }, { status: 404 });
    }
    if (!canManage(actor, post.author_email)) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('board_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to delete post';
    return Response.json({ error: message }, { status: 500 });
  }
}
