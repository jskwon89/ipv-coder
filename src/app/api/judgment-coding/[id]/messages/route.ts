import { NextRequest } from 'next/server';
import { getJudgmentCodingMessages, addJudgmentCodingMessage } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const messages = await getJudgmentCodingMessages(id);
    return Response.json({ messages });
  } catch (error) {
    return Response.json({ error: '메시지 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sender, message } = body;
    if (!sender || !message) {
      return Response.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    const created = await addJudgmentCodingMessage(id, sender, message);
    return Response.json({ message: created }, { status: 201 });
  } catch (error) {
    return Response.json({ error: '메시지 전송에 실패했습니다.' }, { status: 500 });
  }
}
