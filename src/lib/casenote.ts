// ---------------------------------------------------------------------------
// casenote.kr / lbox fetcher
// ---------------------------------------------------------------------------

export interface FetchResult {
  available: boolean;
  source: 'casenote' | 'lbox' | null;
  text?: string;
  url?: string;
}

/** Map common court names to casenote slug format */
function courtSlug(court: string): string {
  // Already a slug-like value
  if (/^[a-z]/.test(court)) return court;
  // Common mappings (extend as needed)
  const map: Record<string, string> = {
    '서울중앙지방법원': 'seoul-central-district-court',
    '서울동부지방법원': 'seoul-eastern-district-court',
    '서울서부지방법원': 'seoul-western-district-court',
    '서울남부지방법원': 'seoul-southern-district-court',
    '서울북부지방법원': 'seoul-northern-district-court',
    '수원지방법원': 'suwon-district-court',
    '인천지방법원': 'incheon-district-court',
    '대전지방법원': 'daejeon-district-court',
    '대구지방법원': 'daegu-district-court',
    '부산지방법원': 'busan-district-court',
    '광주지방법원': 'gwangju-district-court',
    '울산지방법원': 'ulsan-district-court',
    '창원지방법원': 'changwon-district-court',
    '의정부지방법원': 'uijeongbu-district-court',
    '춘천지방법원': 'chuncheon-district-court',
    '청주지방법원': 'cheongju-district-court',
    '전주지방법원': 'jeonju-district-court',
    '제주지방법원': 'jeju-district-court',
  };
  return map[court] || court;
}

/** Normalize case number for URL usage */
function normalizeCaseNo(caseNo: string): string {
  // e.g. "2023고단1234" -> "2023고단1234"  (keep as-is for casenote)
  return caseNo.trim();
}

/**
 * Build a casenote.kr URL for a given court + case number.
 * Pattern: https://casenote.kr/{court_slug}/{case_no}
 */
export function casenoteUrl(court: string, caseNo: string): string {
  return `https://casenote.kr/${courtSlug(court)}/${encodeURIComponent(normalizeCaseNo(caseNo))}`;
}

/**
 * Build a public lbox URL.
 * Pattern: https://public.lbox.kr/v2/case/{court}/{case_no}
 */
export function lboxUrl(court: string, caseNo: string): string {
  return `https://public.lbox.kr/v2/case/${encodeURIComponent(court)}/${encodeURIComponent(normalizeCaseNo(caseNo))}`;
}

// ---------------------------------------------------------------------------
// HTML text extraction
// ---------------------------------------------------------------------------

/**
 * Strip HTML tags from a string.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract judgment body text from casenote HTML.
 * Looks for text between '주문' and '소송경과' (or end-of-section markers).
 */
export function extractJudgmentText(html: string): string {
  // Try to find the judgment body section
  // Pattern 1: between 주문 header and 소송경과 / 이유 section
  const bodyPatterns = [
    /주\s*문([\s\S]*?)(?:소송경과|이\s*유\s*$)/m,
    /주\s*문([\s\S]*?)$/m,
  ];

  for (const pattern of bodyPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const extracted = stripHtml(match[1]);
      if (extracted.length > 50) return extracted;
    }
  }

  // Fallback: extract full visible text
  return stripHtml(html);
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

/**
 * Check if a judgment exists on casenote.kr using a HEAD request.
 */
export async function checkCasenote(court: string, caseNo: string): Promise<boolean> {
  const url = casenoteUrl(court, caseNo);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch full text from casenote.kr.
 */
export async function fetchCasenote(court: string, caseNo: string): Promise<FetchResult> {
  const url = casenoteUrl(court, caseNo);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(30_000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) {
      return { available: false, source: null };
    }
    const html = await res.text();
    const text = extractJudgmentText(html);
    if (text.length < 50) {
      return { available: false, source: null };
    }
    return { available: true, source: 'casenote', text, url };
  } catch {
    return { available: false, source: null };
  }
}

/**
 * Check if a judgment exists on lbox.
 */
export async function checkLbox(court: string, caseNo: string): Promise<boolean> {
  const url = lboxUrl(court, caseNo);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch full text from lbox.
 */
export async function fetchLbox(court: string, caseNo: string): Promise<FetchResult> {
  const url = lboxUrl(court, caseNo);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(30_000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) {
      return { available: false, source: null };
    }
    const html = await res.text();
    const text = stripHtml(html);
    if (text.length < 50) {
      return { available: false, source: null };
    }
    return { available: true, source: 'lbox', text, url };
  } catch {
    return { available: false, source: null };
  }
}

/**
 * Try casenote first, then lbox. Return whichever succeeds.
 */
export async function fetchJudgment(court: string, caseNo: string): Promise<FetchResult> {
  // Try casenote first
  const casenoteResult = await fetchCasenote(court, caseNo);
  if (casenoteResult.available) return casenoteResult;

  // Fall back to lbox
  const lboxResult = await fetchLbox(court, caseNo);
  if (lboxResult.available) return lboxResult;

  return { available: false, source: null };
}

/**
 * Quick availability check (HEAD only, no full fetch). Tries casenote then lbox.
 */
export async function checkAvailability(
  court: string,
  caseNo: string,
): Promise<{ available: boolean; source: 'casenote' | 'lbox' | null }> {
  if (await checkCasenote(court, caseNo)) {
    return { available: true, source: 'casenote' };
  }
  if (await checkLbox(court, caseNo)) {
    return { available: true, source: 'lbox' };
  }
  return { available: false, source: null };
}
