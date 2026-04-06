// ---------------------------------------------------------------------------
// Excel export — generates .xlsx matching the existing IPV coding format
// ---------------------------------------------------------------------------

import * as XLSX from 'xlsx';
import type { Case, Dyad } from './db';

// ---------------------------------------------------------------------------
// Column definitions: [englishName, koreanName]
// ---------------------------------------------------------------------------

const CASE_COLUMNS: [string, string][] = [
  ['key', '순번'],
  ['case_id', '사건ID'],
  ['court', '법원'],
  ['case_no', '사건번호'],
  ['judgment_date', '선고일'],
  ['final_instance', '최종심급'],
  ['sex', '피고인성별'],
  ['age', '피고인나이'],
  ['employment', '고용상태'],
  ['nationality', '국적'],
  ['victim_sex', '피해자성별'],
  ['victim_age', '피해자나이'],
  ['total_victims', '총피해자수'],
  ['rel_type', '관계유형'],
  ['rel_type_code', '관계유형코드'],
  ['rel_status_first', '첫범행시관계상태'],
  ['rel_start_date', '관계시작일'],
  ['rel_end_date', '관계종료일'],
  ['cohabit_at_first', '첫범행시동거여부'],
  ['cohabit_ever', '동거경험'],
];

const CC_COLUMNS: [string, string][] = [
  ['cc_surveillance', '감시'],
  ['cc_isolation', '고립'],
  ['cc_intimidation', '위협/협박'],
  ['cc_emotional_abuse', '정서적학대'],
  ['cc_digital_control', '디지털통제'],
  ['cc_reputation_threat', '명예위협'],
  ['cc_refusal_to_separate', '이별거부'],
  ['cc_physical_control', '신체적통제'],
  ['cc_economic_control', '경제적통제'],
  ['cc_total', 'CC합계'],
];

function incidentColumns(n: number): [string, string][] {
  return [
    [`main_charge_${n}`, `주된공소사실_${n}`],
    [`charge_cat_${n}`, `죄명범주_${n}`],
    [`event_start_${n}`, `범행시작일_${n}`],
    [`event_end_${n}`, `범행종료일_${n}`],
    [`severity_${n}`, `심각도_${n}`],
    [`harm_level_${n}`, `위해수준_${n}`],
    [`weapon_${n}`, `흉기_${n}`],
    [`body_force_type_${n}`, `신체유형_${n}`],
    [`trigger_cat_${n}`, `촉발요인_${n}`],
    [`injury_${n}`, `상해_${n}`],
    [`treatment_days_${n}`, `치료일수_${n}`],
    [`digital_means_${n}`, `디지털수단_${n}`],
    [`date_imputed_${n}`, `날짜추정_${n}`],
    [`event_duration_${n}`, `범행기간_${n}`],
  ];
}

function gapColumns(maxN: number): [string, string][] {
  const cols: [string, string][] = [];
  for (let i = 1; i < maxN; i++) {
    cols.push([`gap_${i}to${i + 1}`, `간격_${i}_${i + 1}`]);
  }
  return cols;
}

const SENTENCING_COLUMNS: [string, string][] = [
  ['disposition', '처분유형'],
  ['disposition_code', '처분코드'],
  ['prison_months', '징역개월'],
  ['probation_months', '집행유예개월'],
  ['fine_10k', '벌금만원'],
  ['admit', '인정여부'],
  ['admit_code', '인정코드'],
  ['settlement', '합의여부'],
  ['deposit', '공탁여부'],
  ['deposit_amount', '공탁금액'],
  ['victim_punishment_wish', '피해자처벌의사'],
  ['sentencing_text', '양형이유'],
];

