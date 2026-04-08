"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const analysisTypes = [
  "인터뷰 분석",
  "관찰 분석",
  "주제분석(Thematic Analysis)",
  "근거이론(Grounded Theory)",
  "내러티브 분석",
  "담론분석",
  "내용분석",
  "기타",
];

const dataFormatOptions = [
  "인터뷰 녹취록",
  "관찰 기록",
  "문서/텍스트",
  "영상/음성",
  "기타",
];

export default function QualAnalysisPage() {
  const [email, setEmail] = useState("");
  const [analysisType, setAnalysisType] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataFormat, setDataFormat] = useState("");
  const [analysisGoal, setAnalysisGoal] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !analysisType) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/qual-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          analysisType,
          dataDescription: dataDescription.trim(),
          dataFormat,
          analysisGoal: analysisGoal.trim(),
          additionalNotes: additionalNotes.trim(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      console.error("의뢰 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>
      <PageHeader
        title="질적분석 의뢰"
        subtitle="인터뷰, 관찰, 문서 등 질적 데이터 분석을 의뢰합니다"
        detailTooltip={"📋 요청 순서:\n① 분석 유형·데이터 형식 선택\n② 데이터 설명·분석 목표 작성\n③ 이메일·추가 요청사항 입력 → 의뢰 접수\n④ 결과 확인에서 진행 상황·채팅\n\n지원 유형:\n• 주제분석 (Thematic Analysis)\n• 근거이론 (Grounded Theory)\n• 내러티브·담론·내용분석\n• 인터뷰·관찰 데이터 분석"}
        breadcrumbs={[
          { label: "데이터 분석" },
          { label: "질적분석" },
        ]}
        iconBgClass="bg-amber-50"
        iconTextClass="text-[#c49a2e]"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        }
      />

      {/* Success banner */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-800">질적분석 의뢰가 접수되었습니다</h3>
              <p className="text-sm text-green-700 mt-1">
                담당자 검토 후 결과를 제공해 드리겠습니다. 진행 상황은 결과 확인 페이지에서 확인하실 수 있습니다.
              </p>
              <Link
                href="/qual-results"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#c49a2e] text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors"
              >
                결과 확인 페이지로 이동
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Analysis settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">분석 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              분석 유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            >
              <option value="">선택하세요</option>
              {analysisTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">데이터 형식</label>
            <select
              value={dataFormat}
              onChange={(e) => setDataFormat(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            >
              <option value="">선택하세요</option>
              {dataFormatOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">데이터 설명</label>
            <textarea
              value={dataDescription}
              onChange={(e) => setDataDescription(e.target.value)}
              rows={3}
              placeholder="보유하신 데이터의 내용, 규모, 수집 방법 등을 설명해주세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">분석 목표</label>
            <textarea
              value={analysisGoal}
              onChange={(e) => setAnalysisGoal(e.target.value)}
              rows={3}
              placeholder="분석을 통해 알고자 하는 것, 연구 질문 등을 기술해주세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">의뢰 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="결과를 받을 이메일 주소"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">추가 요청사항</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder="추가적으로 요청하실 사항이 있으시면 작성해주세요."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Link
          href="/qual-results"
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          이전 의뢰 결과 확인
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting || !email.trim() || !analysisType}
          className="px-8 py-3 bg-[#c49a2e] text-white rounded-lg text-sm font-semibold hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "제출 중..." : "질적분석 의뢰하기"}
        </button>
      </div>
    </div>
  );
}
