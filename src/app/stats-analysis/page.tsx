"use client";

import { useState } from "react";
import Link from "next/link";
import CreditConfirmDialog from "@/components/CreditConfirmDialog";
import PageHeader from "@/components/PageHeader";

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
  { label: "맞춤 분석 추천", desc: "데이터에 적합한 분석 방법 추천" },
];

const resultTabs = ["분석결과", "시각화", "해석"] as const;

export default function StatsAnalysisPage() {
  const [activeDataTab, setActiveDataTab] = useState<(typeof dataTabs)[number]>("프로젝트 연결");
  const [activeResultTab, setActiveResultTab] = useState<(typeof resultTabs)[number]>("분석결과");
  const [selectedInstant, setSelectedInstant] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string[]>([]);
  const [requestDetail, setRequestDetail] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showExcelCreditDialog, setShowExcelCreditDialog] = useState(false);
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
    setShowExcelCreditDialog(false);
    setExcelExporting(true);
    setTimeout(() => {
      setExcelExporting(false);
      setExcelDone(true);
      setTimeout(() => setExcelDone(false), 3000);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>
      <PageHeader
        title="통계분석 / 시각화"
        subtitle="기술통계와 시각화는 바로 실행, 고급 분석은 의뢰 형태로 진행됩니다"
        detailTooltip={"📋 작업 순서:\n① 데이터 입력 (프로젝트 연결/파일 업로드/직접 입력)\n② 즉시 실행: 빈도분석·기술통계·교차표·시각화\n③ 또는 고급 분석 의뢰 (하단 폼)\n\n기초통계 (직접 실행):\n• 기술통계량 (평균, 표준편차, 분위수)\n• 빈도표, 교차표\n• 히스토그램, 박스플롯 시각화\n\n고급 분석 → 하단에서 의뢰 접수 가능"}
        breadcrumbs={[
          { label: "계량통계분석" },
          { label: "기초통계 및 시각화" },
        ]}
        iconBgClass="bg-rose-50"
        iconTextClass="text-rose-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Data Input */}
        <div className="lg:col-span-2 space-y-6">

          {/* Data Input */}
          <div className="bg-white rounded-xl border border-rose-200 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 bg-rose-50">
              <h2 className="font-semibold text-gray-900">데이터 입력</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex gap-1 mb-4 bg-gray-200 rounded-lg p-1">
                {dataTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDataTab(tab)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeDataTab === tab
                        ? "bg-white text-gray-900 shadow-md"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeDataTab === "프로젝트 연결" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기존 프로젝트 선택</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                    <option value="">프로젝트를 선택하세요</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">코딩이 완료된 프로젝트의 데이터를 분석에 사용합니다</p>
                </div>
              )}

              {activeDataTab === "파일 업로드" && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-1">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-gray-500">Excel (.xlsx), CSV 파일 지원</p>
                </div>
              )}

              {activeDataTab === "직접 입력" && (
                <textarea
                  rows={6}
                  placeholder={"데이터를 붙여넣기 하세요 (탭 또는 쉼표 구분)\n\n예:\n이름,나이,점수\n홍길동,25,85\n김철수,30,92"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono resize-none"
                />
              )}
            </div>
          </div>

          {/* Instant Analysis (기술통계/시각화) */}
          <div className="bg-white rounded-xl border border-rose-200 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 bg-rose-50 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">즉시 실행</h2>
                <p className="text-xs text-gray-500 mt-0.5">기술통계와 시각화를 바로 확인합니다</p>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {instantAnalyses.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => toggleInstant(a.label)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedInstant.includes(a.label)
                        ? "border-rose-400 bg-rose-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{a.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>
              <button
                disabled={selectedInstant.length === 0}
                className="w-full px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                분석 실행 ({selectedInstant.length}개 선택)
              </button>

              {/* Excel export button */}
              <button
                type="button"
                onClick={() => setShowExcelCreditDialog(true)}
                disabled={excelExporting}
                className="w-full px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {excelExporting ? "다운로드 준비 중..." : "기술통계표 Excel 내보내기"}
              </button>

              {/* Excel export success message */}
              {excelDone && (
                <div className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium text-center border border-emerald-200">
                  기술통계표 Excel 파일이 다운로드되었습니다.
                </div>
              )}
            </div>
          </div>

          {/* Request Analysis (고급 분석 의뢰) */}
          <div className="bg-white rounded-xl border border-rose-200 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 bg-rose-50 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">고급 분석 의뢰</h2>
                <p className="text-xs text-gray-500 mt-0.5">전문 분석이 필요한 경우 의뢰해주세요. 검토 후 결과를 전달합니다.</p>
              </div>
              <span className="text-[10px] font-medium bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">유료</span>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {requestAnalyses.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => toggleRequest(a.label)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedRequest.includes(a.label)
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{a.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">분석 요청사항</label>
                <textarea
                  rows={3}
                  value={requestDetail}
                  onChange={(e) => setRequestDetail(e.target.value)}
                  placeholder="구체적인 분석 요청사항을 입력하세요 (예: '처분유형별 징역 기간 차이를 ANOVA로 분석하고, 사후검정까지 부탁합니다')"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-sm text-rose-700">
                분석 종류와 데이터 규모에 따라 비용이 달라집니다. 의뢰 접수 후 견적을 안내해드립니다.
              </div>

              {requestSubmitted ? (
                <div className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium text-center border border-emerald-200">
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
          <div className="bg-white rounded-xl border border-rose-200 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 bg-rose-50">
              <h2 className="font-semibold text-gray-900">변수 선택</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500 text-center py-8">
                데이터를 로드하면 변수 목록이 표시됩니다
              </p>
              <div className="text-xs text-gray-500 space-y-2 border-t border-gray-200 pt-4">
                <p className="font-medium text-gray-700">변수 지정 방법:</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                  <span>종속변수</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  <span>독립변수</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                  <span>통제변수</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="bg-white rounded-xl border border-rose-200 shadow-md mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1 w-fit">
            {resultTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveResultTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeResultTab === tab
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm text-gray-500">분석 결과가 여기에 표시됩니다</p>
        </div>
      </div>

      {/* Excel Export Credit Dialog */}
      <CreditConfirmDialog
        isOpen={showExcelCreditDialog}
        onClose={() => setShowExcelCreditDialog(false)}
        onConfirm={handleExcelExport}
        serviceName="기술통계표 Excel 내보내기"
        creditCost={200}
        currentBalance={1000}
        loading={excelExporting}
      />
    </div>
  );
}
