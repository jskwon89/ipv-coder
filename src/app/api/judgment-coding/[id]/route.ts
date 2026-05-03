import { NextRequest } from 'next/server';
import { getJudgmentCodingRequest, updateJudgmentCodingRequest } from '@/lib/db';
import { notifyStatusChanged } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const req = await getJudgmentCodingRequest(id);
    if (!req) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ request: req });
  } catch {
    return Response.json({ error: '의뢰 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const before = await getJudgmentCodingRequest(id);
    const updated = await updateJudgmentCodingRequest(id, body);
    if (!updated) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }
    const beforeStatus = before ? (before as Record<string, unknown>).status : undefined;
    const afterStatus = (updated as Record<string, unknown>).status;
    const afterEmail = (updated as Record<string, unknown>).email;
    if (before && body.status && beforeStatus !== afterStatus && typeof afterEmail === 'string' && afterEmail) {
      await notifyStatusChanged(afterEmail, '판결문 코딩', String(afterStatus ?? ''));
    }
    return Response.json({ request: updated });
  } catch {
    return Response.json({ error: '의뢰 수정에 실패했습니다.' }, { status: 500 });
  }
}
