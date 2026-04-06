import { getCases, getDyads, getProject } from '@/lib/db';
import { generateExcel } from '@/lib/excel-export';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = getProject(id);
    if (!project) {
      return Response.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    const cases = getCases(id);
    const dyads = getDyads(id);
    const buf = generateExcel(cases, dyads);

    const filename = encodeURIComponent(`${project.name}.xlsx`);
    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Excel 내보내기에 실패했습니다.' },
      { status: 500 },
    );
  }
}
