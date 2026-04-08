"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const dataFormats = ["SPSS", "SAS", "Stata", "R", "Excel", "CSV"];

const transformationOptions = [
  "변수 리코딩",
  "데이터 병합",
  "결측치 처리",
  "이상치 처리",
  "더미변수 생성",
  "역코딩",
  "척도 합산",
  "데이터 재구조화(wide↔long)",
  "기타",
];

export default function DataTransformPage() {
  const [email, setEmail] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataFormat, setDataFormat] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [transformationDetail, setTransformationDetail] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (!email.trim() || !dataDescription.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/data-transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          dataDescription: dataDescription.trim(),
          dataFormat,
          currentState: currentState.trim(),
          transformationTypes: JSON.stringify(selectedTypes),
          transformationDetail: transformationDetail.trim(),
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
        title="데이터 전처리 의뢰"
        subtitle="데이터 변환, 리코딩, 병합 등 전처리 작업을 의뢰합니다"
        detailTooltip={"📋 요청 순서:\n① 데이터 설명·형식·현재 상태 입력\n② 전처리 유형 선택 (리코딩/병합/결측치 등)\n③ 상세 변환 요청사항 작성\n④ 이메일 입력 → 의뢰 접수\n⑤ 결과 확인에서 진행 상황·채팅\n\n지원 작업:\n• 변수 리코딩 (범주 재분류, 연속→범주)\n• 데이터 병합 (merge, append)\n• 결측치/이상치 처리\n• 더미변수·역코딩·척도 합산\n• wide↔long 변환"}
        breadcrumbs={[
          { label: "데이터 분석" },
          { label: "데이터 전처리" },
        ]}
        iconBgClass="bg-amber-50"
        iconTextClass="text-[#c49a2e]"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
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
              <h3 className="font-semibold text-green-800">전처리 의뢰가 접수되었습니다</h3>
              <p className="text-sm text-green-700 mt-1">
                담당자 검토 후 결과를 제공해 드리겠습니다. 진행 상황은 결과 확인 페이지에서 확인하실 수 있습니다.
              </p>
              <Link
                href="/data-transform-results"
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

      {/* Data description */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">데이터 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              데이터 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={dataDescription}
              onChange={(e) => setDataDescription(e.target.value)}
              rows={3}
              placeholder="데이터의 내용, 규모, 변수 구성 등을 설명해주세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">데이터 형식</label>
            <select
              value={dataFormat}
              onChange={(e) => setDataFormat(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            >
              <option value="">선택하세요</option>
              {dataFormats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 데이터 상태</label>
            <input
              type="text"
              value={currentState}
              onChange={(e) => setCurrentState(e.target.value)}
              placeholder="예: 결측치 많음, wide format 등"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            />
          </div>
        </div>
      </div>

      {/* Transformation type */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">전처리 유형</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {transformationOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleType(opt)}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                selectedTypes.includes(opt)
                  ? "border-[#c49a2e] bg-amber-50 text-[#c49a2e]"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  selectedTypes.includes(opt) ? "border-[#c49a2e] bg-[#c49a2e]" : "border-gray-300"
                }`}>
                  {selectedTypes.includes(opt) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{opt}</span>
              </div>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">상세 변환 요청사항</label>
          <textarea
            value={transformationDetail}
            onChange={(e) => setTransformationDetail(e.target.value)}
            rows={3}
            placeholder="필요한 전처리 작업을 구체적으로 설명해주세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
          />
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
          href="/data-transform-results"
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          이전 의뢰 결과 확인
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting || !email.trim() || !dataDescription.trim()}
          className="px-8 py-3 bg-[#c49a2e] text-white rounded-lg text-sm font-semibold hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "제출 중..." : "전처리 의뢰하기"}
        </button>
      </div>
    </div>
  );
}