const DERIVED_COLUMNS: [string, string][] = [
  ['rel_duration_days', '관계기간일수'],
  ['max_event_seq', '최대범행순번'],
  ['total_offense_count', '총범행횟수'],
  ['total_offense_span', '총범행기간'],
  ['mean_gap_days', '평균간격일수'],
  ['gap_trend', '간격추세'],
  ['gap_trend_code', '간격추세코드'],
  ['severity_first', '최초심각도'],
  ['severity_last', '최종심각도'],
  ['severity_max', '최대심각도'],
  ['escalation_present', '에스컬레이션유무'],
  ['rel_start_to_first_days', '관계시작~첫범행일수'],
  ['breakup_to_first_days', '이별~첫범행일수'],
];

// ---------------------------------------------------------------------------
// Row builder
// ---------------------------------------------------------------------------

interface IncidentFlat {
  [key: string]: string | number | null;
}

function flattenIncidents(dyad: Dyad | undefined): IncidentFlat {
  const flat: IncidentFlat = {};
  if (!dyad) return flat;
  for (const inc of dyad.incidents || []) {
    const n = inc.seq;
    flat[`main_charge_${n}`] = inc.main_charge;
    flat[`charge_cat_${n}`] = inc.charge_cat;
    flat[`event_start_${n}`] = inc.event_start;
    flat[`event_end_${n}`] = inc.event_end;
    flat[`severity_${n}`] = inc.severity;
    flat[`harm_level_${n}`] = inc.harm_level;
    flat[`weapon_${n}`] = inc.weapon;
    flat[`body_force_type_${n}`] = inc.body_force_type;
    flat[`trigger_cat_${n}`] = inc.trigger_cat;
    flat[`injury_${n}`] = inc.injury;
    flat[`treatment_days_${n}`] = inc.treatment_days;
    flat[`digital_means_${n}`] = inc.digital_means;
    flat[`date_imputed_${n}`] = inc.date_imputed;
  }
  // event durations
  for (let i = 0; i < (dyad.event_duration || []).length; i++) {
    flat[`event_duration_${i + 1}`] = dyad.event_duration[i];
  }
  // gaps
  for (let i = 0; i < (dyad.gap || []).length; i++) {
    flat[`gap_${i + 1}to${i + 2}`] = dyad.gap[i];
  }
  return flat;
}

// ---------------------------------------------------------------------------
// Variable definition sheet
// ---------------------------------------------------------------------------

const VARIABLE_DEFS: [string, string, string][] = [
  ['key', '순번', '사건 고유 순번'],
  ['case_id', '사건ID', '법원+사건번호 기반 고유 식별자'],
  ['court', '법원', '관할 법원'],
  ['case_no', '사건번호', '사건 고유 번호 (예: 2023고단1234)'],
  ['judgment_date', '선고일', '판결 선고 날짜'],
  ['sex', '피고인성별', '남/여'],
  ['age', '피고인나이', '범행 당시 나이'],
  ['rel_type', '관계유형', '배우자/사실혼/연인/전배우자 등'],
  ['rel_type_code', '관계유형코드', '1=배우자 2=사실혼 3=연인 4=전배우자 5=전연인'],
  ['severity_N', '심각도', '1=경미 2=보통 3=중 4=심각 5=극심'],
  ['disposition_code', '처분코드', '1=실형 2=집행유예 3=벌금 4=무죄/기타'],
  ['cc_*', '강압적통제', '0=없음 1=있음'],
  ['escalation_present', '에스컬레이션', '0=없음 1=있음(최종>최초심각도)'],
  ['gap_trend_code', '간격추세코드', '1=가속 0=안정 -1=감속'],
];

// ---------------------------------------------------------------------------
// Label sheet (code -> label mappings)
// ---------------------------------------------------------------------------

const LABEL_DEFS: [string, string, string][] = [
  ['rel_type_code', '1', '배우자'],
  ['rel_type_code', '2', '사실혼'],
  ['rel_type_code', '3', '연인'],
  ['rel_type_code', '4', '전배우자'],
  ['rel_type_code', '5', '전연인'],
  ['disposition_code', '1', '실형'],
  ['disposition_code', '2', '집행유예'],
  ['disposition_code', '3', '벌금'],
  ['disposition_code', '4', '무죄/기타'],
  ['severity', '1', '경미'],
  ['severity', '2', '보통'],
  ['severity', '3', '중'],
  ['severity', '4', '심각'],
  ['severity', '5', '극심'],
  ['gap_trend_code', '1', '가속(간격감소)'],
  ['gap_trend_code', '0', '안정'],
  ['gap_trend_code', '-1', '감속(간격증가)'],
  ['admit_code', '1', '전부인정'],
  ['admit_code', '2', '일부인정'],
  ['admit_code', '3', '부인'],
];

