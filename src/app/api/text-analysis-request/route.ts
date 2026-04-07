import { NextRequest } from 'next/server';
import { getTextAnalysisRequests, createTextAnalysisRequest } from '@/lib/db';

export async function GET() {
  try {
    const requests = getTextAnalysisRequests();
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
    const { email } = body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return Response.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 },
      );
    }

    const created = createTextAnalysisRequest({
      email: (email || '').trim(),
      analysisTypes: body.analysisTypes || '[]',
      dataInputMethod: (body.dataInputMethod || '').trim(),
      textContent: (body.textContent || '').trim(),
      analysisOptions: body.analysisOptions || '{}',
      additionalNotes: (body.additionalNotes || '').trim(),
    });

    return Response.json({ request: created }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: '의뢰 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
