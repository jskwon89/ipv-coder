import { NextRequest } from 'next/server';
import { getNewsCollectionRequests, createNewsCollectionRequest } from '@/lib/db';

export async function GET() {
  try {
    const requests = await getNewsCollectionRequests();
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
    const { email, searchType } = body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return Response.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 },
      );
    }
    if (!searchType || !['keyword', 'sentence'].includes(searchType)) {
      return Response.json(
        { error: '검색 방식을 선택해주세요.' },
        { status: 400 },
      );
    }

    const created = await createNewsCollectionRequest({
      email: (email || '').trim(),
      searchType,
      keywords: (body.keywords || '').trim(),
      keywordLogic: (body.keywordLogic || 'AND').trim(),
      dateFrom: (body.dateFrom || '').trim(),
      dateTo: (body.dateTo || '').trim(),
      maxCount: Number(body.maxCount) || 100,
      purpose: (body.purpose || '').trim(),
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
