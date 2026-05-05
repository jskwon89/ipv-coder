import { NextRequest } from 'next/server';
import { getRequestActor } from '@/lib/request-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

function trimText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const actor = await getRequestActor(request);
    if (!actor.user || !actor.email) {
      return Response.json({ error: 'login required' }, { status: 401 });
    }

    const body = await request.json();
    const content = trimText(body.content);
    if (!content) {
      return Response.json({ error: 'content is required' }, { status: 400 });
    }

    const { data: post, error: postError } = await supabaseAdmin
      .from('board_posts')
      .select('id')
      .eq('id', id)
      .single();
    if (postError || !post) {
      return Response.json({ error: 'post not found' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('board_comments')
      .insert({
        id: crypto.randomUUID(),
        post_id: id,
        content,
        author_email: actor.email,
        author_name: actor.name,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;

    return Response.json({ comment: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to create comment';
    return Response.json({ error: message }, { status: 500 });
  }
}
