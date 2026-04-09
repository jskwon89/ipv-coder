import { NextRequest } from 'next/server';
import { getDataTransformRequests, createDataTransformRequest } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getDataTransformRequests(email);
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

    const created = await createDataTransformRequest({
      email: (email || '').trim(),
      dataDescription: (body.dataDescription || '').trim(),
      dataFormat: (body.dataFormat || '').trim(),
      currentState: (body.currentState || '').trim(),
      transformationTypes: body.transformationTypes || '[]',
      transformationDetail: (body.transformationDetail || '').trim(),
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
