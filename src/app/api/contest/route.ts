import { NextRequest } from 'next/server';
import { getContestRequests, createContestRequest } from '@/lib/db';
import { notifyRequestReceived } from '@/lib/email';
import { notifyNewRequest } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getContestRequests(email);
    return Response.json({ requests });
  } catch {
    return Response.json({ error: '의뢰 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, contestField, contestName, eligibility, deadline, stage, supportItems, description } = body;

    if (!contestField || typeof contestField !== 'string') {
      return Response.json({ error: '공모전 분야를 선택해주세요.' }, { status: 400 });
    }

    const created = await createContestRequest({
      email: (email || '').trim(),
      contestField: contestField.trim(),
      contestName: (contestName || '').trim(),
      eligibility: (eligibility || '').trim(),
      deadline: (deadline || '').trim(),
      stage: (stage || '').trim(),
      supportItems: typeof supportItems === 'string' ? supportItems : JSON.stringify(supportItems ?? []),
      description: (description || '').trim(),
    });

    if (created.email) {
      await notifyRequestReceived(created.email, `공모전 참가 지원: ${created.contestField}`);
    }
    await notifyNewRequest('contest', created.email || '', `${contestField}${contestName ? ` / ${contestName}` : ''}`);
    return Response.json({ request: created }, { status: 201 });
  } catch {
    return Response.json({ error: '의뢰 생성에 실패했습니다.' }, { status: 500 });
  }
}
