"use client";

import Link from "next/link";

interface TierRow {
  tier: string;
  label: string;
  methods: string;
  domestic: string;
  international: string;
  highlight?: boolean;
}

const tiers: TierRow[] = [
  {
    tier: "Tier 1",
    label: "기초 분석",
    methods: "빈도 · 기술통계 · 신뢰도 · 상관 · t검정 · ANOVA · 교차분석 · 단순회귀",
    domestic: "50,000 ~ 100,000",
    international: "150,000 ~ 250,000",
  },
  {
    tier: "Tier 2",
    label: "중급 분석",
    methods: "다중회귀 · 위계적 회귀 · 로지스틱 · 매개·조절(PROCESS) · 조절된 매개 · CFA",
    domestic: "150,000 ~ 250,000",
    international: "350,000 ~ 500,000",
  },
  {
    tier: "Tier 3",
    label: "고급 분석 — A",
    methods: "구조방정식(SEM · AMOS · Mplus) · 다층모형(HLM · MLM) · 잠재계층(LCA / LTA)",
    domestic: "300,000 ~ 500,000",
    international: "600,000 ~ 900,000",
  },
  {
    tier: "Tier 4",
    label: "고급 분석 — B",
    methods: "생존분석(Kaplan-Meier · Cox · PWP) · 인과추론(PSM · IPTW · DiD) · 메타분석",
    domestic: "500,000 ~ 800,000",
    international: "1,000,000 ~ 1,500,000",
  },
  {
    tier: "Tier 5",
    label: "전문 연구",
    methods: "토픽모델링(LDA) · 텍스트마이닝 · 머신러닝 · 베이지안 · 네트워크분석",
    domestic: "별도 견적",
    international: "별도 견적",
    highlight: true,
  },
];

const dataServices = [
  {
    name: "설문조사 설계 · 수집",
    desc: "문항 설계 · 응답자 모집 (50,000원 기본 + 문항당 50원 + 응답자당 200원)",
    price: "100,000 ~ 500,000",
  },
  {
    name: "판결문 수집",
    desc: "대법원·각 법원 판결문 검색·수집·텍스트 정제",
    price: "50,000 ~ 200,000",
  },
  {
    name: "판결문 코딩",
    desc: "코딩북 작성 50,000 + 사례별 코딩",
    price: "사례당 1,000원",
  },
  {
    name: "뉴스 · 언론 보도 수집",
    desc: "키워드 기반 뉴스 크롤링 · 정제 · 코딩 (네이버 · 빅카인즈 등)",
    price: "50,000 ~ 150,000",
  },
  {
    name: "공공DB 가공",
    desc: "KOSIS · 국민건강영양조사 · 표본코호트 · 복지패널 등 추출 · 병합 · 전처리",
    price: "100,000 ~ 300,000",
  },
];

const supportServices = [
  {
    name: "영문 결과 기술",
    desc: "학술지 투고용 Method · Results 영문 작성 (영문 교정은 별도)",
    price: "100,000 ~ 200,000",
  },
  {
    name: "IRB 자문",
    desc: "연구계획서 · 동의서 통계 파트 검토 및 보완",
    price: "50,000 ~ 100,000",
  },
  {
    name: "국제 학술지 투고 지원",
    desc: "저널 추천 · 커버레터 · 리뷰어 응답 (무기한 A/S 포함)",
    price: "별도 견적",
  },
];

const surcharges = [
  { name: "급행료", cond: "의뢰일로부터 7일 이내 1차 결과 보고 요청", rate: "+ 50%" },
  { name: "연구비 처리", cond: "세금계산서 발행 / 기관 연구비 결제", rate: "+ 20%" },
  { name: "재분석 · 리비전", cond: "1차 결과 확정 후 모형 변경, 변수 추가 (리뷰어 응답은 무기한 A/S 적용)", rate: "+ 50%" },
  { name: "심야 · 주말 작업", cond: "긴급 의뢰로 야간/주말 집중 작업이 필요한 경우", rate: "+ 30%" },
];

const consultationFees = [
  { name: "무료 상담", desc: "연구문제·데이터 적합성 검토 및 분석 방법 파악 (30분 내)", price: "무료" },
  { name: "연구설계 자문", desc: "가설·모형·표본·변수 설계 단계 1:1 컨설팅", price: "시간당 50,000" },
  { name: "메서드 튜토리얼", desc: "PWP · LCA · 구조방정식 등 특정 기법 1:1 학습 지도", price: "시간당 100,000" },
];

