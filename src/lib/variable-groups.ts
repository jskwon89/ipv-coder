// Variable Groups & Pricing for IPV Coder

export type VariableType = "text" | "number" | "date" | "binary" | "category";

export interface Variable {
  id: string;
  koreanName: string;
  englishName: string;
  description: string;
  type: VariableType;
}

export interface VariableGroup {
  id: string;
  koreanName: string;
  englishName: string;
  variables: Variable[];
}

// ─── 1. 기본정보 (basic) ────────────────────────────────────────

const basicVariables: Variable[] = [
  { id: "court", koreanName: "법원", englishName: "court", description: "판결 법원명", type: "text" },
  { id: "case_no", koreanName: "사건번호", englishName: "case_no", description: "사건번호 (예: 2024고단1234)", type: "text" },
  { id: "judgment_date", koreanName: "선고일", englishName: "judgment_date", description: "판결 선고 날짜", type: "date" },
  { id: "final_instance", koreanName: "최종심", englishName: "final_instance", description: "최종심 여부 (1심/2심/3심)", type: "category" },
  { id: "sex", koreanName: "피고인 성별", englishName: "sex", description: "피고인의 성별", type: "category" },
  { id: "age", koreanName: "피고인 연령", englishName: "age", description: "피고인의 연령", type: "number" },
  { id: "employment", koreanName: "피고인 직업", englishName: "employment", description: "피고인의 직업/고용 상태", type: "category" },
  { id: "nationality", koreanName: "피고인 국적", englishName: "nationality", description: "피고인의 국적", type: "category" },
  { id: "disability", koreanName: "피고인 장애", englishName: "disability", description: "피고인의 장애 여부", type: "binary" },
  { id: "victim_sex", koreanName: "피해자 성별", englishName: "victim_sex", description: "피해자의 성별", type: "category" },
  { id: "victim_age", koreanName: "피해자 연령", englishName: "victim_age", description: "피해자의 연령", type: "number" },
  { id: "total_victims", koreanName: "피해자 수", englishName: "total_victims", description: "총 피해자 수", type: "number" },
  { id: "rel_type", koreanName: "관계 유형", englishName: "rel_type", description: "피고인-피해자 관계 유형", type: "category" },
  { id: "rel_status_first", koreanName: "첫 범행시 관계상태", englishName: "rel_status_first", description: "첫 번째 범행 시점의 관계 상태", type: "category" },
  { id: "rel_start_date", koreanName: "관계 시작일", englishName: "rel_start_date", description: "관계 시작 날짜", type: "date" },
  { id: "rel_end_date", koreanName: "관계 종료일", englishName: "rel_end_date", description: "관계 종료 날짜", type: "date" },
  { id: "rel_end_type", koreanName: "관계 종료 유형", englishName: "rel_end_type", description: "관계 종료 사유/유형", type: "category" },
  { id: "cohabit_at_first", koreanName: "첫 범행시 동거", englishName: "cohabit_at_first", description: "첫 범행 시점 동거 여부", type: "binary" },
  { id: "cohabit_ever", koreanName: "동거 경험", englishName: "cohabit_ever", description: "동거 경험 여부", type: "binary" },
];

// ─── 2. 범행특성 (offense) — 차수별 반복 (N = 1~10) ─────────────

function makeOffenseVariables(): Variable[] {
  const perIncident: Array<{ suffix: string; korean: string; desc: string; type: VariableType }> = [
    { suffix: "main_charge", korean: "주요 공소사실", desc: "주요 공소사실 내용", type: "text" },
    { suffix: "charge_cat", korean: "범행유형 분류", desc: "범행유형 카테고리", type: "category" },
    { suffix: "charge_law", korean: "적용법조", desc: "적용 법률 조항", type: "text" },
    { suffix: "event_start", korean: "범행 시작일", desc: "범행 시작 날짜", type: "date" },
    { suffix: "event_end", korean: "범행 종료일", desc: "범행 종료 날짜", type: "date" },
    { suffix: "event_location_cat", korean: "범행 장소", desc: "범행 장소 카테고리", type: "category" },
    { suffix: "trigger_cat", korean: "범행 촉발요인", desc: "범행 촉발 요인 분류", type: "category" },
    { suffix: "offender_drunk", korean: "피고인 음주", desc: "범행 당시 피고인 음주 여부", type: "binary" },
    { suffix: "body_force", korean: "신체적 폭력", desc: "신체적 폭력 사용 여부", type: "binary" },
    { suffix: "body_force_type", korean: "폭력 유형", desc: "신체적 폭력 구체 유형", type: "category" },
    { suffix: "weapon", korean: "무기/흉기", desc: "무기 또는 흉기 사용 여부 및 종류", type: "category" },
    { suffix: "severity", korean: "심각도", desc: "범행 심각도 점수", type: "number" },
    { suffix: "harm_level", korean: "피해 수준", desc: "피해 수준 분류", type: "category" },
    { suffix: "injury", korean: "상해 부위", desc: "상해 부위 상세", type: "text" },
    { suffix: "treatment_days", korean: "치료일수", desc: "치료 소요 일수", type: "number" },
    { suffix: "digital_means", korean: "디지털 수단", desc: "디지털 수단 사용 여부", type: "binary" },
    { suffix: "stalk_type1", korean: "스토킹 유형", desc: "스토킹 행위 유형", type: "category" },
    { suffix: "threat_type1", korean: "위협 유형", desc: "위협/협박 유형", type: "category" },
    { suffix: "date_imputed", korean: "날짜 추정 여부", desc: "범행 날짜 추정 여부", type: "binary" },
  ];

  const vars: Variable[] = [];
  for (let n = 1; n <= 10; n++) {
    for (const item of perIncident) {
      vars.push({
        id: `${item.suffix}_${n}`,
        koreanName: `${item.korean} (${n}차)`,
        englishName: `${item.suffix}_${n}`,
        description: `${n}차 범행 - ${item.desc}`,
        type: item.type,
      });
    }
  }
  return vars;
}

