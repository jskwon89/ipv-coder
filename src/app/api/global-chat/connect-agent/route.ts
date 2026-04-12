import { NextRequest } from 'next/server';
import { notifyLiveChatRequest } from '@/lib/discord';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, lastMessage } = body;

    if (!email || typeof email !== 'string') {
      return Response.json({ error: '이메일이 필요합니다.' }, { status: 400 });
    }

    await notifyLiveChatRequest(email, lastMessage);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: '알림 전송에 실패했습니다.' }, { status: 500 });
  }
}
