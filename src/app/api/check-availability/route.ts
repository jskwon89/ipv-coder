import { NextRequest } from 'next/server';
import { checkAvailability } from '@/lib/casenote';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { court, caseNo } = body;

    if (!court || !caseNo) {
      return Response.json(
        { error: '법원과 사건번호를 입력해주세요.' },
        { status: 400 },
      );
    }

    const result = await checkAvailability(court, caseNo);

    return Response.json({
      caseNo,
      available: result.available,
      source: result.source,
      checkedAt: new Date().toISOString(),
      message: result.available
        ? `${result.source}에서 전문 확인됨`
        : 'casenote/lbox에 미등록. 등록 요청 필요',
    });
  } catch (error) {
    return Response.json(
      { error: '가용성 확인에 실패했습니다.' },
      { status: 500 },
    );
  }
}
