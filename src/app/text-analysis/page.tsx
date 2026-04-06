"use client";

import { useState } from "react";
import CreditConfirmDialog from "@/components/CreditConfirmDialog";
import PageHeader from "@/components/PageHeader";

/* ───── analysis type definitions ───── */

interface ColorStyles {
  cardOn: string;
  iconOn: string;
  badge: string;
  check: string;
}

interface AnalysisType {
  id: string;
  label: string;
  desc: string;
  credit: number;
  styles: ColorStyles;
  icon: React.ReactNode;
  options: React.ReactNode;
}

const colorMap: Record<string, ColorStyles> = {
  purple: {
    cardOn: "border-purple-500 bg-purple-50 ring-1 ring-purple-200",
    iconOn: "bg-purple-100 text-purple-600",
    badge: "bg-purple-50 text-purple-600",
    check: "text-purple-500",
  },
  blue: {
    cardOn: "border-blue-500 bg-blue-50 ring-1 ring-blue-200",
    iconOn: "bg-blue-100 text-blue-600",
    badge: "bg-blue-50 text-blue-600",
    check: "text-blue-500",
  },
  green: {
    cardOn: "border-green-500 bg-green-50 ring-1 ring-green-200",
    iconOn: "bg-green-100 text-green-600",
    badge: "bg-green-50 text-green-600",
    check: "text-green-500",
  },
  orange: {
    cardOn: "border-orange-500 bg-orange-50 ring-1 ring-orange-200",
    iconOn: "bg-orange-100 text-orange-600",
    badge: "bg-orange-50 text-orange-600",
    check: "text-orange-500",
  },
  teal: {
    cardOn: "border-teal-500 bg-teal-50 ring-1 ring-teal-200",
    iconOn: "bg-teal-100 text-teal-600",
    badge: "bg-teal-50 text-teal-600",
    check: "text-teal-500",
  },
  rose: {
    cardOn: "border-rose-500 bg-rose-50 ring-1 ring-rose-200",
    iconOn: "bg-rose-100 text-rose-600",
    badge: "bg-rose-50 text-rose-600",
    check: "text-rose-500",
  },
};

const dataTabs = ["텍스트 직접 입력", "파일 업로드", "프로젝트 연결"] as const;

/* ───── component ───── */

