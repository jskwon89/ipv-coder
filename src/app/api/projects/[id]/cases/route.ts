import { getCases, getProject } from '@/lib/db';

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
    return Response.json({ cases, total: cases.length });
  } catch (error) {
    return Response.json(
      { error: '사건 목록을 불러오는 데 실패했습니다.' },
      { status: 500 },
    );
  }
}
