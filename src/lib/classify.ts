// ---------------------------------------------------------------------------
// IPV / non-IPV classifier
// ---------------------------------------------------------------------------

import * as XLSX from 'xlsx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ParsedCase {
  court: string;
  case_no: string;
  judgment_date: string;
  charge: string;
  raw_line: string;
}

export interface ClassifiedCase extends ParsedCase {
  is_ipv: boolean;
  reason: string;
}

export interface ClassificationResult {
  ipv: ClassifiedCase[];
  nonIpv: ClassifiedCase[];
  ambiguous: ClassifiedCase[];
  total: number;
}

// ---------------------------------------------------------------------------
// Keywords
// ---------------------------------------------------------------------------

/** Keywords that strongly indicate IPV relationship */
const IPV_KEYWORDS = [
  '부부',
  '남편',
  '아내',
  '처',
  '배우자',
  '사실혼',
  '동거',
  '연인',
  '교제',
  '애인',
  '이혼',
  '전처',
  '전남편',
  '전남자친구',
  '전여자친구',
  '헤어진',
  '결별',
  '별거',
  '내연',
  '사귀',
  '만나',
  '가정폭력',
  '가폭',
  '스토킹',
];

/** Keywords that strongly indicate non-IPV */
const NON_IPV_KEYWORDS = [
  '로맨스스캠',
  '보이스피싱',
  '피싱',
  '불법도박',
  '마약',
  '음주운전',
  '교통사고',
  '절도',
  '사기',
  '횡령',
  '배임',
  '뇌물',
  '조세',
  '무고',
  '명예훼손', // may overlap, but alone usually not IPV
];

/** Charge categories typically associated with IPV cases */
const IPV_CHARGE_PATTERNS = [
  /상해/,
  /폭행/,
  /협박/,
  /감금/,
  /강간/,
  /강제추행/,
  /유사강간/,
  /준강간/,
  /준강제추행/,
  /스토킹/,
  /주거침입/,
  /재물손괴/,
  /통신매체이용/,
  /카메라/,
  /촬영/,
  /살인/,
  /살해/,
  /존속/,
  /가정보호/,
];

// ---------------------------------------------------------------------------
// TXT parser — [형사] pattern
// ---------------------------------------------------------------------------

/**
 * Parse a text file with lines like:
 * [형사] 서울중앙지법 2023고단1234 2023-06-15 상해 ...
 * or similar court-listing formats.
 */
export function parseTxt(content: string): ParsedCase[] {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const results: ParsedCase[] = [];

  // Pattern: [형사] {court} {case_no} {date} {charge...}
  const pattern1 = /\[형사\]\s*(\S+)\s+(\d{4}\S+)\s+(\d{4}[-./]\d{2}[-./]\d{2})\s+(.*)/;

  // Pattern: {court} {case_no} {date} {charge...}
  const pattern2 = /^(\S+(?:법원|지법|고법|대법원))\s+(\d{4}\S+)\s+(\d{4}[-./]\d{2}[-./]\d{2})\s+(.*)/;

  // Pattern: numbered lines: 1. court case_no date charge
  const pattern3 = /^\d+[.)\s]+(\S+(?:법원|지법|고법|대법원)?)\s+(\d{4}\S+)\s+(\d{4}[-./]\d{2}[-./]\d{2})\s+(.*)/;

  // Tab-separated: court\tcase_no\tdate\tcharge
  const pattern4 = /^(.+?)\t(.+?)\t(\d{4}[-./]\d{2}[-./]\d{2})\t(.*)/;

  for (const line of lines) {
    let match =
      line.match(pattern1) ||
      line.match(pattern2) ||
      line.match(pattern3) ||
      line.match(pattern4);

    if (match) {
      results.push({
        court: match[1].trim(),
        case_no: match[2].trim(),
        judgment_date: match[3].trim().replace(/\./g, '-'),
        charge: match[4].trim(),
        raw_line: line,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// XLSX parser
// ---------------------------------------------------------------------------

/**
 * Parse an XLSX file. Expects columns like: 법원/court, 사건번호/case_no, 선고일/date, 죄명/charge
 */
export function parseXlsx(buffer: Buffer | ArrayBuffer): ParsedCase[] {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];

  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: '',
  });

  const results: ParsedCase[] = [];

  // Try to find the right columns
  const courtKeys = ['법원', 'court', 'Court', '관할법원'];
  const caseNoKeys = ['사건번호', 'case_no', 'caseNo', 'CaseNo', '사건_번호'];
  const dateKeys = ['선고일', 'judgment_date', 'date', 'Date', '판결일', '선고_일'];
  const chargeKeys = ['죄명', 'charge', 'Charge', '공소사실', '혐의'];

  function findCol(row: Record<string, string>, candidates: string[]): string {
    for (const key of candidates) {
      if (key in row) return row[key];
    }
    // Try partial match
    for (const [k, v] of Object.entries(row)) {
      for (const c of candidates) {
        if (k.includes(c) || c.includes(k)) return v;
      }
    }
    return '';
  }

  for (const row of rows) {
    const court = findCol(row, courtKeys);
    const caseNo = findCol(row, caseNoKeys);
    const date = findCol(row, dateKeys);
    const charge = findCol(row, chargeKeys);

    if (caseNo) {
      results.push({
        court: court || '',
        case_no: caseNo,
        judgment_date: String(date).replace(/\./g, '-'),
        charge: charge || '',
        raw_line: JSON.stringify(row),
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

/**
 * Classify a single case as IPV or non-IPV based on keyword analysis.
 */
export function classifyCase(c: ParsedCase): ClassifiedCase {
  const text = `${c.charge} ${c.raw_line}`.toLowerCase();

  // Check non-IPV keywords first (exclusion)
  for (const kw of NON_IPV_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      return { ...c, is_ipv: false, reason: `비IPV 키워드: ${kw}` };
    }
  }

  // Check IPV keywords
  for (const kw of IPV_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      return { ...c, is_ipv: true, reason: `IPV 키워드: ${kw}` };
    }
  }

  // Check charge patterns
  const hasIpvCharge = IPV_CHARGE_PATTERNS.some((p) => p.test(c.charge));
  if (hasIpvCharge) {
    // Charge matches but no relationship keyword — ambiguous
    return { ...c, is_ipv: true, reason: `IPV 관련 죄명: ${c.charge} (관계키워드 미확인)` };
  }

  // Default: ambiguous
  return { ...c, is_ipv: false, reason: '분류불가: 키워드 미매칭' };
}

/**
 * Classify a batch of cases.
 */
export function classifyCases(cases: ParsedCase[]): ClassificationResult {
  const ipv: ClassifiedCase[] = [];
  const nonIpv: ClassifiedCase[] = [];
  const ambiguous: ClassifiedCase[] = [];

  for (const c of cases) {
    const classified = classifyCase(c);
    if (classified.reason.includes('분류불가') || classified.reason.includes('미확인')) {
      ambiguous.push(classified);
    } else if (classified.is_ipv) {
      ipv.push(classified);
    } else {
      nonIpv.push(classified);
    }
  }

  return { ipv, nonIpv, ambiguous, total: cases.length };
}

/**
 * Classify from a TXT string.
 */
export function classifyTxt(content: string): ClassificationResult {
  const parsed = parseTxt(content);
  return classifyCases(parsed);
}

/**
 * Classify from an XLSX buffer.
 */
export function classifyXlsx(buffer: Buffer | ArrayBuffer): ClassificationResult {
  const parsed = parseXlsx(buffer);
  return classifyCases(parsed);
}
