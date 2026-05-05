import nodemailer from 'nodemailer';
import { getSiteHost, getSiteUrl } from '@/lib/site-url';

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

const EMAIL_USER = process.env.EMAIL_USER?.trim();
// Gmail shows app password with spaces — strip them so users can paste either form
const EMAIL_PASS = process.env.EMAIL_PASS?.replace(/\s+/g, '');
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'PRIMER';

let transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  if (!EMAIL_USER || !EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, body }: EmailParams): Promise<boolean> {
  if (!to) return false;
  const tx = getTransporter();
  if (!tx) {
    // Stub fallback when EMAIL_USER/EMAIL_PASS not configured (e.g. local dev without secrets)
    console.log(`[EMAIL stub] To: ${to} | Subject: ${subject}`);
    return false;
  }
  try {
    await tx.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
      to,
      subject,
      text: body,
    });
    return true;
  } catch (err) {
    console.error('[EMAIL send failed]', err instanceof Error ? err.message : err);
    return false;
  }
}

export function notifyRequestReceived(email: string, keywords: string) {
  const siteHost = getSiteHost();
  return sendEmail({
    to: email,
    subject: `[PRIMER] 의뢰가 접수되었습니다 - ${keywords}`,
    body: `안녕하세요.\n\n'${keywords}' 의뢰가 정상적으로 접수되었습니다.\n담당자 검토 후 결과를 제공해 드리겠습니다.\n\nPRIMER 사이트(${siteHost})에서 진행 상황을 확인하실 수 있습니다.\n\n감사합니다.\nPRIMER 팀`,
  });
}

export function notifyRequestCompleted(email: string, keywords: string) {
  const siteUrl = getSiteUrl();
  return sendEmail({
    to: email,
    subject: `[PRIMER] 의뢰 결과가 등록되었습니다 - ${keywords}`,
    body: `안녕하세요.\n\n'${keywords}' 의뢰의 결과가 등록되었습니다.\nPRIMER 사이트에 접속하여 확인해주세요.\n\n${siteUrl}\n\n감사합니다.\nPRIMER 팀`,
  });
}

export function notifyNewMessage(email: string, keywords: string) {
  const siteUrl = getSiteUrl();
  return sendEmail({
    to: email,
    subject: `[PRIMER] 담당자의 새 메시지 - ${keywords}`,
    body: `안녕하세요.\n\n'${keywords}' 의뢰 건에 담당자의 새로운 메시지가 도착했습니다.\nPRIMER 사이트에서 확인해 주세요.\n\n${siteUrl}\n\n감사합니다.\nPRIMER 팀`,
  });
}

const statusKoLabel: Record<string, string> = {
  pending: '접수 대기중',
  received: '접수 완료',
  in_progress: '작업 진행중',
  completed: '작업 완료',
};

export function notifyStatusChanged(email: string, subject: string, status: string) {
  const label = statusKoLabel[status] ?? status;
  const siteUrl = getSiteUrl();
  return sendEmail({
    to: email,
    subject: `[PRIMER] ${subject} - 상태 변경: ${label}`,
    body: `안녕하세요.\n\n의뢰하신 '${subject}' 건의 진행 상태가 '${label}'(으)로 변경되었습니다.\n\nPRIMER 사이트에 접속하여 자세한 내용을 확인해 주세요.\n${siteUrl}\n\n감사합니다.\nPRIMER 팀`,
  });
}
