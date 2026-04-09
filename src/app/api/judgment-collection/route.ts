import { NextRequest } from 'next/server';
import { getJudgmentCollectionRequests, createJudgmentCollectionRequest } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || undefined;
    const requests = await getJudgmentCollectionRequests(email);
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
    const { email, name, searchType } = body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return Response.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 },
      );
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return Response.json(
        { error: '이름을 입력해주세요.' },
        { status: 400 },
      );
    }
    if (!searchType || !['caseNumber', 'keyword'].includes(searchType)) {
      return Response.json(
        { error: '검색 방식을 선택해주세요.' },
        { status: 400 },
      );
    }

    const created = await createJudgmentCollectionRequest({
      email: (email || '').trim(),
      name: (name || '').trim(),
      organization: (body.organization || '').trim(),
      purpose: (body.purpose || '').trim(),
      searchType,
      caseNumbers: (body.caseNumbers || '').trim(),
      scopeFirst: !!body.scopeFirst,
      scopeSecond: !!body.scopeSecond,
      scopeThird: !!body.scopeThird,
      outputFormat: (body.outputFormat || 'both').trim(),
      keywords: (body.keywords || '').trim(),
      keywordLogic: (body.keywordLogic || 'AND').trim(),
      courts: (body.courts || '').trim(),
      startYear: Number(body.startYear) || new Date().getFullYear(),
      endYear: Number(body.endYear) || new Date().getFullYear(),
      caseTypes: (body.caseTypes || '').trim(),
      lawKeyword: (body.lawKeyword || '').trim(),
      maxCount: Number(body.maxCount) || 100,
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
