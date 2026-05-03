import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email';

const ADMIN_PIN = '4178';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const pin = url.searchParams.get('pin');
  if (pin !== ADMIN_PIN) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const env = {
    EMAIL_USER_set: Boolean(process.env.EMAIL_USER),
    EMAIL_USER_preview: process.env.EMAIL_USER
      ? process.env.EMAIL_USER.replace(/^(.{3}).*(@.*)$/, '$1***$2')
      : null,
    EMAIL_PASS_set: Boolean(process.env.EMAIL_PASS),
    EMAIL_PASS_length: process.env.EMAIL_PASS?.length ?? 0,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME ?? '(default: PRIMER)',
  };

  const to = url.searchParams.get('to');
  if (!to) {
    return Response.json({ env, hint: 'add &to=your@email.com to attempt a real send' });
  }

  try {
    const ok = await sendEmail({
      to,
      subject: '[PRIMER] 메일 발송 테스트',
      body: `이 메일이 도착했다면 PRIMER 메일 발송이 정상 동작합니다.\n\n발송 시각: ${new Date().toISOString()}`,
    });
    return Response.json({ env, sent: ok, to });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return Response.json({ env, sent: false, to, error: msg }, { status: 500 });
  }
}
