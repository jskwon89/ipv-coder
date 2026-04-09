import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'uploads';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 파일 목록 가져오기
    const { data: storageFiles, error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(id, { sortBy: { column: 'created_at', order: 'desc' } });

    if (storageError || !storageFiles?.length) {
      return Response.json({ error: '파일이 없습니다.' }, { status: 404 });
    }

    const files = storageFiles.filter((f) => f.name !== '.emptyFolderPlaceholder');
    if (files.length === 0) {
      return Response.json({ error: '파일이 없습니다.' }, { status: 404 });
    }

    // DB에서 원래 파일명 가져오기
    const { data: dbFiles } = await supabaseAdmin
      .from('file_uploads')
      .select('*')
      .eq('project_id', id);

    // ZIP 생성
    const archive = archiver('zip', { zlib: { level: 5 } });
    const passthrough = new PassThrough();
    archive.pipe(passthrough);

    for (const file of files) {
      const storagePath = `${id}/${file.name}`;
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .download(storagePath);

      if (error || !data) continue;

      const dbMatch = dbFiles?.find((d) => d.storage_path === storagePath);
      const fileName = dbMatch?.original_name || file.name;

      const buffer = Buffer.from(await data.arrayBuffer());
      archive.append(buffer, { name: fileName });
    }

    await archive.finalize();

    // PassThrough를 ReadableStream으로 변환
    const readable = new ReadableStream({
      start(controller) {
        passthrough.on('data', (chunk) => controller.enqueue(chunk));
        passthrough.on('end', () => controller.close());
        passthrough.on('error', (err) => controller.error(err));
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(id)}_files.zip"`,
      },
    });
  } catch (error) {
    return Response.json({ error: '압축 다운로드에 실패했습니다.' }, { status: 500 });
  }
}
