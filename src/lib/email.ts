interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailParams): Promise<boolean> {
  // TODO: Connect real email provider (Resend, SendGrid, etc.)
  console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
  return true;
}

export function notifyRequestReceived(email: string, keywords: string) {
  return sendEmail({
    to: email,
    subject: '[PRIMER] 연구 설계 의뢰가 접수되었습니다',
    body: `안녕하세요.\n\n'${keywords}' 관련 연구 설계 의뢰가 정상적으로 접수되었습니다.\n담당자 검토 후 결과를 제공해 드리겠습니다.\n\n감사합니다.\nPRIMER 팀`,
  });
}

export function notifyRequestCompleted(email: string, keywords: string) {
  return sendEmail({
    to: email,
    subject: '[PRIMER] 연구 설계 결과가 등록되었습니다',
    body: `안녕하세요.\n\n'${keywords}' 관련 연구 설계 분석이 완료되었습니다.\nPRIMER에 접속하여 결과를 확인해주세요.\n\n감사합니다.\nPRIMER 팀`,
  });
}

export function notifyNewMessage(email: string, keywords: string) {
  return sendEmail({
    to: email,
    subject: '[PRIMER] 새로운 메시지가 도착했습니다',
    body: `안녕하세요.\n\n'${keywords}' 의뢰 건에 담당자의 새로운 메시지가 있습니다.\nPRIMER에 접속하여 확인해주세요.\n\n감사합니다.\nPRIMER 팀`,
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
  return sendEmail({
    to: email,
    subject: `[PRIMER] ${subject} - 상태 변경: ${label}`,
    body: `안녕하세요.\n\n의뢰하신 '${subject}' 건의 진행 상태가 '${label}'(으)로 변경되었습니다.\nPRIMER에 접속하여 자세한 내용을 확인해주세요.\n\n감사합니다.\nPRIMER 팀`,
  });
}
