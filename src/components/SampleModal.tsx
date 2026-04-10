"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────
   공통 모달 래퍼
   ──────────────────────────────────────────────────── */

export function SampleModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-200" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 bg-teal-500 rounded-full" />
            <h3 className="font-bold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   "결과물 샘플 보기" 트리거 버튼
   ──────────────────────────────────────────────────── */

export function SampleButton({ children, title }: { children: React.ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-500 border border-teal-500/30 rounded-lg hover:bg-teal-500/5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        결과물 샘플 보기
      </button>
      <SampleModal open={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </SampleModal>
    </>
  );
}

/* ────────────────────────────────────────────────────
   판결문 코딩 상세 샘플
   ──────────────────────────────────────────────────── */

export function JudgmentCodingDetail() {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-700">IPV(친밀한 파트너 폭력) 판결문 5건을 변수 코딩한 결과 예시입니다. 실제 납품 시 Excel + 코딩 매뉴얼이 함께 제공됩니다.</p>
      </div>

      {/* 사건 기본정보 */}
      <Section color="amber" title="사건 기본정보">
        <Table
          headers={["No.", "법원", "사건번호", "선고일", "죄명", "심급"]}
          rows={[
            ["1", "서울중앙지법", "2024고단1234", "2024-03-15", "상해, 협박", "1심"],
            ["2", "수원지법", "2024고단567", "2024-04-22", "폭행, 주거침입", "1심"],
            ["3", "대전지법", "2023고합89", "2024-01-10", "강제추행, 상해", "1심"],
            ["4", "부산지법", "2024노234", "2024-05-08", "스토킹범죄", "2심"],
            ["5", "인천지법", "2024고단890", "2024-06-03", "상해, 재물손괴", "1심"],
          ]}
        />
      </Section>

      {/* 관계 */}
      <Section color="blue" title="피해자-가해자 관계">
        <Table
          headers={["No.", "관계유형", "동거여부", "교제기간", "관계상태", "자녀유무"]}
          rows={[
            ["1", "법률혼 배우자", "동거", "약 8년", "혼인 중", "유 (2명)"],
            ["2", "전 동거인", "별거", "약 3년", "이혼 후", "유 (1명)"],
            ["3", "교제 상대", "비동거", "약 1년 6개월", "교제 중", "무"],
            ["4", "전 교제 상대", "비동거", "약 2년", "결별 후", "무"],
            ["5", "사실혼 배우자", "동거", "약 5년", "사실혼 중", "유 (1명)"],
          ]}
        />
      </Section>

      {/* 양형 */}
      <Section color="red" title="폭력 유형 및 양형 결과">
        <Table
          headers={["No.", "폭력유형", "심각도", "판결", "형량", "피해자 처벌의사"]}
          rows={[
            ["1", "신체적 폭력", "중", "징역", "징역 8월, 집행유예 2년", "처벌 희망"],
            ["2", "신체적 폭력 + 주거침입", "중", "징역", "징역 6월", "처벌 희망"],
            ["3", "성폭력 + 신체적 폭력", "최중", "징역", "징역 2년", "처벌 희망"],
            ["4", "스토킹", "경", "벌금", "벌금 500만원", "처벌 불원"],
            ["5", "신체적 폭력 + 재물손괴", "중", "징역", "징역 10월, 집행유예 2년", "처벌 희망"],
          ]}
        />
      </Section>

      {/* CC 코딩 */}
      <Section color="purple" title="강압적 통제(Coercive Control) 코딩">
        <Table
          headers={["No.", "감시", "고립", "위협", "정서적 학대", "디지털 통제", "경제적 통제", "이별 거부", "CC 합계"]}
          rows={[
            ["1", "1", "0", "1", "1", "1", "0", "0", "4"],
            ["2", "1", "1", "1", "1", "0", "0", "1", "5"],
            ["3", "0", "0", "1", "1", "1", "0", "0", "3"],
            ["4", "1", "1", "1", "1", "1", "0", "1", "6"],
            ["5", "1", "0", "1", "1", "0", "1", "0", "4"],
          ]}
        />
        <p className="text-[11px] text-gray-400 mt-2">* 1 = 판결문에서 확인됨, 0 = 미확인. CC 합계 = 강압적 통제 지표 총합.</p>
      </Section>

      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
        <p className="font-semibold text-gray-800 mb-1">납품 형태</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>코딩 결과 Excel 파일 (사건별 전체 변수)</li>
          <li>코딩 매뉴얼 (변수 정의, 코딩 기준, 예시)</li>
          <li>요약 통계표 (기술통계, 빈도표)</li>
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   연구 설계 상세 샘플
   ──────────────────────────────────────────────────── */

export function ResearchDesignDetail() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          <strong>연구 주제:</strong> &quot;친밀한 파트너 폭력(IPV) 피해 경험이 정신건강에 미치는 영향 — 사회적 지지의 조절효과를 중심으로&quot;
        </p>
      </div>

      {/* 1. 문헌 탐색 */}
      <Section num="1" color="blue" title="문헌 탐색 결과">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">검색 전략</p>
            <p className="text-sm text-gray-700">DB: Web of Science, PsycINFO, KCI, RISS | 기간: 2015-2024 | 결과: 847건 → <strong>최종 38편</strong></p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">주요 선행연구 (상위 5편)</p>
            {[
              { a: "Coker et al. (2021)", f: "IPV 피해 여성 우울 유병률 비피해 대비 3.2배. 사회적 지지가 보호요인." },
              { a: "김지영·이수정 (2022)", f: "정서적 지지가 PTSD 감소에 매개효과 (β=-.34, p<.001)." },
              { a: "Lagdon et al. (2020)", f: "메타분석 (k=52). IPV-우울 r=.36. 사회적 지지 조절효과 유의." },
              { a: "박수진 외 (2023)", f: "정서적 > 정보적 > 물질적 지지 순 보호효과." },
              { a: "WHO (2021)", f: "전 세계 여성 3명 중 1명 IPV 경험. 정신건강 서비스 접근성이 핵심." },
            ].map((r, i) => (
              <div key={i} className="text-xs mb-1.5">
                <span className="font-medium text-gray-800">{r.a}</span>
                <span className="text-gray-600"> — {r.f}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Research Gap</p>
            <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5">
              <li>국내에서 사회적 지지의 <strong>조절효과</strong> 검증 연구 부재</li>
              <li>하위유형별 차별적 효과 미검증</li>
              <li>온라인 IPV(디지털 폭력) 포함 연구 희소</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 2. 연구 방법 */}
      <Section num="2" color="green" title="연구 방법 추천">
        <div className="space-y-3">
          <p className="text-sm text-gray-700"><strong>설계:</strong> 횡단적 서베이 연구</p>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg font-medium text-xs">IPV 피해 경험</span>
              <span className="text-gray-400">&rarr;</span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium text-xs">정신건강 (우울, PTSD, 불안)</span>
            </div>
            <p className="text-[11px] text-green-600 font-medium mt-1.5">↕ 사회적 지지 (조절변수)</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">표본</p>
            <p className="text-xs text-gray-700">만 19세 이상 여성, 온라인 패널 할당표집, <strong>최소 384명</strong> (G*Power: f²=0.05, α=.05, power=.95)</p>
          </div>
          <Table
            headers={["변수", "척도", "문항수", "신뢰도"]}
            rows={[
              ["IPV 피해 (독립)", "CTS2-S", "20", "α=.79~.86"],
              ["우울 (종속)", "PHQ-9", "9", "α=.89"],
              ["PTSD (종속)", "PCL-5", "20", "α=.94"],
              ["불안 (종속)", "GAD-7", "7", "α=.92"],
              ["사회적 지지 (조절)", "MSPSS", "12", "α=.88~.91"],
            ]}
          />
        </div>
      </Section>

      {/* 3. 통계 분석 */}
      <Section num="3" color="purple" title="통계 분석 방법 및 도구">
        <div className="space-y-2">
          {[
            { s: "1단계: 기술통계 및 정규성 검토", d: "평균, SD, 왜도, 첨도. Pearson 상관.", t: "SPSS 29 / R (psych)" },
            { s: "2단계: 확인적 요인분석 (CFA)", d: "적합도: CFI>.95, RMSEA<.06, SRMR<.08.", t: "Mplus / R (lavaan)" },
            { s: "3단계: 위계적 회귀분석", d: "통제변수 → IPV → 사회적지지 → 상호작용항.", t: "SPSS PROCESS v4.2 (Model 1)" },
            { s: "4단계: 단순기울기 분석", d: "지지 수준별 IPV 효과 시각화. Johnson-Neyman 기법.", t: "R (ggplot2)" },
            { s: "5단계: 하위유형별 추가분석", d: "가족/친구/의미있는타인 별 조절효과.", t: "동일 도구 반복" },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-800">{item.s}</p>
              <p className="text-[11px] text-gray-600">{item.d}</p>
              <p className="text-[11px] text-purple-600 font-medium">도구: {item.t}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. 결과 제시 */}
      <Section num="4" color="rose" title="결과 제시 상세">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500">예시 회귀분석 테이블 (종속: 우울 PHQ-9, N=420)</p>
          <Table
            headers={["예측변수", "B", "SE", "β", "t", "p", "ΔR²"]}
            rows={[
              ["Step 1: 통제변수", "", "", "", "", "", ".08**"],
              ["  연령", "-.12", ".04", "-.09", "-2.84", ".005", ""],
              ["  교육수준", "-.18", ".06", "-.10", "-2.91", ".004", ""],
              ["Step 2: IPV 피해", "", "", "", "", "", ".22***"],
              ["  IPV 피해 점수", ".48", ".05", ".43", "9.82", "<.001", ""],
              ["Step 3: 사회적 지지", "", "", "", "", "", ".06***"],
              ["  사회적 지지", "-.31", ".05", "-.27", "-6.15", "<.001", ""],
              ["Step 4: 상호작용", "", "", "", "", "", ".02**"],
              ["  IPV × 사회적지지", "-.14", ".05", "-.11", "-2.97", ".003", ""],
            ]}
          />
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">핵심 결과 해석</p>
            <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5">
              <li>IPV → 우울 직접효과 유의 (β=.43, p&lt;.001)</li>
              <li>사회적 지지 직접 보호효과 (β=-.27, p&lt;.001)</li>
              <li>상호작용 유의 (β=-.11, p=.003) → <strong>조절효과 확인</strong></li>
            </ul>
          </div>
        </div>
      </Section>

      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
        <p className="font-semibold text-gray-800 mb-1">납품 형태</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>연구 설계 보고서 (문헌 탐색 + 연구 모형 + 분석 전략)</li>
          <li>참고문헌 목록 (APA 7th)</li>
          <li>G*Power 표본크기 산출 결과</li>
          <li>통계 분석 코드 (R/SPSS syntax)</li>
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   공통 서브 컴포넌트
   ──────────────────────────────────────────────────── */

function Section({ num, color, title, children }: { num?: string; color: string; title: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-400", blue: "bg-blue-400", red: "bg-red-400",
    green: "bg-green-400", purple: "bg-purple-400", rose: "bg-rose-400",
  };
  const numColors: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700", blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700", green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700", rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div>
      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
        {num ? (
          <span className={`w-5 h-5 rounded-full ${numColors[color]} flex items-center justify-center text-[10px] font-bold`}>{num}</span>
        ) : (
          <span className={`w-1.5 h-4 ${colors[color]} rounded-full`} />
        )}
        {title}
      </h4>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            {headers.map((h, i) => (
              <th key={i} className="px-2.5 py-1.5 text-left font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className={`px-2.5 py-1.5 text-gray-700 ${row[0].startsWith("Step") ? "font-medium bg-gray-50" : ""}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
