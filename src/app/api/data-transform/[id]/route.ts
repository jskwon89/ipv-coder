import { NextRequest } from 'next/server';
import { getDataTransformRequest, updateDataTransformRequest } from '@/lib/db';
import { notifyStatusChanged } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const req = await getDataTransformRequest(id);
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
    const before = await getDataTransformRequest(id);
    const updated = await updateDataTransformRequest(id, body);
    if (!updated) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }
    if (before && body.status && before.status !== updated.status && updated.email) {
      await notifyStatusChanged(updated.email, '데이터 전처리 & 기초통계', updated.status);
    }
    return Response.json({ request: updated });
  } catch {
    return Response.json({ error: '의뢰 수정에 실패했습니다.' }, { status: 500 });
  }
}
