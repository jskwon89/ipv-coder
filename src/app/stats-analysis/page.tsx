"use client";

import { useState } from "react";

const dataTabs = ["프로젝트 연결", "파일 업로드", "직접 입력"] as const;

const instantAnalyses = [
  { label: "빈도분석", desc: "범주형 변수의 빈도 및 비율" },
  { label: "기술통계", desc: "평균, 표준편차, 최소/최대, 중앙값" },
  { label: "교차표", desc: "두 범주형 변수 간 교차분석" },
  { label: "시각화", desc: "막대, 파이, 히스토그램, 박스플롯, 산점도" },
];

const requestAnalyses = [
  { label: "집단분석", desc: "GBTM 궤적, LCA, 군집분석" },
  { label: "생존분석", desc: "Cox 비례위험, Kaplan-Meier" },
  { label: "회귀분석", desc: "로지스틱, 다중회귀, 다수준" },
  { label: "구조방정식", desc: "SEM, 경로분석, 매개효과" },
  { label: "AI 분석 추천", desc: "데이터에 적합한 분석 자동 추천" },
];

const resultTabs = ["분석결과", "시각화", "해석"] as const;

export default function StatsAnalysisPage() {
  const [activeDataTab, setActiveDataTab] = useState<(typeof dataTabs)[number]>("프로젝트 연결");
  const [activeResultTab, setActiveResultTab] = useState<(typeof resultTabs)[number]>("분석결과");
  const [selectedInstant, setSelectedInstant] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string[]>([]);
  const [requestDetail, setRequestDetail] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [excelConfirmOpen, setExcelConfirmOpen] = useState(false);
  const [excelExporting, setExcelExporting] = useState(false);
  const [excelDone, setExcelDone] = useState(false);

  const toggleInstant = (label: string) => {
    setSelectedInstant((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const toggleRequest = (label: string) => {
    setSelectedRequest((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const handleRequestSubmit = () => {
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 3000);
  };

  const handleExcelExport = () => {
    setExcelConfirmOpen(false);
    setExcelExporting(true);
    setTimeout(() => {
      setExcelExporting(false);
      setExcelDone(true);
      setTimeout(() => setExcelDone(false), 3000);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">통계분석 / 시각화</h1>
        <p className="text-muted-foreground text-sm mt-1">기술통계와 시각화는 바로 실행, 고급 분석은 의뢰 형태로 진행됩니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Data Input */}
        <div className="lg:col-span-2 space-y-6">

          {/* Data Input */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">데이터 입력</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex gap-1 mb-4 bg-secondary/50 rounded-lg p-1">
                {dataTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDataTab(tab)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeDataTab === tab
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeDataTab === "프로젝트 연결" && (
                <div>
                  <label className="block text-sm font-medium mb-2">기존 프로젝트 선택</label>
                  <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">프로젝트를 선택하세요</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">코딩이 완료된 프로젝트의 데이터를 분석에 사용합니다</p>
                </div>
              )}

              {activeDataTab === "파일 업로드" && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <svg className="w-10 h-10 text-muted-foreground mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-muted-foreground mb-1">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-muted-foreground">Excel (.xlsx), CSV 파일 지원</p>
                </div>
              )}

              {activeDataTab === "직접 입력" && (
                <textarea
                  rows={6}
                  placeholder={"데이터를 붙여넣기 하세요 (탭 또는 쉼표 구분)\n\n예:\n이름,나이,점수\n홍길동,25,85\n김철수,30,92"}
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
                />
              )}
            </div>
          </div>

          {/* Instant Analysis (기술통계/시각화) */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold">즉시 실행</h2>
                <p className="text-xs text-muted-foreground mt-0.5">기술통계와 시각화를 바로 확인합니다</p>
              </div>
              <span className="text-[10px] font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">무료</span>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {instantAnalyses.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => toggleInstant(a.label)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedInstant.includes(a.label)
                        ? "border-green-500 bg-green-500/10"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>
              <button
                disabled={selectedInstant.length === 0}
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                분석 실행 ({selectedInstant.length}개 선택)
              </button>

              {/* Excel export button */}
              <button
                type="button"
                onClick={() => setExcelConfirmOpen(true)}
                disabled={excelExporting}
                className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {excelExporting ? "다운로드 준비 중..." : "기술통계표 Excel 내보내기"}
                <span className="text-[10px] font-medium bg-white/20 px-1.5 py-0.5 rounded-full">~50 크레딧</span>
              </button>

              {/* Excel export success message */}
              {excelDone && (
                <div className="w-full px-4 py-2.5 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium text-center">
                  기술통계표 Excel 파일이 다운로드되었습니다.
                </div>
              )}

              {/* Excel export confirmation dialog */}
              {excelConfirmOpen && (
                <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-foreground">
                    기술통계표 Excel 내보내기에 <span className="font-bold text-amber-400">50 크레딧</span>이 소모됩니다. 진행하시겠습니까?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setExcelConfirmOpen(false)}
                      className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleExcelExport}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      진행
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Request Analysis (고급 분석 의뢰) */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold">고급 분석 의뢰</h2>
                <p className="text-xs text-muted-foreground mt-0.5">전문 분석이 필요한 경우 의뢰해주세요. 검토 후 결과를 전달합니다.</p>
              </div>
              <span className="text-[10px] font-medium bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">유료</span>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {requestAnalyses.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => toggleRequest(a.label)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedRequest.includes(a.label)
                        ? "border-rose-500 bg-rose-500/10"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">분석 요청사항</label>
                <textarea
                  rows={3}
                  value={requestDetail}
                  onChange={(e) => setRequestDetail(e.target.value)}
                  placeholder="구체적인 분석 요청사항을 입력하세요 (예: '처분유형별 징역 기간 차이를 ANOVA로 분석하고, 사후검정까지 부탁합니다')"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-sm text-amber-300">
                분석 종류와 데이터 규모에 따라 비용이 달라집니다. 의뢰 접수 후 견적을 안내해드립니다.
              </div>

              {requestSubmitted ? (
                <div className="w-full px-4 py-2.5 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium text-center">
                  의뢰가 접수되었습니다. 검토 후 연락드리겠습니다.
                </div>
              ) : (
                <button
                  onClick={handleRequestSubmit}
                  disabled={selectedRequest.length === 0 && !requestDetail.trim()}
                  className="w-full px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  분석 의뢰 접수 ({selectedRequest.length}개 선택)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Variable Selection */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">변수 선택</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                데이터를 로드하면 변수 목록이 표시됩니다
              </p>
              <div className="text-xs text-muted-foreground space-y-2 border-t border-border pt-4">
                <p className="font-medium text-foreground">변수 지정 방법:</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                  <span>종속변수</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  <span>독립변수</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-500" />
                  <span>통제변수</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="bg-card rounded-xl border border-border mt-6">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 w-fit">
            {resultTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveResultTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeResultTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-12 text-center">
          <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm text-muted-foreground">분석 결과가 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  );
}
