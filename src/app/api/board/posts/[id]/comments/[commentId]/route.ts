import { NextRequest } from 'next/server';
import { getRequestActor } from '@/lib/request-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { id, commentId } = await params;
    const actor = await getRequestActor(request);

    const { data: comment, error: commentError } = await supabaseAdmin
      .from('board_comments')
      .select('*')
      .eq('id', commentId)
      .eq('post_id', id)
      .single();
    if (commentError || !comment) {
      return Response.json({ error: 'comment not found' }, { status: 404 });
    }
    if (!actor.isAdmin && (!actor.email || actor.email !== comment.author_email)) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('board_comments')
      .delete()
      .eq('id', commentId)
      .eq('post_id', id);
    if (error) throw error;

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to delete comment';
    return Response.json({ error: message }, { status: 500 });
  }
}
