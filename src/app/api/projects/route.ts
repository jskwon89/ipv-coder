import { NextRequest } from 'next/server';
import { getProjects, createProject } from '@/lib/db';

export async function GET() {
  try {
    const projects = getProjects();
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
    const project = createProject(name.trim());
    return Response.json({ project }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: '프로젝트 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
