import { NextRequest } from 'next/server';
import { getStatsDesignRequest, updateStatsDesignRequest } from '@/lib/db';
import { notifyStatusChanged } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const req = await getStatsDesignRequest(id);
    if (!req) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ request: req });
  } catch (error) {
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
    const before = await getStatsDesignRequest(id);
    const updated = await updateStatsDesignRequest(id, body);
    if (!updated) {
      return Response.json({ error: '의뢰를 찾을 수 없습니다.' }, { status: 404 });
    }
    if (before && body.status && before.status !== updated.status && updated.email) {
      await notifyStatusChanged(updated.email, '통계분석 설계', updated.status);
    }
    return Response.json({ request: updated });
  } catch (error) {
    return Response.json({ error: '의뢰 수정에 실패했습니다.' }, { status: 500 });
  }
}
