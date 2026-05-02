import { NextRequest } from 'next/server';
import { getContestSearchRequests, createContestSearchRequest } from '@/lib/db';
import { notifyRequestReceived } from '@/lib/email';
import { notifyNewRequest } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getContestSearchRequests(email);
    return Response.json({ requests });
  } catch {
    return Response.json({ error: '의뢰 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, contestField, eligibility, urgency, keywords, description } = body;

    if (!contestField || typeof contestField !== 'string') {
      return Response.json({ error: '공모전 분야를 선택해주세요.' }, { status: 400 });
    }

    const created = await createContestSearchRequest({
      email: (email || '').trim(),
      contestField: contestField.trim(),
      eligibility: (eligibility || '').trim(),
      urgency: (urgency || '').trim(),
      keywords: (keywords || '').trim(),
      description: (description || '').trim(),
    });

    if (created.email) {
      await notifyRequestReceived(created.email, `공모전 정보 검색: ${created.contestField}`);
    }
    await notifyNewRequest('contest-search', created.email || '', `${contestField}${keywords ? ` / ${keywords}` : ''}`);
    return Response.json({ request: created }, { status: 201 });
  } catch {
    return Response.json({ error: '의뢰 생성에 실패했습니다.' }, { status: 500 });
  }
}
