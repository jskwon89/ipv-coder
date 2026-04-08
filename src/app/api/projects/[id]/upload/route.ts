import { NextRequest } from 'next/server';
import { getProject } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'uploads';

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
    };

    // bucket 없으면 생성
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
    }

    const ext = type === 'xlsx' ? '.xlsx' : '.txt';
    const safeName = `${Date.now()}${ext}`;
    const storagePath = `${id}/${safeName}`;

    let buffer: Buffer;
    if (type === 'xlsx') {
      buffer = Buffer.from(content, 'base64');
    } else {
      buffer = Buffer.from(content, 'utf-8');
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: type === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/plain',
      });

    if (error) {
      return Response.json({ error: `업로드 실패: ${error.message}` }, { status: 500 });
    }

    return Response.json({
      success: true,
      saved: true,
      fileName: safeName + ext,
      storagePath,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `파일 저장에 실패했습니다: ${msg}` },
      { status: 500 },
    );
  }
}
