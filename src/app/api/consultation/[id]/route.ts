import { NextRequest } from 'next/server';
import { getConsultationRequest, updateConsultationRequest } from '@/lib/db';
import { notifyStatusChanged } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const req = await getConsultationRequest(id);
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
    const before = await getConsultationRequest(id);
    const updated = await updateConsultationRequest(id, body);
    if (!updated) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }
    if (before && body.status && before.status !== updated.status && updated.email) {
      await notifyStatusChanged(updated.email, '간편 상담', updated.status);
    }
    return Response.json({ request: updated });
  } catch {
    return Response.json({ error: '의뢰 수정에 실패했습니다.' }, { status: 500 });
  }
}
