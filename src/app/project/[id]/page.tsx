"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [checking, setChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState<string>("");
  const [exporting, setExporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dropUploading, setDropUploading] = useState(false);
  const [dropStatus, setDropStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDropFile = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isPdf = ext === "pdf";
    const isHwp = ext === "hwp";
    const isExcel = ext === "xlsx" || ext === "xls";
    const isTxt = ext === "txt";

    if (!isPdf && !isHwp && !isExcel && !isTxt) {
      setDropStatus("지원하지 않는 파일 형식입니다. (PDF, TXT, Excel 지원)");
      setTimeout(() => setDropStatus(""), 3000);
      return;
    }

    setDropUploading(true);

    try {
      if (isPdf || isHwp) {
        // PDF/HWP → 판결문 직접 업로드
        setDropStatus("판결문 텍스트 추출 중...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);

        const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setDropStatus(`오류: ${data.error || "업로드 실패"}`);
        } else {
          setDropStatus(`업로드 완료! (${data.pages}페이지, ${data.chars?.toLocaleString()}자 추출)`);
          await fetchData();
          setTimeout(() => setDropStatus(""), 4000);
        }
      } else {
        // TXT/Excel → 사건 목록 업로드
        setDropStatus("사건 목록 분석 중...");
        let content: string;
        let type: "txt" | "xlsx";

        if (isExcel) {
          type = "xlsx";
          const arrayBuffer = await file.arrayBuffer();
          content = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
          );
        } else {
          type = "txt";
          content = await file.text();
        }

        const res = await fetch(`/api/projects/${projectId}/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, type, save: true }),
        });
        const data = await res.json();
        if (!res.ok) {
          setDropStatus(`오류: ${data.error || "업로드 실패"}`);
        } else {
          setDropStatus("사건 목록 업로드 완료!");
          await fetchData();
          setTimeout(() => setDropStatus(""), 3000);
        }
      }
    } catch {
      setDropStatus("업로드 중 오류가 발생했습니다.");
    } finally {
      setDropUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleDropFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

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
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            대시보드로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">{project?.name || "프로젝트"}</h1>
          <p className="text-sm text-gray-600 mt-1">총 {cases.length}건 | 프로젝트 ID: {projectId}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href={`/project/${projectId}/upload`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
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
          코딩 의뢰
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
            filter === "all" ? "bg-amber-600 text-white" : "bg-gray-50 text-secondary-foreground hover:bg-border"
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
                filter === s ? "bg-amber-600 text-white" : "bg-gray-50 text-secondary-foreground hover:bg-border"
              }`}
            >
              <StatusBadge status={s} /> ({count})
            </button>
          );
        })}
      </div>

      {/* Cases table */}
      <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-amber-50">
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
                  <td colSpan={6} className="px-4 py-0">
                    {cases.length === 0 ? (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl py-12 my-4 text-center cursor-pointer transition-all ${
                          dragging
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-300 hover:border-amber-400 hover:bg-amber-50/50"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".txt,.xlsx,.xls,.pdf,.hwp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDropFile(file);
                            e.target.value = "";
                          }}
                        />
                        {dropUploading ? (
                          <p className="text-sm text-amber-600 font-medium">{dropStatus}</p>
                        ) : dropStatus ? (
                          <p className="text-sm text-green-600 font-medium">{dropStatus}</p>
                        ) : (
                          <>
                            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-500 font-medium">파일을 여기에 드래그하거나 클릭하여 업로드</p>
                            <p className="text-xs text-gray-400 mt-1">사건 목록(.txt, .xlsx) 또는 판결문(.pdf, .hwp) 지원</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="py-12 text-center text-muted-foreground">해당 상태의 사건이 없습니다.</p>
                    )}
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