export default function TextAnalysisPage() {
  /* data input */
  const [activeDataTab, setActiveDataTab] = useState<(typeof dataTabs)[number]>("텍스트 직접 입력");
  const [textInput, setTextInput] = useState("");

  /* analysis selection & options */
  const [selected, setSelected] = useState<string[]>([]);

  // topic modelling
  const [topicCount, setTopicCount] = useState(5);

  // wordcloud
  const [maxWords, setMaxWords] = useState(100);
  const [removeStopwords, setRemoveStopwords] = useState(true);

  // sentiment
  const [sentimentUnit, setSentimentUnit] = useState<"문장별" | "문서별">("문장별");

  // keyword frequency
  const [topN, setTopN] = useState(20);
  const [ngram, setNgram] = useState(1);

  // keyword network
  const [minCooccurrence, setMinCooccurrence] = useState(3);

  // summarisation
  const [summaryLength, setSummaryLength] = useState<"짧게" | "보통" | "자세히">("보통");

  /* results */
  const [activeResultTab, setActiveResultTab] = useState<string | null>(null);
  const [analysisRun, setAnalysisRun] = useState(false);

  /* credit confirm dialog */
  const [showCreditDialog, setShowCreditDialog] = useState(false);

  /* helpers */
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const isSelected = (id: string) => selected.includes(id);

  /* ───── analysis cards config ───── */

  const analyses: AnalysisType[] = [
    {
      id: "topic",
      label: "토픽모델링",
      desc: "텍스트에서 주요 주제/토픽을 추출합니다",
      credit: 300,
      styles: colorMap.purple,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      options: (
        <div className="mt-3 space-y-2">
          <label className="text-xs font-medium text-gray-700">토픽 수: {topicCount}</label>
          <input
            type="range"
            min={2}
            max={20}
            value={topicCount}
            onChange={(e) => setTopicCount(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400"><span>2</span><span>20</span></div>
        </div>
      ),
    },
    {
      id: "wordcloud",
      label: "워드클라우드",
      desc: "빈출 단어를 시각적으로 표시합니다",
      credit: 200,
      styles: colorMap.blue,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      options: (
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">최대 단어 수</label>
            <div className="flex gap-1.5">
              {[50, 100, 200].map((n) => (
                <button
                  key={n}
                  onClick={() => setMaxWords(n)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    maxWords === n ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">불용어 제거</label>
            <button
              onClick={() => setRemoveStopwords(!removeStopwords)}
              className={`w-9 h-5 rounded-full relative transition-colors ${removeStopwords ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${removeStopwords ? "left-[18px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "sentiment",
      label: "감성분석",
      desc: "텍스트의 긍정/부정/중립 논조를 분석합니다",
      credit: 300,
      styles: colorMap.green,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      options: (
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-700 block mb-1">분석 단위</label>
          <div className="flex gap-1.5">
            {(["문장별", "문서별"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setSentimentUnit(u)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  sentimentUnit === u ? "border-green-500 bg-green-50 text-green-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "frequency",
      label: "키워드 빈도분석",
      desc: "주요 키워드의 출현 빈도를 분석합니다",
      credit: 100,
      styles: colorMap.orange,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      options: (
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">상위 N개</label>
            <div className="flex gap-1.5">
              {[10, 20, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setTopN(n)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    topN === n ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">n-gram</label>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setNgram(n)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    ngram === n ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {n}-gram
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "network",
      label: "키워드 네트워크",
      desc: "단어 간 연관 관계를 네트워크로 시각화합니다",
      credit: 300,
      styles: colorMap.teal,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      options: (
        <div className="mt-3 space-y-2">
          <label className="text-xs font-medium text-gray-700">최소 동시출현 횟수: {minCooccurrence}</label>
          <input
            type="range"
            min={2}
            max={10}
            value={minCooccurrence}
            onChange={(e) => setMinCooccurrence(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400"><span>2</span><span>10</span></div>
        </div>
      ),
    },
    {
      id: "summary",
      label: "문서 요약",
      desc: "긴 문서를 핵심 내용으로 요약합니다",
      credit: 200,
      styles: colorMap.rose,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      options: (
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-700 block mb-1">요약 길이</label>
          <div className="flex gap-1.5">
            {(["짧게", "보통", "자세히"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setSummaryLength(l)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  summaryLength === l ? "border-rose-500 bg-rose-50 text-rose-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const totalCredit = analyses.filter((a) => isSelected(a.id)).reduce((s, a) => s + a.credit, 0);

  const handleRun = () => {
    setShowCreditDialog(true);
  };

  const confirmRun = () => {
    setShowCreditDialog(false);
    setAnalysisRun(true);
    setActiveResultTab(selected[0] ?? null);
  };

  /* ───── placeholder results ───── */

  const placeholderResults: Record<string, React.ReactNode> = {
    topic: (
      <div className="space-y-3">
        {Array.from({ length: topicCount }, (_, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">T{i + 1}</span>
            <div>
              <div className="text-sm font-medium text-gray-900">토픽 {i + 1}</div>
              <div className="text-xs text-gray-400 mt-0.5">키워드: 폭행, 상해, 피해자, 협박, 가정폭력, 징역, 집행유예, ...</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.max(20, 90 - i * 15)}%` }} /></div>
            </div>
          </div>
        ))}
      </div>
    ),
    wordcloud: (
      <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <svg className="w-16 h-16 text-blue-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <p className="text-sm text-gray-400">워드클라우드 시각화 영역</p>
          <p className="text-xs text-gray-400 mt-1">최대 {maxWords}개 단어 표시 | 불용어 제거: {removeStopwords ? "ON" : "OFF"}</p>
        </div>
      </div>
    ),
    sentiment: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">23%</div>
            <div className="text-xs text-gray-400 mt-1">긍정</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">52%</div>
            <div className="text-xs text-gray-400 mt-1">중립</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">25%</div>
            <div className="text-xs text-gray-400 mt-1">부정</div>
          </div>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div className="bg-green-500 h-full" style={{ width: "23%" }} />
          <div className="bg-gray-400 h-full" style={{ width: "52%" }} />
          <div className="bg-red-500 h-full" style={{ width: "25%" }} />
        </div>
        <p className="text-xs text-gray-400">분석 단위: {sentimentUnit}</p>
      </div>
    ),
    frequency: (
      <div className="space-y-2">
        {["폭행", "피해자", "상해", "협박", "징역", "집행유예", "가정폭력", "재범", "보호", "처분"].slice(0, Math.min(10, topN)).map((w, i) => (
          <div key={w} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
            <span className="text-sm font-medium text-gray-900 w-20">{w}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.max(10, 100 - i * 10)}%` }} />
            </div>
            <span className="text-xs text-gray-400 w-10 text-right">{Math.round(150 - i * 12)}</span>
          </div>
        ))}
        <p className="text-xs text-gray-400 mt-2">n-gram: {ngram} | 상위 {topN}개</p>
      </div>
    ),
    network: (
      <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <svg className="w-16 h-16 text-teal-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm text-gray-400">키워드 네트워크 시각화 영역</p>
          <p className="text-xs text-gray-400 mt-1">최소 동시출현 {minCooccurrence}회</p>
        </div>
      </div>
    ),
    summary: (
      <div className="bg-gray-100 rounded-lg p-5">
        <p className="text-sm leading-relaxed text-gray-700">
          본 판결문은 가정폭력 사건에 대한 것으로, 피고인은 배우자에 대한 폭행 및 상해 혐의로 기소되었습니다.
          법원은 피해자의 진술과 의료 기록을 바탕으로 유죄를 인정하였으며, 재범 위험성과 피해자 보호의 필요성을 고려하여
          징역형의 집행유예를 선고하였습니다. 보호관찰과 사회봉사명령이 부과되었습니다.
        </p>
        <p className="text-xs text-gray-400 mt-3">요약 길이: {summaryLength}</p>
      </div>
    ),
  };

  /* ─────────────── render ─────────────── */

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="텍스트 분석"
        subtitle="판결문, 기사, 문서 등의 텍스트를 분석합니다"
        breadcrumbs={[
          { label: "계량통계분석" },
          { label: "텍스트 분석" },
        ]}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      {/* ── Data Input ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">데이터 입력</h2>
        </div>
        <div className="px-6 py-4">
          {/* tabs */}
          <div className="flex gap-1 mb-4 bg-gray-200 rounded-lg p-1">
            {dataTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDataTab(tab)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeDataTab === tab
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* tab content */}
          {activeDataTab === "텍스트 직접 입력" && (
            <textarea
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={"분석할 텍스트를 여기에 붙여넣기 하세요.\n\n판결문 전문, 기사 본문, 기타 문서 등"}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/20 focus:border-[#c49a2e] font-mono resize-none"
            />
          )}

          {activeDataTab === "파일 업로드" && (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center hover:border-[#c49a2e]/40 transition-colors cursor-pointer">
              <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-400 mb-1">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-400">TXT, PDF, Excel (.xlsx) 파일 지원</p>
            </div>
          )}

          {activeDataTab === "프로젝트 연결" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기존 프로젝트 선택</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/20 focus:border-[#c49a2e]">
                <option value="">프로젝트를 선택하세요</option>
              </select>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">분석 대상 필드</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/20 focus:border-[#c49a2e]">
                  <option value="">필드를 선택하세요</option>
                  <option value="sentencing_text">판결문 전문 (sentencing_text)</option>
                  <option value="article_body">기사 본문</option>
                </select>
              </div>
              <p className="text-xs text-gray-400 mt-2">코딩이 완료된 프로젝트의 텍스트 데이터를 분석에 사용합니다</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Analysis Type Selection ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">분석 유형 선택</h2>
          <p className="text-xs text-gray-400 mt-0.5">실행할 분석을 선택하세요. 복수 선택 가능합니다.</p>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analyses.map((a) => {
              const on = isSelected(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`text-left px-4 py-4 rounded-xl border-2 transition-all ${
                    on
                      ? a.styles.cardOn
                      : "border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${on ? a.styles.iconOn : "bg-gray-200 text-gray-400"}`}>
                      {a.icon}
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.styles.badge}`}>
                      ~{a.credit} 크레딧
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      {a.label}
                      {on && (
                        <svg className={`w-4 h-4 ${a.styles.check}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{a.desc}</div>
                  </div>
                  {/* expanded options */}
                  {on && <div onClick={(e) => e.stopPropagation()}>{a.options}</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom: Run button ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md mb-6">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="font-medium text-gray-900">{selected.length}개</span> 분석 선택됨
          </div>
          <button
            onClick={handleRun}
            disabled={selected.length === 0}
            className="px-6 py-2.5 bg-[#c49a2e] text-white rounded-lg text-sm font-medium hover:bg-[#d4a843] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            분석 실행
          </button>
        </div>
      </div>

      {/* ── Results Area ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {analysisRun && selected.length > 0 ? (
            <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1 w-fit overflow-x-auto">
              {selected.map((id) => {
                const a = analyses.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveResultTab(id)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeResultTab === id
                        ? "bg-white text-gray-900 shadow-md"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-900">분석 결과</span>
          )}
          {analysisRun && (
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              결과 다운로드 (Excel/PDF)
            </button>
          )}
        </div>
        <div className="px-6 py-8">
          {analysisRun && activeResultTab ? (
            placeholderResults[activeResultTab] ?? (
              <p className="text-sm text-gray-400 text-center">결과를 불러오는 중...</p>
            )
          ) : (
            <div className="text-center py-4">
              <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-400">분석을 선택하고 실행하면 결과가 여기에 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Credit Confirm Dialog */}
      <CreditConfirmDialog
        isOpen={showCreditDialog}
        onClose={() => setShowCreditDialog(false)}
        onConfirm={confirmRun}
        serviceName="텍스트 분석"
        creditCost={totalCredit}
        currentBalance={1000}
        details={selected.map((id) => {
          const a = analyses.find((x) => x.id === id)!;
          return `${a.label}: ~${a.credit} 크레딧`;
        })}
      />
    </div>
  );
}
