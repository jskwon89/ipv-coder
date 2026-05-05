import { NextRequest } from 'next/server';
import { getJudgmentCodingRequests, createJudgmentCodingRequest } from '@/lib/db';
import { notifyNewRequest } from '@/lib/discord';

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
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!projectId) {
      return Response.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }

    if (!normalizedEmail) {
      return Response.json({ error: 'Login email is required.' }, { status: 400 });
    }

    const created = await createJudgmentCodingRequest({
      email: normalizedEmail,
      projectId,
      projectName: (projectName || '').trim(),
      note: (note || '').trim(),
      fileCount: fileCount || 0,
    });

    await notifyNewRequest('judgment-coding', String(created.email || ''), String(created.projectName || ''));
    return Response.json({ request: created }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: '의뢰 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
