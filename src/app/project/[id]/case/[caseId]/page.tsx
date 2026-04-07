"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge, { type CaseStatus } from "@/components/StatusBadge";
import VariableSelector from "@/components/VariableSelector";
import PricingCalculator from "@/components/PricingCalculator";
import CreditConfirmDialog from "@/components/CreditConfirmDialog";
import { VARIABLE_GROUPS, estimateCost, getSelectedVariableCount } from "@/lib/variable-groups";

const ccItems = [
  "경제적 통제 (economic abuse)",
  "고립시키기 (isolation)",
  "감시/스토킹 (monitoring/stalking)",
  "위협/협박 (threats/intimidation)",
  "정서적 학대 (emotional abuse)",
  "자녀 이용 (using children)",
  "남성 특권 사용 (male privilege)",
  "성적 강압 (sexual coercion)",
  "부인/최소화/비난 (deny/minimize/blame)",
];

// Mock: change to "unavailable" to see the warning banner
const mockStatus: CaseStatus = "fetched";

const mockJudgmentText = `서울중앙지방법원
제 12 형사부

판    결

사    건  2024고단1234  상해
피 고 인  김○○ (남, 35세)
주    소  서울 서초구 ○○로 123
검    사  박○○
변 호 인  법무법인 ○○ 담당변호사 이○○
판결선고  2024. 3. 15.

주    문
피고인을 징역 8월에 처한다.
다만, 이 판결 확정일부터 2년간 위 형의 집행을 유예한다.

이    유

[범죄사실]
피고인은 피해자 이○○(여, 32세)의 전 남자친구로서,
2023. 12. 15. 22:00경 서울 서초구 ○○아파트 102동 503호
피해자의 주거지에서 피해자와 말다툼을 하던 중 격분하여
피해자의 얼굴과 팔 부위를 수회 때리고 밀쳐 넘어뜨려
피해자에게 약 3주간의 치료를 요하는 안면부 타박상 등의
상해를 가하였다.

[증거의 요지]
1. 피고인의 법정진술
2. 피해자 이○○에 대한 경찰 진술조서
3. 상해진단서
4. 현장 사진

[양형의 이유]
피고인이 피해자에게 상해를 가한 이 사건 범행은
그 죄질이 가볍지 않다.

다만, 피고인이 범행을 인정하고 반성하는 점,
피고인에게 동종 전과가 없는 점,
피해자와 합의에 이르지는 못하였으나 피해 회복을 위해
노력한 점 등을 참작하여 주문과 같이 형을 정한다.

판사  홍○○`;

// Default selection: basic + sentencing + cc groups
const defaultSelectedVars = VARIABLE_GROUPS
  .filter((g) => ["basic", "sentencing", "cc"].includes(g.id))
  .flatMap((g) => g.variables.map((v) => v.id));

