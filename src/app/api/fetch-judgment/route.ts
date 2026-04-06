import { NextRequest } from 'next/server';
import { fetchJudgment } from '@/lib/casenote';
import { updateCase, getCase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, projectId, court, caseNo } = body;

    if (!court || !caseNo) {
      return Response.json(
        { error: '법원과 사건번호를 입력해주세요.' },
        { status: 400 },
      );
    }

    const result = await fetchJudgment(court, caseNo);

    if (result.available && caseId && projectId) {
      updateCase(projectId, caseId, {
        status: 'fetched',
        sourceText: result.text || '',
        casenoteUrl: result.source === 'casenote' ? (result.url || '') : '',
        lboxUrl: result.source === 'lbox' ? (result.url || '') : '',
      });
    } else if (!result.available && caseId && projectId) {
      updateCase(projectId, caseId, {
        status: 'unavailable',
      });
    }

    return Response.json({
      caseNo,
      available: result.available,
      source: result.source,
      url: result.url || null,
      textLength: result.text?.length || 0,
      message: result.available
        ? `${result.source}에서 전문 확보 완료`
        : 'casenote/lbox에 미등록. 등록 요청 필요',
    });
  } catch (error) {
    return Response.json(
      { error: '판결문 가져오기에 실패했습니다.' },
      { status: 500 },
    );
  }
}
