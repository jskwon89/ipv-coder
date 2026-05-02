import { getGlobalChatSessions } from '@/lib/db';

export async function GET() {
  try {
    const sessions = await getGlobalChatSessions();
    return Response.json({ sessions });
  } catch (err) {
    console.error('[global-chat sessions GET] failed:', err);
    return Response.json({ error: '채팅 세션을 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}
