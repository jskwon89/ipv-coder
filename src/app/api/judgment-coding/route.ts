import { NextRequest } from 'next/server';
import { getJudgmentCodingRequests, createJudgmentCodingRequest } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getJudgmentCodingRequests(email);
    return Response.json({ requests });
  } catch (error) {
    return Response.json(
      { error: '의뢰 목록을 불러오는 데 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, projectName, email, note, fileCount } = body;

    if (!projectId) {
      return Response.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }

    const created = await createJudgmentCodingRequest({
      email: (email || '').trim(),
      projectId,
      projectName: (projectName || '').trim(),
      note: (note || '').trim(),
      fileCount: fileCount || 0,
    });

    return Response.json({ request: created }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: '의뢰 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
