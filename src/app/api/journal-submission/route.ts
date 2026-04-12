import { NextRequest } from 'next/server';
import { getJournalSubmissionRequests, createJournalSubmissionRequest } from '@/lib/db';
import { notifyRequestReceived } from '@/lib/email';
import { notifyNewRequest } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getJournalSubmissionRequests(email);
    return Response.json({ requests });
  } catch {
    return Response.json({ error: '의뢰 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, serviceType, journalField, targetJournal, paperStage, language, description } = body;

    if (!serviceType || typeof serviceType !== 'string') {
      return Response.json({ error: '서비스 유형을 선택해주세요.' }, { status: 400 });
    }
    if (!journalField || typeof journalField !== 'string') {
      return Response.json({ error: '연구 분야를 선택해주세요.' }, { status: 400 });
    }

    const created = await createJournalSubmissionRequest({
      email: (email || '').trim(),
      serviceType: serviceType.trim(),
      journalField: journalField.trim(),
      targetJournal: (targetJournal || '').trim(),
      paperStage: (paperStage || '').trim(),
      language: (language || '').trim(),
      description: (description || '').trim(),
    });

    if (created.email) {
      await notifyRequestReceived(created.email, `학술지 투고: ${created.serviceType}`);
    }
    await notifyNewRequest('journal-submission', created.email || '', `${serviceType} / ${journalField}`);
    return Response.json({ request: created }, { status: 201 });
  } catch {
    return Response.json({ error: '의뢰 생성에 실패했습니다.' }, { status: 500 });
  }
}