const promises = [
  { num: "01", title: "범죄분석 전공 데이터분석 전문 박사", desc: "단순 통계 대행이 아닌, 연구설계부터 분석 전략까지 박사급 연구자가 직접 수행합니다." },
  { num: "02", title: "다수의 SSCI · KCI 게재 경험", desc: "국제 학술지 심사 기준에 맞는 분석과 결과 보고. 심사위원 지적을 미리 대비합니다." },
  { num: "03", title: "기초부터 고급 분석까지", desc: "회귀 · 구조방정식 · 생존분석 · LCA · 다층모형 · IPTW · 토픽모델링까지 사회과학 모든 통계 분석 활용." },
  { num: "04", title: "논문에 바로 쓸 수 있는 결과물", desc: "논문 양식 결과표 + 결과 해석 기술문 제공. 출력 결과만 전달하지 않습니다." },
  { num: "05", title: "심사 대응 자문 + 무기한 A/S", desc: "심사위원 코멘트 기반 수정 전략 제안. 분석 완료 후 질문은 무기한 답변드립니다." },
];

const steps = [
  { step: "01", title: "무료 상담", desc: "연구문제 · 데이터\n분석 방법 파악" },
  { step: "02", title: "견적 협의", desc: "범위 확정\n일정 조율 · 결제" },
  { step: "03", title: "분석 진행", desc: "중간 진행\n상황 공유" },
  { step: "04", title: "결과 전달", desc: "결과표 + 해석\n기술문 + 출력파일" },
  { step: "05", title: "무기한 A/S", desc: "질의응답\n수정 반영", highlight: true },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <header className="border-b border-gray-300 pb-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-teal-700">PRIMER RESEARCH LAB · 논문 통계분석 전문</span>
            <span className="text-xs text-gray-400 tracking-widest">PRICING SHEET · v.2026.05</span>
          </div>
          <p className="text-sm font-semibold text-teal-700 tracking-wide mb-2">PRICING · 2026</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">논문 통계분석 분석료 안내</h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            범죄분석 전공 데이터분석 전문 박사가 직접 분석합니다. 사회과학 · 보건 · 의료 분야 — 학위논문, KCI 학술지, SSCI 국제 저널 모두 가능. 분석 난이도와 데이터 특성에 따른 합리적이고 투명한 가격을 운영합니다.
          </p>
        </header>

        {/* 01. 상담 및 견적 */}
        <Section number="01" title="상담 및 견적">
          <PriceTable rows={consultationFees.map((c) => ({ left: c.name, mid: c.desc, right: c.price }))} />
        </Section>

        {/* 02. 분석료 — Tier */}
        <Section number="02" title="분석료 — 난이도별 기본 단가" subtitle="(단위: 원)">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            여러 Tier 분석이 함께 필요한 경우, 가장 높은 Tier를 기준으로 산정하며 하위 Tier 분석은 50% 감면됩니다. Tier가 올라가면 하위 Tier 모든 분석이 포함됩니다.
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide w-32">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">주요 분석방법</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide w-40">학위 · 국문지</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide w-40">SSCI / SCI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tiers.map((t) => (
                  <tr key={t.tier} className="hover:bg-slate-50">
                    <td className="px-4 py-4 align-top">
                      <div className={`text-sm font-bold ${t.highlight ? "text-teal-700" : "text-gray-900"}`}>{t.tier}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 leading-relaxed">{t.methods}</td>
                    <td className={`px-4 py-4 text-right text-sm whitespace-pre-line ${t.highlight ? "font-bold text-teal-700" : "font-semibold text-gray-900"}`}>
                      {t.domestic.replace(" ~ ", "\n~ ")}
                    </td>
                    <td className={`px-4 py-4 text-right text-sm whitespace-pre-line ${t.highlight ? "font-bold text-teal-700" : "font-semibold text-gray-900"}`}>
                      {t.international.replace(" ~ ", "\n~ ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 03. 자료 수집·가공 */}
        <Section number="03" title="자료 수집 · 가공" subtitle="(별도 의뢰 가능)">
          <PriceTable rows={dataServices.map((d) => ({ left: d.name, mid: d.desc, right: d.price }))} />
        </Section>

        {/* 04. 결과 보강 */}
        <Section number="04" title="결과 보강" subtitle="(선택)">
          <PriceTable rows={supportServices.map((s) => ({ left: s.name, mid: s.desc, right: s.price }))} />
        </Section>

        {/* 05. 부가 옵션 */}
        <Section number="05" title="부가 옵션 및 가산 규정">
          <PriceTable
            headers={["옵션", "적용 조건", "가산율"]}
            rows={surcharges.map((s) => ({ left: s.name, mid: s.cond, right: s.rate }))}
          />
        </Section>

        {/* 06. 결제 및 환불 */}
        <Section number="06" title="결제 및 환불 정책">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100 rounded-lg p-6 border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">결제 일정</h3>
              <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                <li>• 학위논문 — 선불 50% / 잔금 50% (예심·본심 통과 후)</li>
                <li>• 학술지 · 기관 — 선불 30% / 잔금 70% (1차 결과 전달 후)</li>
                <li>• 결제 수단 — 계좌이체 · 카드 · 세금계산서 발행 가능</li>
              </ul>
              <h3 className="text-sm font-bold text-gray-900 mt-5 mb-3">수정 · A/S 정책</h3>
              <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                <li>• <span className="font-semibold text-teal-700">무기한 A/S</span> — 분석 완료 후 질문은 무기한 답변</li>
                <li>• 심사위원 코멘트 기반 수정 전략 자문 포함</li>
                <li>• 모형 변경 · 변수 추가 · 데이터 변경은 재분석 (제05조)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">환불 규정</h3>
              <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                <li>• 분석 착수 전 — <span className="font-semibold">100% 환불</span></li>
                <li>• 1차 결과물 전달 전 — <span className="font-semibold">50% 환불</span></li>
                <li>• 1차 결과물 전달 후 — 환불 불가 (무기한 A/S 적용)</li>
              </ul>
              <h3 className="text-sm font-bold text-gray-900 mt-5 mb-3">데이터 보안</h3>
              <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                <li>• 모든 의뢰 건은 NDA 체결 후 진행</li>
                <li>• 데이터 · 결과물은 암호화 저장</li>
                <li>• 종료 후 30일 이내 자동 파기, 요청 시 즉시 삭제</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 07. 진행 절차 */}
        <Section number="07" title="서비스 진행 절차" subtitle="— 5단계">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((s) => (
              <div key={s.step} className={`rounded-lg p-4 border text-center ${s.highlight ? "bg-teal-50 border-teal-200" : "bg-white border-gray-200"}`}>
                <div className={`text-xs font-bold tracking-wide mb-2 ${s.highlight ? "text-teal-700" : "text-gray-500"}`}>STEP {s.step}</div>
                <div className={`text-sm font-bold mb-1.5 ${s.highlight ? "text-teal-700" : "text-gray-900"}`}>{s.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{s.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 08. WHY PRIMER */}
        <Section number="08" title="WHY PRIMER — 5가지 약속">
          <div className="space-y-3">
            {promises.map((p) => (
              <div key={p.num} className="flex gap-4 items-start bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <div className="text-xl font-bold text-teal-600 shrink-0 w-8">{p.num}</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 일러두기 */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-bold text-gray-700">일러두기.</span> 본 가격표는 표준 의뢰 기준입니다. 분석 복잡도, 데이터 규모(케이스 수 · 변수 수), 결과물 형식, 납기, 그리고 의뢰 시점의 작업량에 따라 견적은 조정될 수 있습니다. 정확한 견적은 무료 상담 후 데이터 검토를 거쳐 1~2영업일 이내 송부됩니다.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-teal-50 border border-teal-200 rounded-xl p-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">먼저 무료 상담을 받아보세요</h3>
              <p className="text-sm text-gray-600">30분 무료 상담 후 1~2영업일 이내 정확한 견적 송부</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/consultation" className="inline-flex items-center px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                간편 상담 신청
              </Link>
              <Link href="/contact" className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Section({ number, title, subtitle, children }: { number: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">{number}</div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">
        {title}
        {subtitle && <span className="text-base font-normal text-gray-500 ml-2">{subtitle}</span>}
      </h2>
      {children}
    </section>
  );
}

function PriceTable({ headers, rows }: { headers?: string[]; rows: { left: string; mid: string; right: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        {headers && (
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2.5 text-left text-xs font-semibold w-44">{headers[0]}</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold">{headers[1]}</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold w-44">{headers[2]}</th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-semibold text-gray-900 w-44 align-top whitespace-nowrap">{r.left}</td>
              <td className="px-4 py-3 text-sm text-gray-600 leading-relaxed">{r.mid}</td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-teal-700 align-top whitespace-nowrap">{r.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
