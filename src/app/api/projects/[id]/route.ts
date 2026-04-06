import { getProject, getCases, getProjects } from '@/lib/db';
import fs from 'fs';
import path from 'path';

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
    return Response.json({ project, cases });
  } catch (error) {
    return Response.json({ error: '프로젝트 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const projects = getProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      return Response.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }
    projects.splice(idx, 1);
    const DATA_DIR = path.resolve(process.cwd(), 'data');
    fs.writeFileSync(path.join(DATA_DIR, 'projects.json'), JSON.stringify(projects, null, 2), 'utf-8');

    // Also remove associated case/dyad files
    const casesFile = path.join(DATA_DIR, `cases_${id}.json`);
    const dyadsFile = path.join(DATA_DIR, `dyads_${id}.json`);
    if (fs.existsSync(casesFile)) fs.unlinkSync(casesFile);
    if (fs.existsSync(dyadsFile)) fs.unlinkSync(dyadsFile);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: '프로젝트 삭제에 실패했습니다.' }, { status: 500 });
  }
}
