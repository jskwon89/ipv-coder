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
  'research-design',
  'stats-design',
  'survey',
  'judgment-collection',
  'judgment-coding',
  'news-collection',
  'data-transform',
  'quant-analysis',
  'qual-analysis',
  'text-analysis-request',
  'consultation',
  'journal-submission',
  'contest',
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

async function markRequestCompleted(serviceType: string, requestId: string) {
  const respondedAt = new Date().toISOString();
  const { data: row, error: selectError } = await supabaseAdmin
    .from('service_requests')
    .select('email, status')
    .eq('service_type', serviceType)
    .eq('id', requestId)
    .single();
  if (selectError) throw selectError;

  const statusChanged = row?.status !== 'completed';
  if (statusChanged) {
    const { error: updateError } = await supabaseAdmin
      .from('service_requests')
      .update({ status: 'completed', responded_at: respondedAt })
      .eq('service_type', serviceType)
      .eq('id', requestId);
    if (updateError) throw updateError;
  }

  return {
    email: (row?.email as string | undefined) ?? '',
    statusChanged,
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const serviceType = url.searchParams.get('service_type');
    const requestId = url.searchParams.get('request_id');
    if (!ensureService(serviceType) || !requestId) {
      return Response.json({ error: 'service_type and request_id are required' }, { status: 400 });
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
      return Response.json({ error: 'file is required' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return Response.json({ error: 'file must be 50MB or smaller' }, { status: 400 });
    }

    await ensureBucket();

    const safeName = file.name.replace(/[^\w.\-\uAC00-\uD7A3]/g, '_');
    const storagePath = `request-files/${serviceType}/${requestId}/${Date.now()}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
    if (uploadError) {
      return Response.json({ error: `upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const meta: ResultFile = {
      path: storagePath,
      name: file.name,
      size: file.size,
      contentType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    };
    await addResultFile(serviceType, requestId, meta);
    const completion = await markRequestCompleted(serviceType, requestId);

    if (notify) {
      try {
        if (completion.email) {
          const siteUrl = getSiteUrl();
          await sendEmail({
            to: completion.email,
            subject: `[PRIMER] 작업 완료: 결과 파일이 등록되었습니다 - ${file.name}`,
            body: `안녕하세요.\n\n요청하신 작업이 완료되어 결과 파일 '${file.name}'이 등록되었습니다.\n진행 상태는 '작업 완료'로 변경되었습니다.\n\nPRIMER 사이트의 '내 의뢰' 페이지에서 결과 파일을 다운로드하실 수 있습니다.\n${siteUrl}/my\n\n감사합니다.\nPRIMER 드림`,
          });
        }
      } catch {
        /* Notify failure is non-fatal. */
      }
    }

    return Response.json({ file: meta, status: 'completed', statusChanged: completion.statusChanged });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return Response.json({ error: `upload handling failed: ${msg}` }, { status: 500 });
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
      return Response.json({ error: 'service_type, request_id, and path are required' }, { status: 400 });
    }
    const expectedPrefix = `request-files/${serviceType}/${requestId}/`;
    if (!path.startsWith(expectedPrefix)) {
      return Response.json({ error: 'invalid path' }, { status: 400 });
    }

    await supabaseAdmin.storage.from(BUCKET).remove([path]);
    await removeResultFile(serviceType, requestId, path);
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return Response.json({ error: `delete failed: ${msg}` }, { status: 500 });
  }
}