// ---------------------------------------------------------------------------
// Export function
// ---------------------------------------------------------------------------

export interface ExportOptions {
  maxIncidents?: number; // default 10
}

/**
 * Generate an Excel workbook buffer for a set of cases + dyads.
 */
export function generateExcel(
  cases: Case[],
  dyads: Dyad[],
  nonIpvCases?: Case[],
  options: ExportOptions = {},
): Buffer {
  const maxN = options.maxIncidents ?? 10;
  const dyadMap = new Map<string, Dyad>();
  for (const d of dyads) {
    dyadMap.set(d.caseId, d);
  }

  // Build columns list
  const allColumns: [string, string][] = [
    ...CASE_COLUMNS,
    ...CC_COLUMNS,
  ];
  for (let n = 1; n <= maxN; n++) {
    allColumns.push(...incidentColumns(n));
  }
  allColumns.push(...gapColumns(maxN));
  allColumns.push(...SENTENCING_COLUMNS);
  allColumns.push(...DERIVED_COLUMNS);

  // --- Data sheet ---
  const headerEn = allColumns.map(([en]) => en);
  const headerKr = allColumns.map(([, kr]) => kr);

  const dataRows: (string | number | null)[][] = [];
  for (const c of cases) {
    const dyad = dyadMap.get(c.id);
    const incFlat = flattenIncidents(dyad);
    const row: (string | number | null)[] = allColumns.map(([en]) => {
      if (en in incFlat) return incFlat[en];
      const val = (c as unknown as Record<string, unknown>)[en];
      if (val === undefined || val === null) return null;
      return val as string | number;
    });
    dataRows.push(row);
  }

  const dataSheet = XLSX.utils.aoa_to_sheet([headerEn, headerKr, ...dataRows]);

  // Set column widths
  dataSheet['!cols'] = allColumns.map(([en]) => ({
    wch: Math.max(en.length, 10),
  }));

  // --- 비IPV sheet ---
  const nonIpvSheet = XLSX.utils.aoa_to_sheet([
    ['key', 'case_id', 'court', 'case_no', 'judgment_date', 'reason'],
    ['순번', '사건ID', '법원', '사건번호', '선고일', '제외사유'],
    ...(nonIpvCases || []).map((c) => [
      c.key,
      c.case_id,
      c.court,
      c.case_no,
      c.judgment_date,
      c.errorMessage || '',
    ]),
  ]);

  // --- Variable sheet ---
  const varSheet = XLSX.utils.aoa_to_sheet([
    ['variable', 'korean', 'description'],
    ...VARIABLE_DEFS,
  ]);

  // --- Label sheet ---
  const labelSheet = XLSX.utils.aoa_to_sheet([
    ['variable', 'code', 'label'],
    ...LABEL_DEFS,
  ]);

  // Build workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, dataSheet, 'Data');
  XLSX.utils.book_append_sheet(wb, nonIpvSheet, '비IPV');
  XLSX.utils.book_append_sheet(wb, varSheet, 'Variable');
  XLSX.utils.book_append_sheet(wb, labelSheet, 'label');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buf as Buffer;
}

/**
 * Generate Excel and save to a file path (server-side only).
 */
export async function exportToFile(
  filePath: string,
  cases: Case[],
  dyads: Dyad[],
  nonIpvCases?: Case[],
  options?: ExportOptions,
): Promise<void> {
  const fs = await import('fs');
  const buf = generateExcel(cases, dyads, nonIpvCases, options);
  fs.writeFileSync(filePath, buf);
}