// ─── 3. 양형인자 (sentencing) ───────────────────────────────────

const sentencingVariables: Variable[] = [
  { id: "disposition", koreanName: "처분 결과", englishName: "disposition", description: "주형 처분 결과 (징역/벌금 등)", type: "category" },
  { id: "disposition_code", koreanName: "처분 코드", englishName: "disposition_code", description: "처분 결과 코드", type: "number" },
  { id: "prison_months", koreanName: "징역 개월", englishName: "prison_months", description: "징역형 개월 수", type: "number" },
  { id: "probation_months", koreanName: "집행유예 개월", englishName: "probation_months", description: "집행유예 기간 (개월)", type: "number" },
  { id: "fine_10k", koreanName: "벌금 (만원)", englishName: "fine_10k", description: "벌금액 (만원 단위)", type: "number" },
  { id: "admit", koreanName: "인정 여부", englishName: "admit", description: "피고인 범행 인정 여부", type: "category" },
  { id: "admit_code", koreanName: "인정 코드", englishName: "admit_code", description: "범행 인정 수준 코드", type: "number" },
  { id: "remorse", koreanName: "반성", englishName: "remorse", description: "피고인 반성 여부/수준", type: "category" },
  { id: "prior_any", koreanName: "전과 유무", englishName: "prior_any", description: "전과 존재 여부", type: "binary" },
  { id: "prior_same", koreanName: "동종전과", englishName: "prior_same", description: "동종 전과 여부", type: "binary" },
  { id: "prior_incarceration", koreanName: "실형전과", englishName: "prior_incarceration", description: "과거 실형 복역 여부", type: "binary" },
  { id: "prior_detail", koreanName: "전과 상세", englishName: "prior_detail", description: "전과 상세 내용", type: "text" },
  { id: "settlement", koreanName: "합의 여부", englishName: "settlement", description: "피해자와 합의 여부", type: "binary" },
  { id: "deposit", koreanName: "공탁 여부", englishName: "deposit", description: "공탁금 납부 여부", type: "binary" },
  { id: "deposit_amount", koreanName: "공탁금액", englishName: "deposit_amount", description: "공탁금 금액 (만원)", type: "number" },
  { id: "victim_punishment_wish", koreanName: "피해자 처벌의사", englishName: "victim_punishment_wish", description: "피해자의 처벌 의사", type: "category" },
  { id: "sentencing_text", koreanName: "양형 이유 원문", englishName: "sentencing_text", description: "양형 이유 전문 텍스트", type: "text" },
];

// ─── 4. 강압적 통제 (cc) ────────────────────────────────────────

const ccVariables: Variable[] = [
  { id: "cc_surveillance", koreanName: "감시/스토킹", englishName: "cc_surveillance", description: "감시 또는 스토킹 행위 여부", type: "binary" },
  { id: "cc_isolation", koreanName: "고립시키기", englishName: "cc_isolation", description: "사회적 고립 유발 여부", type: "binary" },
  { id: "cc_intimidation", koreanName: "위협/협박", englishName: "cc_intimidation", description: "위협 또는 협박 행위 여부", type: "binary" },
  { id: "cc_emotional_abuse", koreanName: "정서적 학대", englishName: "cc_emotional_abuse", description: "정서적 학대 여부", type: "binary" },
  { id: "cc_digital_control", koreanName: "디지털 통제", englishName: "cc_digital_control", description: "디지털 수단을 통한 통제 여부", type: "binary" },
  { id: "cc_reputation_threat", koreanName: "명예 위협", englishName: "cc_reputation_threat", description: "명예 훼손 또는 위협 여부", type: "binary" },
  { id: "cc_refusal_to_separate", koreanName: "이별 거부", englishName: "cc_refusal_to_separate", description: "이별/분리 거부 행위 여부", type: "binary" },
  { id: "cc_physical_control", koreanName: "신체적 통제", englishName: "cc_physical_control", description: "신체적 자유 통제 여부", type: "binary" },
  { id: "cc_economic_control", koreanName: "경제적 통제", englishName: "cc_economic_control", description: "경제적 수단을 통한 통제 여부", type: "binary" },
];

