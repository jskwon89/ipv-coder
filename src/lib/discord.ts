const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const serviceLabels: Record<string, string> = {
  'research-design': '연구 설계',
  'stats-design': '통계분석 설계',
  'survey': '설문조사',
  'judgment-collection': '판결문 수집',
  'judgment-coding': '판결문 코딩',
  'news-collection': '뉴스 수집',
  'data-transform': '데이터 전처리',
  'quant-analysis': '통계분석',
  'text-analysis': '텍스트 분석',
  'qual-analysis': '질적분석',
  'consultation': '간편 상담',
  'journal-submission': '학술지 투고 상담',
};

export async function notifyNewRequest(serviceType: string, email: string, details?: string) {
  if (!WEBHOOK_URL) {
    console.warn('[discord] DISCORD_WEBHOOK_URL is not set — skipping notification');
    return;
  }

  const label = serviceLabels[serviceType] || serviceType;
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  const embed = {
    title: `새 의뢰 접수: ${label}`,
    color: 0x14b8a6,
    fields: [
      { name: '서비스', value: label, inline: true },
      { name: '이메일', value: email, inline: true },
      { name: '접수 시간', value: now, inline: false },
      ...(details ? [{ name: '내용', value: details.slice(0, 200), inline: false }] : []),
    ],
    footer: { text: 'PRIMER 알림' },
  };

  try {
    const res = await fetch(WEBHOOK_URL.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'PRIMER',
        embeds: [embed],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[discord] notifyNewRequest non-OK status=${res.status} body=${body.slice(0, 200)}`);
    }
  } catch (err) {
    console.error('[discord] notifyNewRequest fetch failed:', err);
  }
}

export async function notifyContactInquiry(email: string, subject: string) {
  if (!WEBHOOK_URL) {
    console.warn('[discord] DISCORD_WEBHOOK_URL is not set — skipping notification');
    return;
  }

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  try {
    const res = await fetch(WEBHOOK_URL.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'PRIMER',
        embeds: [{
          title: '새 문의 접수',
          color: 0x5865f2,
          fields: [
            { name: '이메일', value: email, inline: true },
            { name: '제목', value: subject.slice(0, 100), inline: true },
            { name: '접수 시간', value: now, inline: false },
          ],
          footer: { text: 'PRIMER 알림' },
        }],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[discord] notifyContactInquiry non-OK status=${res.status} body=${body.slice(0, 200)}`);
    }
  } catch (err) {
    console.error('[discord] notifyContactInquiry fetch failed:', err);
  }
}

export async function notifyLiveChatRequest(email: string, message?: string) {
  if (!WEBHOOK_URL) {
    console.warn('[discord] DISCORD_WEBHOOK_URL is not set — skipping notification');
    return;
  }

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  try {
    const res = await fetch(WEBHOOK_URL.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'PRIMER',
        content: '@everyone',
        embeds: [{
          title: '상담사 연결 요청',
          color: 0xef4444,
          fields: [
            { name: '고객', value: email, inline: true },
            { name: '요청 시간', value: now, inline: true },
            ...(message ? [{ name: '내용', value: message.slice(0, 200), inline: false }] : []),
          ],
          footer: { text: 'PRIMER 실시간 상담 — 관리자 페이지에서 응답하세요' },
        }],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[discord] notifyLiveChatRequest non-OK status=${res.status} body=${body.slice(0, 200)}`);
    }
  } catch (err) {
    console.error('[discord] notifyLiveChatRequest fetch failed:', err);
  }
}
