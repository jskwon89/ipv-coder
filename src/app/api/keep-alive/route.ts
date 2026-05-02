import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }
    return Response.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
