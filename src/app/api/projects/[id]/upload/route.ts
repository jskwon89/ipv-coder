import { NextRequest } from 'next/server';
import { getProject } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) {
      return Response.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    const body = await request.json();
    const { content, type, fileName } = body as {
      content: string;
      type: 'txt' | 'xlsx';
      fileName?: string;
      save?: boolean;
    };

    // 파일을 uploads 폴더에 저장
    const uploadsDir = path.join(process.cwd(), 'uploads', id);
    fs.mkdirSync(uploadsDir, { recursive: true });

    const ext = type === 'xlsx' ? '.xlsx' : '.txt';
    const safeName = `${Date.now()}_${(fileName || 'upload').replace(/[^a-zA-Z0-9가-힣._-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName + ext);

    if (type === 'xlsx') {
      const buffer = Buffer.from(content, 'base64');
      fs.writeFileSync(filePath, buffer);
    } else {
      fs.writeFileSync(filePath, content, 'utf-8');
    }

    return Response.json({
      success: true,
      saved: true,
      fileName: safeName + ext,
    });
  } catch (error) {
    return Response.json(
      { error: '파일 저장에 실패했습니다.' },
      { status: 500 },
    );
  }
}
