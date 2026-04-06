import { NextRequest } from 'next/server';
import { createCases, getProject } from '@/lib/db';
import { classifyTxt, classifyXlsx, type ClassificationResult } from '@/lib/classify';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = getProject(id);
    if (!project) {
      return Response.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    const body = await request.json();
    const { content, type, save } = body as {
      content: string;
      type: 'txt' | 'xlsx';
      save?: boolean;
    };

    let result: ClassificationResult;

    if (type === 'xlsx') {
      // content is base64-encoded buffer
      const buffer = Buffer.from(content, 'base64');
      result = classifyXlsx(buffer);
    } else {
      result = classifyTxt(content);
    }

    // If save flag is true, persist IPV + ambiguous cases to DB
    if (save) {
      const casesToSave = [...result.ipv, ...result.ambiguous];
      const caseData = casesToSave.map((c, idx) => ({
        key: idx + 1,
        case_id: `${c.court}_${c.case_no}`,
        court: c.court,
        case_no: c.case_no,
        judgment_date: c.judgment_date,
        status: 'pending' as const,
      }));
      const created = createCases(id, caseData);
      return Response.json({
        result,
        saved: true,
        savedCount: created.length,
      });
    }

    return Response.json({ result, saved: false });
  } catch (error) {
    return Response.json(
      { error: '파일 분석에 실패했습니다.' },
      { status: 500 },
    );
  }
}
