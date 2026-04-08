"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

type SearchType = "keyword" | "sentence";

const purposeOptions = [
  { value: "academic", label: "학술연구" },
  { value: "policy", label: "정책분석" },
  { value: "trend", label: "동향파악" },
  { value: "other", label: "기타" },
];

export default function NewsSearchPage() {
  const [searchType, setSearchType] = useState<SearchType>("keyword");
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // New fields for collection request
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("academic");
  const [maxCount, setMaxCount] = useState(100);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addKeyword = () => {
    const parts = keywordInput.split(",").map((s) => s.trim()).filter(Boolean);
    const newKeywords = parts.filter((p) => !keywords.includes(p));
    if (newKeywords.length > 0) {
      setKeywords([...keywords, ...newKeywords]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSubmit = async () => {
    if (!email.trim()) return;
    if (searchType === "keyword" && keywords.length === 0) return;
    if (searchType === "sentence" && !query.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/news-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          searchType,
          keywords:
            searchType === "keyword"
              ? JSON.stringify(keywords)
              : query.trim(),
          keywordLogic: operator,
          dateFrom: dateFrom || "",
          dateTo: dateTo || "",
          maxCount,
          purpose,
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
        title="뉴스/언론 보도 수집 의뢰"
        subtitle="키워드 또는 문장으로 뉴스 기사 수집을 의뢰합니다"
        detailTooltip={"📋 요청 순서:\n① 검색 키워드 입력 (AND/OR 조합 가능)\n② 수집 기간·최대 건수 설정\n③ 이메일 입력 → 의뢰 접수\n④ 결과 확인에서 수집 현황·채팅\n\n수집 결과:\n• 기사 제목, 본문, 매체명, 날짜\n• 메타데이터 포함 엑셀 제공"}
        breadcrumbs={[
          { label: "문서 코딩" },
          { label: "뉴스 수집 의뢰" },
        ]}
        iconBgClass="bg-amber-50"
        iconTextClass="text-[#c49a2e]"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
              <h3 className="font-semibold text-green-800">수집 의뢰가 접수되었습니다</h3>
              <p className="text-sm text-green-700 mt-1">
                담당자 검토 후 결과를 제공해 드리겠습니다. 진행 상황은 결과 확인 페이지에서 확인하실 수 있습니다.
              </p>
              <Link
                href="/news-results"
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

      {/* Search type toggle + keyword builder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">검색 조건 설정</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType("keyword")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === "keyword"
                ? "bg-[#c49a2e] text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            키워드 조합
          </button>
          <button
            onClick={() => setSearchType("sentence")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === "sentence"
                ? "bg-[#c49a2e] text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            문장 검색
          </button>
        </div>

        {searchType === "keyword" ? (
          <div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="키워드를 하나씩 입력 후 Enter (쉼표로 여러 개 동시 입력 가능)"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2.5 bg-[#c49a2e] text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors"
              >
                추가
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {keywords.map((kw, i) => (
                  <span key={kw} className="flex items-center">
                    {i > 0 && (
                      <button
                        onClick={() =>
                          setOperator(operator === "AND" ? "OR" : "AND")
                        }
                        className="mx-1 px-2 py-0.5 rounded text-xs font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        {operator}
                      </button>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-[#c49a2e] rounded-full text-sm border border-[#c49a2e]/20">
                      {kw}
                      <button
                        onClick={() => removeKeyword(kw)}
                        className="hover:text-[#b08a28]"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="필요로 하는 기사 내용을 입력하세요 (예: 가정폭력 가해자에 대한 법원의 양형 기준 변화)"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] mb-3"
          />
        )}

        {/* Date range */}
        <div className="flex flex-wrap items-end gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              시작일
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              종료일
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            />
          </div>
        </div>
      </div>

      {/* Request details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">의뢰 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수집 목적
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            >
              {purposeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수집 건수
            </label>
            <input
              type="number"
              value={maxCount}
              onChange={(e) => setMaxCount(Number(e.target.value) || 100)}
              min={1}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            추가 요청사항
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder="수집과 관련하여 추가적으로 요청하실 사항이 있으시면 작성해주세요."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="결과를 받을 이메일 주소"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] md:max-w-sm"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Link
          href="/news-results"
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          이전 의뢰 결과 확인
        </Link>
        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            !email.trim() ||
            (searchType === "keyword" ? keywords.length === 0 : !query.trim())
          }
          className="px-8 py-3 bg-[#c49a2e] text-white rounded-lg text-sm font-semibold hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "제출 중..." : "수집 의뢰하기"}
        </button>
      </div>
    </div>
  );
}
