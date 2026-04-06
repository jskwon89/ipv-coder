"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StatusBadge, { type CaseStatus } from "@/components/StatusBadge";

interface CaseItem {
  id: string;
  key: number;
  court: string;
  case_no: string;
  status: CaseStatus;
  sourceText: string;
  casenoteUrl: string;
  lboxUrl: string;
}

interface ProjectInfo {
  id: string;
  name: string;
  caseCount: number;
  codedCount: number;
}

const allStatuses: CaseStatus[] = [
  "pending", "checking", "available", "unavailable", "fetched", "coding", "coded", "reviewed", "error",
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [checking, setChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/cases`);
      const data = await res.json();
      setCases(data.cases || []);

      const projRes = await fetch(`/api/projects/${projectId}`);
      const projData = await projRes.json();
      if (projData.project) {
        setProject(projData.project);
      }
    } catch {
      console.error("데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCases = filter === "all" ? cases : cases.filter((c) => c.status === filter);

  const handleBulkCheck = async () => {
    const pendingCases = cases.filter((c) => c.status === "pending");
    if (pendingCases.length === 0) {
      setCheckProgress("확인할 대기 사건이 없습니다.");
      return;
    }
    setChecking(true);
    let checked = 0;
    for (const c of pendingCases) {
      setCheckProgress(`확인 중... (${checked + 1}/${pendingCases.length}) ${c.case_no}`);
      try {
        await fetch("/api/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ court: c.court, caseNo: c.case_no }),
        });
      } catch {
        // continue
      }
      checked++;
    }
    setCheckProgress(`완료: ${checked}건 확인됨`);
    setChecking(false);
    // Refresh data
    await fetchData();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "export"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Excel 내보내기에 실패했습니다.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">{project?.name || "프로젝트"}</h1>
          <p className="text-sm text-muted-foreground mt-1">총 {cases.length}건 | 프로젝트 ID: {projectId}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href={`/project/${projectId}/upload`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          목록 업로드
        </Link>
        <button
          onClick={handleBulkCheck}
          disabled={checking}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {checking ? "확인 중..." : "전문 일괄확인"}
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI 코딩 시작
        </button>
        <Link
          href={`/project/${projectId}/stats`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          통계
        </Link>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting ? "내보내기 중..." : "Excel 내보내기"}
        </button>
      </div>

      {/* Check progress */}
      {checkProgress && (
        <div className="mb-4 px-4 py-2 bg-gray-50 rounded-lg text-sm">
          {checkProgress}
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-gray-50 text-secondary-foreground hover:bg-border"
          }`}
        >
          전체 ({cases.length})
        </button>
        {allStatuses.map((s) => {
          const count = cases.filter((c) => c.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-gray-50 text-secondary-foreground hover:bg-border"
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
              <tr className="border-b border-border bg-gray-100">
                <th className="text-left px-4 py-3 font-medium">번호</th>
                <th className="text-left px-4 py-3 font-medium">법원</th>
                <th className="text-left px-4 py-3 font-medium">사건번호</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
                <th className="text-left px-4 py-3 font-medium">전문확인</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    {cases.length === 0 ? "사건이 없습니다. 목록을 업로드해주세요." : "해당 상태의 사건이 없습니다."}
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-100 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{c.key}</td>
                    <td className="px-4 py-3">{c.court}</td>
                    <td className="px-4 py-3 font-mono text-xs">{c.case_no}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} showTooltip />
                    </td>
                    <td className="px-4 py-3">
                      {c.sourceText ? (
                        <span className="text-green-600 text-xs">확인됨</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">미확인</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/project/${projectId}/case/${c.id}`}
                        className="text-primary hover:underline text-xs font-medium"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
