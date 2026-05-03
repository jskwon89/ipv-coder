import { NextRequest } from 'next/server';
import { getContestRequest, updateContestRequest } from '@/lib/db';
import { notifyStatusChanged } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const req = await getContestRequest(id);
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

    const before = await getContestRequest(id);
    const updated = await updateContestRequest(id, body);
    if (!updated) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }

    // Notify the user when status changes
    if (before && updated.email && body.status && before.status !== updated.status) {
      const scopeLabel = updated.scope === 'international' ? '국제공모전' : '국내공모전';
      const subject = `${scopeLabel} 상담 - ${updated.contestField}`;
      await notifyStatusChanged(updated.email, subject, updated.status);
    }

    return Response.json({ request: updated });
  } catch {
    return Response.json({ error: '의뢰 수정에 실패했습니다.' }, { status: 500 });
  }
}