export default function CaseDetailPage() {
  const params = useParams();
  const [ccChecked, setCcChecked] = useState<boolean[]>(new Array(9).fill(false));
  const [expandedIncidents, setExpandedIncidents] = useState<number[]>([1]);
  const [selectedVars, setSelectedVars] = useState<string[]>(defaultSelectedVars);
  const [customRequest, setCustomRequest] = useState("");
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [showPricingConfirm, setShowPricingConfirm] = useState(false);

  const textLength = mockJudgmentText.length;

  const toggleIncident = (n: number) => {
    setExpandedIncidents((prev) =>
      prev.includes(n) ? prev.filter((i) => i !== n) : [...prev, n]
    );
  };

  const pricingInfo = useMemo(() => {
    const varCount = getSelectedVariableCount(selectedVars);
    return estimateCost(textLength + customRequest.length, varCount);
  }, [selectedVars, customRequest, textLength]);

  const handleAiCoding = () => {
    setShowPricingConfirm(true);
  };

  const confirmAiCoding = () => {
    setShowPricingConfirm(false);
    // TODO: trigger actual AI coding
    alert("AI 자동 코딩을 시작합니다.");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">2024고단1234</h1>
          <StatusBadge status={mockStatus} showTooltip />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVariableSelector((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-secondary-foreground rounded-lg text-sm font-medium hover:opacity-80 transition-opacity border border-border"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            변수 설정
            <span className="bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {selectedVars.length}
            </span>
          </button>
          <button
            onClick={handleAiCoding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 자동 코딩
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            저장
          </button>
        </div>
      </div>

      {/* Unavailable warning banner */}
      {mockStatus === "unavailable" && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">판결문 미등록</h3>
              <p className="text-sm text-red-700 mt-1">
                이 판결문은 casenote/lbox에 미등록 상태입니다. 아래 절차에 따라 등록을 요청해주세요:
              </p>
              <ol className="text-sm text-red-700 mt-2 list-decimal list-inside space-y-1">
                <li>casenote.kr에 접속하여 로그인합니다.</li>
                <li>{"'판결문 등록 요청'"} 메뉴에서 사건번호를 입력합니다.</li>
                <li>등록 요청 후 3-5일 내에 확인 가능합니다.</li>
                <li>등록 완료 후 전문 확보 버튼을 클릭하여 다운로드합니다.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Variable Selector Panel (collapsible) */}
      {showVariableSelector && (
        <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4">
            <VariableSelector
              selectedVars={selectedVars}
              onSelectionChange={setSelectedVars}
              customRequest={customRequest}
              onCustomRequestChange={setCustomRequest}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PricingCalculator
                textLength={textLength}
                selectedVars={selectedVars}
                customRequest={customRequest}
              />
            </div>
          </div>
        </div>
      )}

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Full text viewer */}
        <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-amber-50 font-medium text-sm">
            판결문 전문
          </div>
          <div className="p-4 h-[calc(100vh-250px)] overflow-y-auto text-sm leading-relaxed font-mono whitespace-pre-wrap">
            {mockStatus === "unavailable" ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>판결문 전문이 아직 확보되지 않았습니다.</p>
              </div>
            ) : (
              <>{mockJudgmentText}</>
            )}
          </div>
        </div>

        {/* Right: Coding form */}
        <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-amber-50 font-medium text-sm">
            코딩 폼
          </div>
          <div className="p-4 h-[calc(100vh-250px)] overflow-y-auto space-y-6">
            {/* Section: 사건 기본정보 */}
            <FormSection title="사건 기본정보">
              <FormField label="법원" defaultValue="서울중앙지방법원" />
              <FormField label="사건번호" defaultValue="2024고단1234" />
              <FormField label="선고일" defaultValue="2024-03-15" type="date" />
            </FormSection>

            {/* Section: 피고인/피해자 정보 */}
            <FormSection title="피고인/피해자 정보">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="피고인 성별" defaultValue="남" />
                <FormField label="피고인 연령" defaultValue="35" type="number" />
                <FormField label="피해자 성별" defaultValue="여" />
                <FormField label="피해자 연령" defaultValue="32" type="number" />
              </div>
            </FormSection>

            {/* Section: 관계 특성 */}
            <FormSection title="관계 특성">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">관계 유형</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                    <option>배우자 (혼인)</option>
                    <option>동거인</option>
                    <option>연인</option>
                    <option>전 배우자</option>
                    <option>전 연인</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">동거 여부</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                    <option>예</option>
                    <option>아니오</option>
                    <option>불명</option>
                  </select>
                </div>
              </div>
            </FormSection>

            {/* Section: 강압적 통제 */}
            <FormSection title="강압적 통제 (CC)">
              <div className="space-y-2">
                {ccItems.map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ccChecked[i]}
                      onChange={() => {
                        const next = [...ccChecked];
                        next[i] = !next[i];
                        setCcChecked(next);
                      }}
                      className="w-4 h-4 rounded border-border"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </FormSection>

            {/* Section: 차수별 범행 */}
            <FormSection title="차수별 범행">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="border border-border rounded-lg overflow-hidden mb-2">
                  <button
                    onClick={() => toggleIncident(n)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <span>제 {n} 차 범행</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedIncidents.includes(n) ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedIncidents.includes(n) && (
                    <div className="p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">범행유형</label>
                          <select className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm">
                            <option value="">선택</option>
                            <option>폭행</option>
                            <option>상해</option>
                            <option>협박</option>
                            <option>감금</option>
                            <option>재물손괴</option>
                            <option>주거침입</option>
                            <option>스토킹</option>
                            <option>성폭력</option>
                            <option>살인미수</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">무기사용</label>
                          <select className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm">
                            <option value="">선택</option>
                            <option>없음</option>
                            <option>흉기</option>
                            <option>둔기</option>
                            <option>기타</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">상해 정도</label>
                        <select className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm">
                          <option value="">선택</option>
                          <option>경미 (2주 미만)</option>
                          <option>보통 (2~4주)</option>
                          <option>중 (4주 이상)</option>
                          <option>중상 (생명위험/불구)</option>
                          <option>사망</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">비고</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm"
                          placeholder="추가 사항"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </FormSection>

            {/* Section: 양형 결과 */}
            <FormSection title="양형 결과">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">주형</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                    <option>징역</option>
                    <option>금고</option>
                    <option>벌금</option>
                    <option>무죄</option>
                    <option>공소기각</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="형량 (개월)" defaultValue="8" type="number" />
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">집행유예</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                      <option>예</option>
                      <option>아니오</option>
                    </select>
                  </div>
                </div>
                <FormField label="집행유예 기간 (년)" defaultValue="2" type="number" />
              </div>
            </FormSection>

            {/* Section: 양형 이유 */}
            <FormSection title="양형 이유">
              <textarea
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm min-h-[120px] resize-y"
                defaultValue="피고인이 범행을 인정하고 반성하는 점, 동종 전과 없음, 피해 회복 노력"
                placeholder="양형 이유를 기록하세요..."
              />
            </FormSection>
          </div>
        </div>
      </div>

      {/* Pricing Confirmation Dialog */}
      <CreditConfirmDialog
        isOpen={showPricingConfirm}
        onClose={() => setShowPricingConfirm(false)}
        onConfirm={confirmAiCoding}
        serviceName="판결문 AI 코딩"
        creditCost={Math.ceil(pricingInfo.totalKRW / 10)}
        currentBalance={1000}
        details={[
          `선택된 변수: ${selectedVars.length}개`,
          `판결문 길이: ${textLength.toLocaleString("ko-KR")}자`,
          `예상 API 비용: $${pricingInfo.apiCost.toFixed(4)}`,
          `서비스 이용료: ${pricingInfo.totalKRW.toLocaleString("ko-KR")}원`,
        ]}
      />
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 pb-2 border-b border-border">{title}</h3>
      {children}
    </div>
  );
}

function FormField({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
      />
    </div>
  );
}
