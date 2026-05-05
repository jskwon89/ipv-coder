import { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const MY_SERVICE_TYPES = [
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
] as const;

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getTitle(data: Record<string, unknown>): string | null {
  const value =
    data.keywords ||
    data.researchTopic ||
    data.researchQuestion ||
    data.title ||
    data.projectName ||
    data.purpose ||
    data.description ||
    data.serviceType ||
    data.contestField ||
    data.analysisType ||
    data.analysisTypes;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = normalizeEmail(request.nextUrl.searchParams.get('email'));
  if (!email) {
    return Response.json({ error: 'email query parameter is required' }, { status: 400 });
  }

  const { data: serviceRows, error: serviceError } = await supabaseAdmin
    .from('service_requests')
    .select('id, service_type, email, status, created_at, data')
    .order('created_at', { ascending: false });
  if (serviceError) {
    return Response.json({ error: serviceError.message }, { status: 500 });
  }

  const rows = serviceRows ?? [];
  const normalizedMatches = rows.filter((row) => normalizeEmail(row.email) === email);
  const exactMatches = rows.filter((row) => row.email === email);
  const mismatches = normalizedMatches.filter((row) => row.email !== email);
  const blankEmailRows = rows.filter((row) => normalizeEmail(row.email) === '');
  const byType = Object.fromEntries(MY_SERVICE_TYPES.map((type) => [type, 0])) as Record<string, number>;
  for (const row of normalizedMatches) {
    byType[String(row.service_type)] = (byType[String(row.service_type)] ?? 0) + 1;
  }

  const { data: contactRows, error: contactError } = await supabaseAdmin
    .from('contact_inquiries')
    .select('id, email, created_at')
    .order('created_at', { ascending: false });

  const authResult = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUsers = authResult.error
    ? []
    : (authResult.data.users ?? [])
        .filter((user) => normalizeEmail(user.email) === email)
        .map((user) => ({
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at,
        }));

  return Response.json({
    email,
    serviceRequests: {
      totalScanned: rows.length,
      exactMatchCount: exactMatches.length,
      normalizedMatchCount: normalizedMatches.length,
      casingOrSpaceMismatchCount: mismatches.length,
      blankEmailCount: blankEmailRows.length,
      byType,
      matches: normalizedMatches.map((row) => {
        const data = (row.data ?? {}) as Record<string, unknown>;
        return {
          id: row.id,
          serviceType: row.service_type,
          email: row.email,
          status: row.status,
          createdAt: row.created_at,
          title: getTitle(data),
          resultFileCount: Array.isArray(data.result_files) ? data.result_files.length : 0,
        };
      }),
      casingOrSpaceMismatches: mismatches.map((row) => ({
        id: row.id,
        serviceType: row.service_type,
        email: row.email,
        createdAt: row.created_at,
      })),
      blankEmailRows: blankEmailRows.map((row) => ({
        id: row.id,
        serviceType: row.service_type,
        createdAt: row.created_at,
      })),
    },
    contactInquiries: contactError
      ? { error: contactError.message }
      : {
          totalScanned: contactRows?.length ?? 0,
          exactMatchCount: (contactRows ?? []).filter((row) => row.email === email).length,
          normalizedMatchCount: (contactRows ?? []).filter((row) => normalizeEmail(row.email) === email).length,
          casingOrSpaceMismatches: (contactRows ?? [])
            .filter((row) => normalizeEmail(row.email) === email && row.email !== email)
            .map((row) => ({ id: row.id, email: row.email, createdAt: row.created_at })),
        },
    auth: {
      error: authResult.error?.message ?? null,
      users: authUsers,
    },
  });
}
