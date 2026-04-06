"use client";

import { useState } from "react";

const presetScales = [
  { label: "PHQ-9 (우울)", items: 9, range: "0-3", ref: "Kroenke et al., 2001" },
  { label: "GAD-7 (불안)", items: 7, range: "0-3", ref: "Spitzer et al., 2006" },
  { label: "PCL-5 (PTSD)", items: 20, range: "0-4", ref: "Weathers et al., 2013" },
  { label: "AUDIT (음주)", items: 10, range: "0-4", ref: "Saunders et al., 1993" },
  { label: "사회적 지지 척도", items: 12, range: "1-5", ref: "Zimet et al., 1988" },
  { label: "자아존중감 척도", items: 10, range: "1-4", ref: "Rosenberg, 1965" },
  { label: "삶의 만족도", items: 5, range: "1-7", ref: "Diener et al., 1985" },
];

const outputTabs = ["데이터 미리보기", "기술통계", "상관행렬", "참고문헌"] as const;

interface CustomVariable {
  name: string;
  type: "연속" | "범주" | "리커트";
  desc: string;
}

export default function DataGenerationPage() {
  const [topic, setTopic] = useState("");
  const [sampleSize, setSampleSize] = useState(300);
  const [selectedScales, setSelectedScales] = useState<string[]>([]);
  const [paramMode, setParamMode] = useState<"literature" | "custom">("literature");
  const [activeOutputTab, setActiveOutputTab] = useState<(typeof outputTabs)[number]>("데이터 미리보기");
  const [customVars, setCustomVars] = useState<CustomVariable[]>([]);
  const [newVar, setNewVar] = useState<CustomVariable>({ name: "", type: "연속", desc: "" });

  const toggleScale = (label: string) => {
    setSelectedScales((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const addCustomVar = () => {
    if (!newVar.name.trim()) return;
    setCustomVars((prev) => [...prev, { ...newVar }]);
    setNewVar({ name: "", type: "연속", desc: "" });
  };

  const removeCustomVar = (index: number) => {
    setCustomVars((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">연구 설계 지원</h1>
            <span className="text-[10px] font-medium bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full">
              준비 중
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">검정력 분석, 시뮬레이션 데이터 생성, 설문/척도 설계 지원</p>
        </div>
      </div>

      {/* Info boxes */}
      <div className="space-y-3 mb-6">
        <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg px-4 py-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-cyan-300">
            문헌 기반 시뮬레이션 데이터를 생성합니다. 검정력 분석, 분석 파이프라인 테스트, 연구 설계 사전 검토 등에 활용할 수 있습니다
          </p>
        </div>
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-300">문헌 조사 + 자료 생성: ~200 크레딧</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Research Topic */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">연구 주제</h2>
            </div>
            <div className="px-6 py-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="IPV 피해자의 정신건강과 사회적 지지의 관계"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">연구 주제를 입력하면 AI가 관련 문헌을 기반으로 현실적인 자료를 생성합니다</p>
            </div>
          </div>

          {/* Scale / Variable Selection */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">척도/변수 설정</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Preset scales */}
              <div>
                <label className="block text-sm font-medium mb-2">표준 척도 선택</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presetScales.map((scale) => (
                    <button
                      key={scale.label}
                      onClick={() => toggleScale(scale.label)}
                      className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${
                        selectedScales.includes(scale.label)
                          ? "border-cyan-500 bg-cyan-900/20"
                          : "border-border hover:bg-[#0f1a2e]"
                      }`}
                    >
                      <div className="text-sm font-medium">{scale.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected scale details */}
              {selectedScales.length > 0 && (
                <div className="border border-border rounded-lg divide-y divide-border">
                  {selectedScales.map((label) => {
                    const scale = presetScales.find((s) => s.label === label);
                    if (!scale) return null;
                    return (
                      <div key={label} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{scale.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            문항수: {scale.items} | 응답범위: {scale.range} | {scale.ref}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleScale(label)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom variable add */}
              <div>
                <label className="block text-sm font-medium mb-2">사용자 정의 변수 추가</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVar.name}
                    onChange={(e) => setNewVar({ ...newVar, name: e.target.value })}
                    placeholder="변수명"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select
                    value={newVar.type}
                    onChange={(e) => setNewVar({ ...newVar, type: e.target.value as CustomVariable["type"] })}
                    className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="연속">연속</option>
                    <option value="범주">범주</option>
                    <option value="리커트">리커트</option>
                  </select>
                  <input
                    type="text"
                    value={newVar.desc}
                    onChange={(e) => setNewVar({ ...newVar, desc: e.target.value })}
                    placeholder="설명"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={addCustomVar}
                    className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* Custom variables list */}
              {customVars.length > 0 && (
                <div className="border border-border rounded-lg divide-y divide-border">
                  {customVars.map((v, i) => (
                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{v.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          유형: {v.type} {v.desc && `| ${v.desc}`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeCustomVar(i)}
                        className="text-muted-foreground hover:text-foreground p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Data Specification + Generation Options */}
        <div className="space-y-6">
          {/* Sample size */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">표본 크기</h2>
            </div>
            <div className="px-6 py-4">
              <input
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
                min={10}
                max={10000}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">생성할 응답자 수 (10~10,000)</p>
            </div>
          </div>

          {/* Generation Options */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">생성 옵션</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paramMode"
                  checked={paramMode === "literature"}
                  onChange={() => setParamMode("literature")}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium">문헌 기반 (국내외 연구 참조)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    AI가 관련 문헌을 검색하여 현실적인 파라미터를 설정합니다
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paramMode"
                  checked={paramMode === "custom"}
                  onChange={() => setParamMode("custom")}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium">사용자 지정 파라미터</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    평균, 표준편차, 상관행렬을 직접 입력합니다
                  </div>
                </div>
              </label>

              {paramMode === "custom" && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    척도/변수를 선택한 후 각 변수의 파라미터를 설정할 수 있습니다
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">평균 (Mean)</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">표준편차 (SD)</label>
                      <input
                        type="number"
                        placeholder="1.0"
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">상관행렬 (Correlation Matrix)</label>
                    <textarea
                      rows={3}
                      placeholder="1.0, 0.5, 0.3&#10;0.5, 1.0, 0.4&#10;0.3, 0.4, 1.0"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
                    />
                  </div>
                </div>
              )}

              <button
                disabled
                className="w-full px-4 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                자료 생성
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Preview */}
      <div className="bg-card rounded-xl border border-border mt-6">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#0f1a2e] rounded-lg p-1 w-fit">
            {outputTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOutputTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeOutputTab === tab
                    ? "bg-card text-foreground shadow-md shadow-black/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-[#0f1a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Excel
            </button>
            <button
              disabled
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-[#0f1a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CSV
            </button>
            <button
              disabled
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-[#0f1a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SPSS (.sav)
            </button>
          </div>
        </div>
        <div className="px-6 py-12 text-center">
          <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <p className="text-sm text-muted-foreground">생성된 자료가 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  );
}
