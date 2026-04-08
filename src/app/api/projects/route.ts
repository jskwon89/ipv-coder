import { NextRequest } from 'next/server';
import { getProjects, createProject, deleteProject } from '@/lib/db';

export async function GET() {
  try {
    const projects = await getProjects();
    return Response.json({ projects });
  } catch (error) {
    return Response.json(
      { error: '프로젝트 목록을 불러오는 데 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return Response.json(
        { error: '프로젝트 이름을 입력해주세요.' },
        { status: 400 },
      );
    }
    const project = await createProject(name.trim());
    return Response.json({ project }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: '프로젝트 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return Response.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }
    const deleted = await deleteProject(id);
    if (!deleted) {
      return Response.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: '프로젝트 삭제에 실패했습니다.' }, { status: 500 });
  }
}
