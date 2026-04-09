import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'uploads';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const storagePath = request.nextUrl.searchParams.get('path');

    if (!storagePath || !storagePath.startsWith(`${id}/`)) {
      return Response.json({ error: '잘못된 파일 경로입니다.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 60 * 10); // 10분 유효

    if (error || !data?.signedUrl) {
      return Response.json({ error: '파일 URL 생성에 실패했습니다.' }, { status: 500 });
    }

    return Response.json({ url: data.signedUrl });
  } catch (error) {
    return Response.json({ error: '파일 다운로드에 실패했습니다.' }, { status: 500 });
  }
}
