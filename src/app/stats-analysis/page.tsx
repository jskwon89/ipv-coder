"use client";

import { useState } from "react";

const analysisTabs = ["분석결과", "시각화", "해석", "R코드"] as const;
const dataTabs = ["프로젝트 연결", "파일 업로드", "직접 입력"] as const;

const quickAnalyses = [
  { label: "기술통계", desc: "빈도, 평균, 표준편차, 교차표" },
  { label: "시각화", desc: "막대그래프, 파이차트, 히스토그램, 박스플롯, 산점도" },
  { label: "집단분석", desc: "GBTM 궤적, LCA, 군집분석" },
  { label: "생존분석", desc: "Cox 비례위험, Kaplan-Meier" },
  { label: "회귀분석", desc: "로지스틱, 다중회귀, 다수준" },
  { label: "AI 분석 추천", desc: "데이터에 적합한 분석 자동 추천" },
];

export default function StatsAnalysisPage() {
  const [activeDataTab, setActiveDataTab] = useState<(typeof dataTabs)[number]>("프로젝트 연결");
  const [activeResultTab, setActiveResultTab] = useState<(typeof analysisTabs)[number]>("분석결과");
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");

  const toggleAnalysis = (label: string) => {
    setSelectedAnalyses((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">통계분석/시각화</h1>
            <span className="text-[10px] font-medium bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">
              준비 중
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">데이터 분석 및 시각화 도구</p>
        </div>
      </div>

      {/* Pricing info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-300">분석 종류와 데이터 크기에 따라 크레딧이 소모됩니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Data Input + Analysis Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Input */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">데이터 입력</h2>
            </div>
            <div className="px-6 py-4">
              {/* Tabs */}
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

              {/* Tab content */}
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
                <div>
                  <textarea
                    rows={6}
                    placeholder="데이터를 붙여넣기 하세요 (탭 또는 쉼표 구분)&#10;&#10;예:&#10;이름,나이,점수&#10;홍길동,25,85&#10;김철수,30,92"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Analysis Selection */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">분석 선택</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Quick buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickAnalyses.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => toggleAnalysis(a.label)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedAnalyses.includes(a.label)
                        ? "border-rose-500 bg-rose-500/10"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>

              {/* Custom request */}
              <div>
                <label className="block text-sm font-medium mb-2">분석 요청사항</label>
                <textarea
                  rows={3}
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  placeholder="분석 요청사항을 입력하세요 (예: '처분유형별 징역 기간 차이를 분석해주세요')"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                disabled
                className="w-full px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                분석 실행
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Variable Selection */}
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
            {analysisTabs.map((tab) => (
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
