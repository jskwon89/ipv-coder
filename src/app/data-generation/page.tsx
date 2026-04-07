"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ResearchRequest {
  id: string;
  keywords: string;
  description: string;
  field: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  aiDraft: string;
  adminResponse: string;
  respondedAt: string;
}

const fieldOptions = [
  "법학",
  "사회복지학",
  "심리학",
  "범죄학",
  "사회학",
  "교육학",
  "기타",
];

const statusConfig = {
  pending: { label: "대기중", bg: "bg-gray-100", text: "text-gray-600" },
  in_progress: { label: "분석중", bg: "bg-blue-50", text: "text-blue-600" },
  completed: { label: "완료", bg: "bg-green-50", text: "text-green-600" },
};

export default function ResearchDesignPage() {
  const [keywords, setKeywords] = useState("");
  const [field, setField] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/research-design");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim() || !field) return;
    setSubmitting(true);
    try {
      await fetch("/api/research-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: keywords.trim(), description: description.trim(), field }),
      });
      setKeywords("");
      setField("");
      setDescription("");
      await fetchRequests();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        대시보드로 돌아가기
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">연구 주제 및 방향 설계</h1>
        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          연구 키워드를 입력하시면, 전문가가 선행연구 동향, 연구 방향, 변수 구성, 통계분석 방법 등을
          종합적으로 분석하여 제공합니다.
        </p>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">새 의뢰</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연구 키워드</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 가정폭력, 보호명령, 재범"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연구 분야</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e]"
              required
            >
              <option value="">선택해주세요</option>
              {fieldOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="연구하고자 하는 주제, 관심 변수, 특별히 궁금한 사항 등을 자유롭게 작성해주세요"
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/40 focus:border-[#c49a2e] resize-none"
            />
          </div>
          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting || !keywords.trim() || !field}
              className="px-6 py-2.5 bg-[#c49a2e] text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "제출 중..." : "의뢰하기"}
            </button>
          </div>
        </div>
      </form>

      {/* Request List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">의뢰 내역</h2>
        </div>
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="w-12 h-12 text-gray-200 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-gray-400">아직 의뢰 내역이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((req) => {
              const sc = statusConfig[req.status];
              const isExpanded = expandedId === req.id && req.status === "completed";
              return (
                <div key={req.id}>
                  <div
                    className={`px-6 py-4 flex items-center justify-between ${
                      req.status === "completed" ? "cursor-pointer hover:bg-gray-50" : ""
                    }`}
                    onClick={() => {
                      if (req.status === "completed") {
                        setExpandedId(expandedId === req.id ? null : req.id);
                      }
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {req.keywords}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{req.field}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>
                    {req.status === "completed" && (
                      <svg
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                  {isExpanded && req.adminResponse && (
                    <div className="px-6 pb-5">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-green-700">분석 결과</span>
                          {req.respondedAt && (
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(req.respondedAt).toLocaleDateString("ko-KR")}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {req.adminResponse}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
