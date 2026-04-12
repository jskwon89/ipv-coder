import { NextRequest } from 'next/server';
import { getConsultationRequests, createConsultationRequest } from '@/lib/db';
import { notifyRequestReceived } from '@/lib/email';
import { notifyNewRequest } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getConsultationRequests(email);
    return Response.json({ requests });
  } catch {
    return Response.json({ error: '상담 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, services, budget, timeline, description } = body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return Response.json({ error: '관심 서비스를 선택해주세요.' }, { status: 400 });
    }

    const created = await createConsultationRequest({
      email: (email || '').trim(),
      services,
      budget: (budget || '').trim(),
      timeline: (timeline || '').trim(),
      description: (description || '').trim(),
    });

    if (created.email) {
      await notifyRequestReceived(created.email, `간편 상담: ${services.join(', ')}`);
    }
    await notifyNewRequest('consultation', created.email || '', `서비스: ${services.join(', ')}${description ? ` / ${description}` : ''}`);
    return Response.json({ request: created }, { status: 201 });
  } catch {
    return Response.json({ error: '상담 신청에 실패했습니다.' }, { status: 500 });
  }
}
