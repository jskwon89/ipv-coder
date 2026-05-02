import { NextRequest } from 'next/server';
import { getGlobalChatMessages, addGlobalChatMessage } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return Response.json({ error: '이메일이 필요합니다.' }, { status: 400 });
    }
    const messages = await getGlobalChatMessages(email);
    return Response.json({ messages });
  } catch (err) {
    console.error('[global-chat GET] failed:', err);
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : JSON.stringify(err);
    return Response.json({ error: '메시지를 불러오는 데 실패했습니다.', detail }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sender, message } = body;

    if (!email || typeof email !== 'string') {
      return Response.json({ error: '이메일이 필요합니다.' }, { status: 400 });
    }
    if (!sender || !['user', 'admin'].includes(sender)) {
      return Response.json({ error: '유효하지 않은 발신자입니다.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return Response.json({ error: '메시지를 입력해주세요.' }, { status: 400 });
    }

    const msg = await addGlobalChatMessage(email, sender, message.trim());
    return Response.json({ message: msg }, { status: 201 });
  } catch (err) {
    console.error('[global-chat POST] failed:', err);
    return Response.json({ error: '메시지 전송에 실패했습니다.' }, { status: 500 });
  }
}