// ─── 5. 파생변수 (derived) ──────────────────────────────────────

function makeDerivedVariables(): Variable[] {
  const base: Variable[] = [
    { id: "rel_duration_days", koreanName: "관계 기간 (일)", englishName: "rel_duration_days", description: "관계 시작~종료 기간 (일)", type: "number" },
    { id: "max_event_seq", koreanName: "최대 차수", englishName: "max_event_seq", description: "최대 범행 차수 번호", type: "number" },
    { id: "total_offense_count", koreanName: "총 범행 횟수", englishName: "total_offense_count", description: "전체 범행 횟수", type: "number" },
  ];

  // gap_1to2 ~ gap_9to10
  for (let i = 1; i <= 9; i++) {
    base.push({
      id: `gap_${i}to${i + 1}`,
      koreanName: `${i}~${i + 1}차 간격 (일)`,
      englishName: `gap_${i}to${i + 1}`,
      description: `${i}차~${i + 1}차 범행 간 간격 (일)`,
      type: "number",
    });
  }

  base.push(
    { id: "mean_gap_days", koreanName: "평균 간격 (일)", englishName: "mean_gap_days", description: "범행 간 평균 간격 (일)", type: "number" },
    { id: "gap_trend", koreanName: "간격 추세", englishName: "gap_trend", description: "범행 간격 추세 (가속/감속/일정)", type: "category" },
    { id: "gap_trend_code", koreanName: "간격 추세 코드", englishName: "gap_trend_code", description: "간격 추세 수치 코드", type: "number" },
    { id: "total_offense_span", koreanName: "범행 기간 (일)", englishName: "total_offense_span", description: "첫 범행~마지막 범행 기간 (일)", type: "number" },
    { id: "severity_first", koreanName: "첫 범행 심각도", englishName: "severity_first", description: "첫 번째 범행의 심각도", type: "number" },
    { id: "severity_last", koreanName: "마지막 범행 심각도", englishName: "severity_last", description: "마지막 범행의 심각도", type: "number" },
    { id: "severity_max", koreanName: "최대 심각도", englishName: "severity_max", description: "전체 범행 중 최대 심각도", type: "number" },
    { id: "escalation_present", koreanName: "에스컬레이션 여부", englishName: "escalation_present", description: "범행 심각도 에스컬레이션 존재 여부", type: "binary" },
    { id: "cc_total", koreanName: "CC 총점", englishName: "cc_total", description: "강압적 통제 항목 총합 점수", type: "number" },
    { id: "rel_start_to_first_days", koreanName: "관계시작~첫범행 (일)", englishName: "rel_start_to_first_days", description: "관계 시작일~첫 범행까지 기간 (일)", type: "number" },
    { id: "breakup_to_first_days", koreanName: "이별~첫범행 (일)", englishName: "breakup_to_first_days", description: "이별일~첫 범행까지 기간 (일)", type: "number" },
  );

  return base;
}

// ─── Export: VARIABLE_GROUPS ────────────────────────────────────

export const VARIABLE_GROUPS: VariableGroup[] = [
  { id: "basic", koreanName: "기본정보", englishName: "Basic Info", variables: basicVariables },
  { id: "offense", koreanName: "범행특성", englishName: "Offense Characteristics", variables: makeOffenseVariables() },
  { id: "sentencing", koreanName: "양형인자", englishName: "Sentencing Factors", variables: sentencingVariables },
  { id: "cc", koreanName: "강압적 통제", englishName: "Coercive Control", variables: ccVariables },
  { id: "derived", koreanName: "파생변수", englishName: "Derived Variables", variables: makeDerivedVariables() },
];

// ─── Helper functions ───────────────────────────────────────────

export function getSelectedVariableCount(selectedIds: string[]): number {
  const allIds = new Set(VARIABLE_GROUPS.flatMap((g) => g.variables.map((v) => v.id)));
  return selectedIds.filter((id) => allIds.has(id)).length;
}

export function estimateCost(
  textLength: number,
  selectedVarCount: number
): {
  inputTokens: number;
  outputTokens: number;
  apiCost: number;
  serviceFee: number;
  totalKRW: number;
} {
  // System prompt (cached) ~40000 tokens at $0.30/MTok
  const systemTokens = 40000;
  const systemCost = (systemTokens / 1_000_000) * 0.30;

  // Input text: textLength * 1.5 tokens at $3/MTok
  const inputTokens = Math.ceil(textLength * 1.5);
  const inputCost = (inputTokens / 1_000_000) * 3;

  // Output: selectedVarCount * 20 tokens at $15/MTok
  const outputTokens = selectedVarCount * 20;
  const outputCost = (outputTokens / 1_000_000) * 15;

  const apiCost = systemCost + inputCost + outputCost;
  const serviceFee = apiCost * 2; // 100% margin
  const totalKRW = Math.round((serviceFee * 1400) / 100) * 100; // Round to nearest 100원

  return {
    inputTokens: systemTokens + inputTokens,
    outputTokens,
    apiCost,
    serviceFee,
    totalKRW,
  };
}
