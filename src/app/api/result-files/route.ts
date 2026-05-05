import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { addResultFile, getResultFiles, removeResultFile, type ResultFile } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { isAdminRequest } from '@/lib/admin-auth';
import { getSiteUrl } from '@/lib/site-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'uploads';

const VALID_SERVICE_TYPES = new Set([
  'research-design', 'stats-design', 'survey', 'judgment-collection', 'judgment-coding',
  'news-collection', 'data-transform', 'quant-analysis', 'qual-analysis', 'text-analysis-request',
  'consultation', 'journal-submission', 'contest',
]);

function ensureService(serviceType: string | null): serviceType is string {
  return !!serviceType && VALID_SERVICE_TYPES.has(serviceType);
}

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const serviceType = url.searchParams.get('service_type');
    const requestId = url.searchParams.get('request_id');
    if (!ensureService(serviceType) || !requestId) {
      return Response.json({ error: 'service_type / request_id 가 필요합니다.' }, { status: 400 });
    }
    const files = await getResultFiles(serviceType, requestId);
    return Response.json({ files });
  } catch {
    return Response.json({ files: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return Response.json({ error: 'unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const serviceType = formData.get('service_type');
    const requestId = formData.get('request_id');
    const file = formData.get('file');
    const notify = formData.get('notify') === '1';

    if (typeof serviceType !== 'string' || !ensureService(serviceType)) {
      return Response.json({ error: 'invalid service_type' }, { status: 400 });
    }
    if (typeof requestId !== 'string' || !requestId) {
      return Response.json({ error: 'invalid request_id' }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: '파일이 필요합니다.' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return Response.json({ error: '파일 크기는 50MB 이하여야 합니다.' }, { status: 400 });
    }

    await ensureBucket();

    const safeName = file.name.replace(/[^\w.\-가-힣 ]/g, '_');
    const storagePath = `request-files/${serviceType}/${requestId}/${Date.now()}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
    if (uploadError) {
      return Response.json({ error: `업로드 실패: ${uploadError.message}` }, { status: 500 });
    }

    const meta: ResultFile = {
      path: storagePath,
      name: file.name,
      size: file.size,
      contentType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    };
    await addResultFile(serviceType, requestId, meta);

    // Optionally notify the requester by email
    if (notify) {
      try {
        const { data: row } = await supabaseAdmin
          .from('service_requests')
          .select('email')
          .eq('service_type', serviceType)
          .eq('id', requestId)
          .single();
        const email = (row?.email as string | undefined) ?? '';
        if (email) {
          const siteUrl = getSiteUrl();
          await sendEmail({
            to: email,
            subject: `[PRIMER] 결과 파일이 등록되었습니다 - ${file.name}`,
            body: `안녕하세요.\n\n의뢰 결과 파일 '${file.name}'이(가) 등록되었습니다.\nPRIMER 사이트에서 다운로드하실 수 있습니다.\n\n${siteUrl}\n\n감사합니다.\nPRIMER 팀`,
          });
        }
      } catch {
        /* notify failure is non-fatal */
      }
    }

    return Response.json({ file: meta });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return Response.json({ error: `업로드 처리 실패: ${msg}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return Response.json({ error: 'unauthorized' }, { status: 401 });
    }

    const url = request.nextUrl;
    const serviceType = url.searchParams.get('service_type');
    const requestId = url.searchParams.get('request_id');
    const path = url.searchParams.get('path');
    if (!ensureService(serviceType) || !requestId || !path) {
      return Response.json({ error: 'service_type / request_id / path 가 필요합니다.' }, { status: 400 });
    }
    const expectedPrefix = `request-files/${serviceType}/${requestId}/`;
    if (!path.startsWith(expectedPrefix)) {
      return Response.json({ error: '유효하지 않은 경로입니다.' }, { status: 400 });
    }

    await supabaseAdmin.storage.from(BUCKET).remove([path]);
    await removeResultFile(serviceType, requestId, path);
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return Response.json({ error: `삭제 실패: ${msg}` }, { status: 500 });
  }
}
