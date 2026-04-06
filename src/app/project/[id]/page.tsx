"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StatusBadge, { type CaseStatus } from "@/components/StatusBadge";

interface CaseItem {
  id: string;
  seq: number;
  court: string;
  caseNo: string;
  charge: string;
  status: CaseStatus;
  hasFullText: boolean;
}

const mockCases: CaseItem[] = [
  { id: "c1", seq: 1, court: "서울중앙지방법원", caseNo: "2024고단1234", charge: "상해", status: "coded", hasFullText: true },
  { id: "c2", seq: 2, court: "수원지방법원", caseNo: "2024고단5678", charge: "폭행, 재물손괴", status: "coded", hasFullText: true },
  { id: "c3", seq: 3, court: "인천지방법원", caseNo: "2024고합901", charge: "상해, 협박", status: "coding", hasFullText: true },
  { id: "c4", seq: 4, court: "대전지방법원", caseNo: "2024고단2345", charge: "폭행", status: "fetched", hasFullText: true },
  { id: "c5", seq: 5, court: "부산지방법원", caseNo: "2024고단6789", charge: "상해", status: "available", hasFullText: true },
  { id: "c6", seq: 6, court: "광주지방법원", caseNo: "2024고단3456", charge: "협박, 폭행", status: "unavailable", hasFullText: false },
  { id: "c7", seq: 7, court: "대구지방법원", caseNo: "2024고단7890", charge: "상해", status: "checking", hasFullText: false },
  { id: "c8", seq: 8, court: "서울동부지방법원", caseNo: "2024고단4567", charge: "폭행", status: "pending", hasFullText: false },
  { id: "c9", seq: 9, court: "서울서부지방법원", caseNo: "2024고단8901", charge: "상해치사", status: "reviewed", hasFullText: true },
  { id: "c10", seq: 10, court: "창원지방법원", caseNo: "2024고단5670", charge: "폭행", status: "error", hasFullText: false },
];

const allStatuses: CaseStatus[] = [
  "pending", "checking", "available", "unavailable", "fetched", "coding", "coded", "reviewed", "error",
];

export default function ProjectDetailPage() {
  const params = useParams();
  const [filter, setFilter] = useState<CaseStatus | "all">("all");

  const filteredCases = filter === "all" ? mockCases : mockCases.filter((c) => c.status === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:text-foreground transition-colors">대시보드</Link>
            <span>/</span>
            <span>프로젝트</span>
          </div>
          <h1 className="text-2xl font-bold">2024년 IPV 판결문 연구</h1>
          <p className="text-sm text-muted-foreground mt-1">총 {mockCases.length}건 | 프로젝트 ID: {params.id}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href={`/project/${params.id}/upload`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          목록 업로드
        </Link>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          전문 일괄확인
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI 코딩 시작
        </button>
        <Link
          href={`/project/${params.id}/stats`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          통계
        </Link>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Excel 내보내기
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-border"
          }`}
        >
          전체 ({mockCases.length})
        </button>
        {allStatuses.map((s) => {
          const count = mockCases.filter((c) => c.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-border"
              }`}
            >
              <StatusBadge status={s} /> ({count})
            </button>
          );
        })}
      </div>

      {/* Cases table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium">번호</th>
                <th className="text-left px-4 py-3 font-medium">법원</th>
                <th className="text-left px-4 py-3 font-medium">사건번호</th>
                <th className="text-left px-4 py-3 font-medium">죄명</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
                <th className="text-left px-4 py-3 font-medium">전문확인</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{c.seq}</td>
                  <td className="px-4 py-3">{c.court}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.caseNo}</td>
                  <td className="px-4 py-3">{c.charge}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} showTooltip />
                  </td>
                  <td className="px-4 py-3">
                    {c.hasFullText ? (
                      <span className="text-green-600 dark:text-green-400 text-xs">확인됨</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">미확인</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/project/${params.id}/case/${c.id}`}
                      className="text-primary hover:underline text-xs font-medium"
                    >
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
