"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SampleFile {
  name: string;
  type: "image" | "pdf";
  path: string;
  description?: string;
}

interface ServiceSample {
  key: string;
  label: string;
  description: string;
  files: SampleFile[];
  inlineContent?: React.ReactNode;
}

/* ────────────────────────────────────────────────────
   판결문 코딩 결과 샘플
   ──────────────────────────────────────────────────── */

function JudgmentCodingSample() {
  return (
    <div className="space-y-8">
      {/* 개요 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="text-base font-bold text-amber-900 mb-2">판결문 코딩 결과 예시</h3>
        <p className="text-sm text-amber-700">
          아래는 IPV(친밀한 파트너 폭력) 판결문 5건을 변수 코딩한 결과의 일부입니다.
          실제 납품 시 Excel 파일 + 코딩 매뉴얼이 함께 제공됩니다.
        </p>
      </div>

      {/* 사건 기본정보 테이블 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
          1. 사건 기본정보
        </h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="px-3 py-2 text-left font-medium">No.</th>
                <th className="px-3 py-2 text-left font-medium">법원</th>
                <th className="px-3 py-2 text-left font-medium">사건번호</th>
                <th className="px-3 py-2 text-left font-medium">선고일</th>
                <th className="px-3 py-2 text-left font-medium">죄명</th>
                <th className="px-3 py-2 text-center font-medium">심급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["1", "서울중앙지법", "2024고단1234", "2024-03-15", "상해, 협박", "1심"],
                ["2", "수원지법", "2024고단567", "2024-04-22", "폭행, 주거침입", "1심"],
                ["3", "대전지법", "2023고합89", "2024-01-10", "강제추행, 상해", "1심"],
                ["4", "부산지법", "2024노234", "2024-05-08", "스토킹범죄", "2심"],
                ["5", "인천지법", "2024고단890", "2024-06-03", "상해, 재물손괴", "1심"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 ${i === 5 ? "text-center" : ""} text-gray-700`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 피해자-가해자 관계 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-400 rounded-full" />
          2. 피해자-가해자 관계
        </h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="px-3 py-2 text-left font-medium">No.</th>
                <th className="px-3 py-2 text-left font-medium">관계유형</th>
                <th className="px-3 py-2 text-center font-medium">동거여부</th>
                <th className="px-3 py-2 text-left font-medium">교제기간</th>
                <th className="px-3 py-2 text-left font-medium">관계상태</th>
                <th className="px-3 py-2 text-center font-medium">자녀유무</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["1", "법률혼 배우자", "동거", "약 8년", "혼인 중", "유 (2명)"],
                ["2", "전 동거인", "별거", "약 3년", "이혼 후", "유 (1명)"],
                ["3", "교제 상대", "비동거", "약 1년 6개월", "교제 중", "무"],
                ["4", "전 교제 상대", "비동거", "약 2년", "결별 후", "무"],
                ["5", "사실혼 배우자", "동거", "약 5년", "사실혼 중", "유 (1명)"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 ${i === 2 || i === 5 ? "text-center" : ""} text-gray-700`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 폭력 유형 및 양형 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-red-400 rounded-full" />
          3. 폭력 유형 및 양형 결과
        </h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="px-3 py-2 text-left font-medium">No.</th>
                <th className="px-3 py-2 text-left font-medium">폭력유형</th>
                <th className="px-3 py-2 text-center font-medium">심각도</th>
                <th className="px-3 py-2 text-left font-medium">판결</th>
                <th className="px-3 py-2 text-left font-medium">형량</th>
                <th className="px-3 py-2 text-center font-medium">피해자 처벌의사</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["1", "신체적 폭력", "중", "징역", "징역 8월, 집행유예 2년", "처벌 희망"],
                ["2", "신체적 폭력 + 주거침입", "중", "징역", "징역 6월", "처벌 희망"],
                ["3", "성폭력 + 신체적 폭력", "최중", "징역", "징역 2년", "처벌 희망"],
                ["4", "스토킹", "경", "벌금", "벌금 500만원", "처벌 불원"],
                ["5", "신체적 폭력 + 재물손괴", "중", "징역", "징역 10월, 집행유예 2년", "처벌 희망"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 ${i === 2 || i === 5 ? "text-center" : ""} text-gray-700`}>
                      {i === 2 ? (
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          cell === "최중" ? "bg-red-100 text-red-700" :
                          cell === "중" ? "bg-orange-100 text-orange-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{cell}</span>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 강압적 통제 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-purple-400 rounded-full" />
          4. 강압적 통제(Coercive Control) 코딩
        </h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="px-3 py-2 text-left font-medium">No.</th>
                <th className="px-3 py-2 text-center font-medium">감시</th>
                <th className="px-3 py-2 text-center font-medium">고립</th>
                <th className="px-3 py-2 text-center font-medium">위협</th>
                <th className="px-3 py-2 text-center font-medium">정서적 학대</th>
                <th className="px-3 py-2 text-center font-medium">디지털 통제</th>
                <th className="px-3 py-2 text-center font-medium">경제적 통제</th>
                <th className="px-3 py-2 text-center font-medium">이별 거부</th>
                <th className="px-3 py-2 text-center font-medium bg-gray-100">CC 합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["1", "1", "0", "1", "1", "1", "0", "0", "4"],
                ["2", "1", "1", "1", "1", "0", "0", "1", "5"],
                ["3", "0", "0", "1", "1", "1", "0", "0", "3"],
                ["4", "1", "1", "1", "1", "1", "0", "1", "6"],
                ["5", "1", "0", "1", "1", "0", "1", "0", "4"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 text-center text-gray-700 ${i === 8 ? "bg-gray-50 font-bold" : ""}`}>
                      {i > 0 && i < 8 ? (
                        cell === "1" ? <span className="text-red-500">1</span> : <span className="text-gray-300">0</span>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">* 1 = 해당 행위가 판결문에서 확인됨, 0 = 확인 안 됨. CC 합계 = 강압적 통제 지표 총합.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-2">납품 형태</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>코딩 결과 Excel 파일 (사건별 전체 변수)</li>
          <li>코딩 매뉴얼 (변수 정의, 코딩 기준, 예시)</li>
          <li>요약 통계표 (기술통계, 빈도표)</li>
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   연구 설계 결과 샘플
   ──────────────────────────────────────────────────── */

function ResearchDesignSample() {
  return (
    <div className="space-y-8">
      {/* 개요 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-base font-bold text-blue-900 mb-2">연구 설계 컨설팅 결과 예시</h3>
        <p className="text-sm text-blue-700">
          <strong>연구 주제:</strong> &quot;친밀한 파트너 폭력(IPV) 피해 경험이 정신건강에 미치는 영향 — 사회적 지지의 조절효과를 중심으로&quot;
        </p>
      </div>

      {/* 1. 문헌 탐색 결과 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
          문헌 탐색 결과
        </h4>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">검색 전략</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>- <strong>DB:</strong> Web of Science, PsycINFO, KCI, RISS</p>
              <p>- <strong>검색어:</strong> &quot;intimate partner violence&quot; AND (&quot;mental health&quot; OR &quot;depression&quot; OR &quot;PTSD&quot;) AND &quot;social support&quot;</p>
              <p>- <strong>기간:</strong> 2015-2024 (최근 10년)</p>
              <p>- <strong>결과:</strong> 총 847건 → 중복 제거 → 스크리닝 → <strong>최종 38편</strong> 선정</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">주요 선행연구 요약 (상위 5편)</p>
            <div className="space-y-3">
              {[
                { author: "Coker et al. (2021)", finding: "IPV 피해 여성의 우울 유병률이 비피해 여성 대비 3.2배 높음. 사회적 지지가 보호요인으로 작용." },
                { author: "김지영·이수정 (2022)", finding: "국내 IPV 피해자 대상 연구. 정서적 지지가 PTSD 증상 감소에 유의미한 매개효과 (β=-.34, p<.001)." },
                { author: "Lagdon et al. (2020)", finding: "메타분석 (k=52). IPV-우울 상관 r=.36. 사회적 지지의 조절효과 유의 (Q_between=8.72, p<.01)." },
                { author: "박수진 외 (2023)", finding: "사회적 지지의 하위요인별 분석. 정서적 지지 > 정보적 지지 > 물질적 지지 순으로 보호효과." },
                { author: "WHO (2021)", finding: "전 세계 여성 3명 중 1명이 IPV 경험. 정신건강 서비스 접근성이 핵심 정책과제." },
              ].map((ref, i) => (
                <div key={i} className="text-xs">
                  <p className="font-medium text-gray-800">{ref.author}</p>
                  <p className="text-gray-600 mt-0.5">{ref.finding}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">연구 갭(Research Gap)</p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li>국내 연구 중 사회적 지지의 <strong>조절효과</strong>를 검증한 연구 부재 (대부분 매개효과만 분석)</li>
              <li>사회적 지지의 <strong>하위유형별 차별적 효과</strong> 미검증</li>
              <li>온라인 IPV(디지털 폭력) 포함 연구 희소</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. 연구 방법 추천 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">2</span>
          연구 방법 추천
        </h4>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">연구 설계</p>
            <p className="text-sm text-gray-700">횡단적 서베이 연구 (Cross-sectional Survey Design)</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">연구 모형</p>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium">IPV 피해 경험</span>
                <span className="text-gray-400">&rarr;</span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">정신건강 (우울, PTSD, 불안)</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="text-green-600 font-medium">↕ 사회적 지지 (조절변수)</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">표본 설계</p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li><strong>대상:</strong> 만 19세 이상 성인 여성 중 지난 12개월 내 친밀한 관계 경험자</li>
              <li><strong>표집:</strong> 온라인 패널 조사 (할당표집: 연령×지역)</li>
              <li><strong>표본크기:</strong> 최소 384명 (G*Power 산출: f²=0.05, α=.05, power=.95, 예측변수 12개)</li>
              <li><strong>IRB:</strong> 기관생명윤리위원회 사전 승인 필수 (취약 집단 연구)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">측정 도구</p>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="px-3 py-2 text-left font-medium">변수</th>
                    <th className="px-3 py-2 text-left font-medium">척도</th>
                    <th className="px-3 py-2 text-center font-medium">문항수</th>
                    <th className="px-3 py-2 text-left font-medium">신뢰도</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["IPV 피해 (독립)", "CTS2-S (Straus, 2004)", "20", "α = .79~.86"],
                    ["우울 (종속)", "PHQ-9 (Kroenke, 1999)", "9", "α = .89"],
                    ["PTSD (종속)", "PCL-5 (Weathers, 2013)", "20", "α = .94"],
                    ["불안 (종속)", "GAD-7 (Spitzer, 2006)", "7", "α = .92"],
                    ["사회적 지지 (조절)", "MSPSS (Zimet, 1988)", "12", "α = .88~.91"],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-3 py-2 text-gray-700 ${j === 2 ? "text-center" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 통계 분석 방법 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</span>
          통계 분석 방법 및 도구 추천
        </h4>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {[
            {
              step: "1단계: 기술통계 및 정규성 검토",
              detail: "평균, 표준편차, 왜도, 첨도 확인. Shapiro-Wilk 검정. 상관분석 (Pearson r).",
              tool: "SPSS 29 또는 R (psych 패키지)",
            },
            {
              step: "2단계: 측정모형 검증 (확인적 요인분석)",
              detail: "CFA로 각 척도의 요인구조 확인. 적합도 기준: CFI>.95, RMSEA<.06, SRMR<.08.",
              tool: "Mplus 8.10 또는 R (lavaan 패키지)",
            },
            {
              step: "3단계: 위계적 회귀분석 (조절효과)",
              detail: "Step 1: 통제변수 (연령, 교육, 소득). Step 2: IPV 피해. Step 3: 사회적 지지. Step 4: IPV×사회적지지 상호작용항. 다중공선성 점검 (VIF<10).",
              tool: "SPSS PROCESS macro v4.2 (Model 1) 또는 R (interactions 패키지)",
            },
            {
              step: "4단계: 단순기울기 분석 (Simple Slope)",
              detail: "사회적 지지 수준별 (M-1SD, M, M+1SD) IPV→정신건강 효과 시각화. Johnson-Neyman 기법으로 유의 영역 확인.",
              tool: "PROCESS macro 자동 출력 또는 R (ggplot2 시각화)",
            },
            {
              step: "5단계: 하위유형별 추가 분석",
              detail: "사회적 지지의 3개 하위요인 (가족, 친구, 의미 있는 타인) 별로 조절효과 반복 검증.",
              tool: "동일 도구 반복 적용",
            },
          ].map((item, i) => (
            <div key={i} className="p-4">
              <p className="text-sm font-medium text-gray-800 mb-1">{item.step}</p>
              <p className="text-xs text-gray-600 mb-1">{item.detail}</p>
              <p className="text-[11px] text-purple-600 font-medium">도구: {item.tool}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 결과 제시 */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">4</span>
          결과 제시 상세
        </h4>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">기대되는 결과 테이블 (예시)</p>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="px-3 py-2 text-left font-medium">예측변수</th>
                    <th className="px-3 py-2 text-center font-medium">B</th>
                    <th className="px-3 py-2 text-center font-medium">SE</th>
                    <th className="px-3 py-2 text-center font-medium">β</th>
                    <th className="px-3 py-2 text-center font-medium">t</th>
                    <th className="px-3 py-2 text-center font-medium">p</th>
                    <th className="px-3 py-2 text-center font-medium">ΔR²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Step 1: 통제변수", "", "", "", "", "", ".08**"],
                    ["  연령", "-.12", ".04", "-.09", "-2.84", ".005", ""],
                    ["  교육수준", "-.18", ".06", "-.10", "-2.91", ".004", ""],
                    ["  소득수준", "-.15", ".05", "-.11", "-3.21", ".001", ""],
                    ["Step 2: IPV 피해", "", "", "", "", "", ".22***"],
                    ["  IPV 피해 점수", ".48", ".05", ".43", "9.82", "<.001", ""],
                    ["Step 3: 사회적 지지", "", "", "", "", "", ".06***"],
                    ["  사회적 지지", "-.31", ".05", "-.27", "-6.15", "<.001", ""],
                    ["Step 4: 상호작용", "", "", "", "", "", ".02**"],
                    ["  IPV × 사회적지지", "-.14", ".05", "-.11", "-2.97", ".003", ""],
                  ].map((row, i) => {
                    const isStep = row[0].startsWith("Step");
                    return (
                      <tr key={i} className={isStep ? "bg-gray-50" : "hover:bg-gray-50"}>
                        <td className={`px-3 py-2 text-gray-700 ${isStep ? "font-medium" : ""}`}>{row[0]}</td>
                        {row.slice(1).map((cell, j) => (
                          <td key={j} className={`px-3 py-2 text-center ${j === 5 ? "font-medium" : ""} text-gray-700`}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">* p&lt;.05, ** p&lt;.01, *** p&lt;.001. 종속변수: 우울(PHQ-9). N=420.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">결과 해석 가이드</p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li>IPV 피해 경험은 우울 수준을 유의하게 높임 (β=.43, p&lt;.001)</li>
              <li>사회적 지지는 우울 수준을 낮추는 직접 효과 (β=-.27, p&lt;.001)</li>
              <li><strong>IPV×사회적지지 상호작용항</strong>이 유의 (β=-.11, p=.003) → 조절효과 확인</li>
              <li>사회적 지지가 높은 집단에서 IPV의 부정적 효과가 <strong>완충</strong>됨</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">논문 구성 제안</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["서론", "문제제기 + 문헌고찰 + 연구가설 3개"],
                ["연구방법", "연구설계, 표본, 측정도구, 분석방법"],
                ["연구결과", "기술통계, CFA, 위계적 회귀, 조절효과 그래프"],
                ["논의", "결과 해석, 선행연구 비교, 한계점, 정책적 함의"],
              ].map(([title, desc]) => (
                <div key={title} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-800">{title}</p>
                  <p className="text-gray-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-2">납품 형태</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>연구 설계 보고서 (문헌 탐색 결과 + 연구 모형 + 분석 전략)</li>
          <li>참고문헌 목록 (APA 7th 형식)</li>
          <li>G*Power 표본크기 산출 결과</li>
          <li>통계 분석 코드 (R/SPSS syntax)</li>
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   샘플 데이터 정의
   ──────────────────────────────────────────────────── */

const serviceSamples: ServiceSample[] = [
  {
    key: "research-design",
    label: "연구 설계",
    description: "연구 주제 선정부터 연구 설계, 분석 방법 제안까지의 결과물 예시입니다.",
    files: [],
    inlineContent: <ResearchDesignSample />,
  },
  {
    key: "judgment",
    label: "판결문 분석",
    description: "판결문 수집, 변수 코딩, 코딩 결과 데이터 등 판결문 분석 결과물 예시입니다.",
    files: [],
    inlineContent: <JudgmentCodingSample />,
  },
  {
    key: "survey",
    label: "설문조사",
    description: "설문지 설계, 데이터 수집, 분석 보고서 등 설문조사 결과물 예시입니다.",
    files: [],
  },
  {
    key: "news",
    label: "뉴스/언론 보도",
    description: "키워드 기반 뉴스 수집 및 분석 결과물 예시입니다.",
    files: [],
  },
  {
    key: "quant",
    label: "계량분석",
    description: "기초통계, 회귀분석, 구조방정식 등 계량분석 결과물 예시입니다.",
    files: [],
  },
  {
    key: "text",
    label: "텍스트 분석",
    description: "토픽모델링, 감성분석, 워드클라우드 등 텍스트 분석 결과물 예시입니다.",
    files: [],
  },
];

/* ────────────────────────────────────────────────────
   페이지 컴포넌트
   ──────────────────────────────────────────────────── */

export default function SamplesPage() {
  const [activeService, setActiveService] = useState(serviceSamples[0].key);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const current = serviceSamples.find((s) => s.key === activeService) ?? serviceSamples[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f1a2e] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition-colors mb-4 inline-block">
            &larr; 메인으로
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">결과물 샘플</h1>
          <p className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto">
            각 서비스별로 이런 결과물을 받게 됩니다
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Service tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {serviceSamples.map((svc) => (
            <button
              key={svc.key}
              onClick={() => setActiveService(svc.key)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeService === svc.key
                  ? "bg-[#c49a2e] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#c49a2e]/50"
              }`}
            >
              {svc.label}
            </button>
          ))}
        </div>

        {/* Current service */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{current.label}</h2>
          <p className="text-sm text-gray-500 mb-8">{current.description}</p>

          {/* Inline content (if available) */}
          {current.inlineContent ? (
            current.inlineContent
          ) : current.files.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">샘플 준비 중입니다</p>
              <p className="text-gray-300 text-xs mt-1">곧 결과물 예시가 추가됩니다</p>
            </div>
          ) : (
            <div className="space-y-6">
              {current.files.filter((f) => f.type === "image").length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">미리보기</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {current.files.filter((f) => f.type === "image").map((f) => (
                      <div key={f.path} className="group">
                        <button onClick={() => setLightboxImg(f.path)} className="w-full relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 hover:border-[#c49a2e]/50 transition-colors cursor-zoom-in">
                          <Image src={f.path} alt={f.name} fill className="object-contain bg-gray-50 group-hover:scale-[1.02] transition-transform" />
                        </button>
                        <p className="text-xs text-gray-500 mt-2">{f.description || f.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {current.files.filter((f) => f.type === "pdf").length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">다운로드</h3>
                  <div className="space-y-2">
                    {current.files.filter((f) => f.type === "pdf").map((f) => (
                      <a key={f.path} href={f.path} download className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#c49a2e]/50 hover:bg-[#c49a2e]/5 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                          {f.description && <p className="text-xs text-gray-400 mt-0.5">{f.description}</p>}
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#c49a2e] border border-[#c49a2e]/30 rounded-lg group-hover:bg-[#c49a2e] group-hover:text-white transition-colors shrink-0">
                          PDF 다운로드
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">원하시는 서비스가 있으신가요?</p>
          <Link href="/dashboard" className="inline-flex px-6 py-3 bg-[#c49a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#b08a28] transition-colors shadow-sm">
            의뢰하러 가기
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <button onClick={() => setLightboxImg(null)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <Image src={lightboxImg} alt="확대 보기" width={1920} height={1080} className="object-contain w-full h-full max-h-[90vh]" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}
