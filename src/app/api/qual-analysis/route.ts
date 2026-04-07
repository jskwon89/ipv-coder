import { NextRequest } from 'next/server';
import { getQualAnalysisRequests, createQualAnalysisRequest } from '@/lib/db';

export async function GET() {
  try {
    const requests = getQualAnalysisRequests();
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

    const created = createQualAnalysisRequest({
      email: (email || '').trim(),
      analysisType: (body.analysisType || '').trim(),
      dataDescription: (body.dataDescription || '').trim(),
      dataFormat: (body.dataFormat || '').trim(),
      analysisGoal: (body.analysisGoal || '').trim(),
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
