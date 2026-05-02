import { NextRequest } from 'next/server';
import { getContestWritingRequests, createContestWritingRequest } from '@/lib/db';
import { notifyRequestReceived } from '@/lib/email';
import { notifyNewRequest } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getContestWritingRequests(email);
    return Response.json({ requests });
  } catch {
    return Response.json({ error: '의뢰 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, contestType, documentType, deadline, stage, description } = body;

    if (!contestType || typeof contestType !== 'string') {
      return Response.json({ error: '공모전 종류를 선택해주세요.' }, { status: 400 });
    }
    if (!documentType || typeof documentType !== 'string') {
      return Response.json({ error: '응모 자료 형식을 선택해주세요.' }, { status: 400 });
    }

    const created = await createContestWritingRequest({
      email: (email || '').trim(),
      contestType: contestType.trim(),
      documentType: documentType.trim(),
      deadline: (deadline || '').trim(),
      stage: (stage || '').trim(),
      description: (description || '').trim(),
    });

    if (created.email) {
      await notifyRequestReceived(created.email, `응모 자료 작성: ${created.contestType} / ${created.documentType}`);
    }
    await notifyNewRequest('contest-writing', created.email || '', `${contestType} / ${documentType}`);
    return Response.json({ request: created }, { status: 201 });
  } catch {
    return Response.json({ error: '의뢰 생성에 실패했습니다.' }, { status: 500 });
  }
}
