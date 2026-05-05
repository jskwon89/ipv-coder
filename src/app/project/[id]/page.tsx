"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBadge, { type CaseStatus } from "@/components/StatusBadge";
import { useUser } from "@/contexts/UserAuthContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, loading: userLoading } = useUser();
  const { isAdmin, loading: adminLoading } = useAuth();

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
  const [requestNote, setRequestNote] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; originalName: string; size: number; createdAt: string; storagePath: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const [casesRes, projRes, filesRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/cases`),
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/files`),
      ]);
      const casesData = await casesRes.json();
      setCases(casesData.cases || []);

      const projData = await projRes.json();
      if (projData.project) {
        setProject(projData.project);
      }

      const filesData = await filesRes.json();
      setUploadedFiles(filesData.files || []);
    } catch {
      console.error("데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 로그인 체크: 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!userLoading && !adminLoading && !user && !isAdmin) {
      router.push("/login");
    }
  }, [userLoading, adminLoading, user, isAdmin, router]);

  if (userLoading || adminLoading) {
    return <div className="p-8 text-center text-gray-400">로딩 중...</div>;
  }
  if (!user && !isAdmin) {
    return null;
  }

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
    setDropUploading(true);
    setDropStatus(`업로드 중... (${file.name})`);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);

      const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setDropStatus(`오류: ${data.error || "업로드 실패"}`);
      } else {
        setDropStatus(`업로드 완료! (${file.name})`);
        await fetchData();
        setTimeout(() => setDropStatus(""), 3000);
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
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>
      <h1 className="text-2xl font-bold">{project?.name || "프로젝트"}</h1>
      <p className="text-sm text-gray-600 mt-1 mb-6">업로드된 파일 {uploadedFiles.length}개 | 프로젝트 ID: {projectId}</p>

      {/* Upload area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 text-center cursor-pointer transition-all ${
            dragging
              ? "bg-amber-50 border-b-2 border-amber-400"
              : "hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.xlsx,.xls,.pdf,.hwp,.doc,.docx,.csv,.zip"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach((file) => handleDropFile(file));
              e.target.value = "";
            }}
          />
          {dropUploading ? (
            <p className="text-sm text-amber-600 font-medium">{dropStatus}</p>
          ) : dropStatus ? (
            <p className="text-sm text-green-600 font-medium">{dropStatus}</p>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500 font-medium">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-400 mt-1">PDF, HWP, Excel, TXT, CSV, ZIP 등</p>
            </>
          )}
        </div>

        {/* File list */}
        {uploadedFiles.length > 0 ? (
          <div className="border-t border-gray-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">업로드된 파일 ({uploadedFiles.length})</span>
              <button
                onClick={() => window.open(`/api/projects/${projectId}/files/download-all`, "_blank")}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-primary rounded-md hover:bg-teal-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                전체 다운로드 (ZIP)
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {uploadedFiles.map((f, idx) => (
                <div key={f.storagePath} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <span className="text-xs text-gray-400 w-6 text-right shrink-0">{idx + 1}</span>
                  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{f.originalName}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {f.size ? `${(f.size / 1024).toFixed(0)}KB` : ""}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {f.createdAt ? new Date(f.createdAt).toLocaleDateString("ko-KR") : ""}
                  </span>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const res = await fetch(`/api/projects/${projectId}/files/download?path=${encodeURIComponent(f.storagePath)}`);
                        const data = await res.json();
                        if (data.url) {
                          window.open(data.url, "_blank");
                        }
                      } catch {
                        alert("파일 다운로드에 실패했습니다.");
                      }
                    }}
                    className="text-xs text-primary hover:text-teal-700 font-medium shrink-0"
                  >
                    다운로드
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 px-4 py-6 text-center">
            <p className="text-xs text-gray-400">아직 업로드된 파일이 없습니다</p>
          </div>
        )}
      </div>

      {/* Request section */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">분석 의뢰</h3>
          <textarea
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            rows={3}
            placeholder="요청사항을 입력하세요 (예: 업로드한 판결문에서 피고인 정보, 양형 사항을 코딩해주세요)"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none mb-4"
          />
          {requested ? (
            <div className="px-4 py-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium text-center border border-green-200">
              의뢰가 접수되었습니다. 담당자 검토 후 결과를 안내드리겠습니다.
            </div>
          ) : (
            <button
              onClick={async () => {
                setRequesting(true);
                try {
                  const res = await fetch("/api/judgment-coding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      projectId,
                      projectName: project?.name || "",
                      email: "",
                      note: requestNote,
                      fileCount: uploadedFiles.length,
                    }),
                  });
                  if (!res.ok) throw new Error("의뢰 실패");
                  setRequested(true);
                } finally {
                  setRequesting(false);
                }
              }}
              disabled={requesting}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {requesting ? "접수 중..." : `의뢰하기 (${uploadedFiles.length}개 파일)`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
