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

    // Storage에서 파일 목록 가져오기
    const { data: storageFiles, error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(id, { sortBy: { column: 'created_at', order: 'desc' } });

    if (storageError) {
      return Response.json({ files: [] });
    }

    // DB에서 원래 파일명 가져오기 (테이블 있으면)
    const { data: dbFiles } = await supabaseAdmin
      .from('file_uploads')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    const files = (storageFiles || [])
      .filter((f) => f.name !== '.emptyFolderPlaceholder')
      .map((f) => {
        const dbMatch = dbFiles?.find((d) => d.storage_path === `${id}/${f.name}`);
        return {
          name: f.name,
          originalName: dbMatch?.original_name || f.name,
          size: f.metadata?.size || 0,
          createdAt: f.created_at,
          storagePath: `${id}/${f.name}`,
        };
      });

    return Response.json({ files });
  } catch (error) {
    return Response.json({ files: [] });
  }
}
