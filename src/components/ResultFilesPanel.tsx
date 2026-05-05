"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ResultFile {
  path: string;
  name: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

interface Props {
  serviceType: string;
  requestId: string;
  mode: "admin" | "user";
}

function formatSize(bytes: number): string {
  if (!bytes) return "0B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)}${units[i]}`;
}

export default function ResultFilesPanel({ serviceType, requestId, mode }: Props) {
  const [files, setFiles] = useState<ResultFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/result-files?service_type=${encodeURIComponent(serviceType)}&request_id=${encodeURIComponent(requestId)}`
      );
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch {
      /* ignore */
    }
  }, [serviceType, requestId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (selected: FileList | null) => {
    if (!selected || selected.length === 0 || mode !== "admin") return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(selected)) {
        const fd = new FormData();
        fd.append("service_type", serviceType);
        fd.append("request_id", requestId);
        fd.append("file", file);
        fd.append("notify", "1");
        const res = await fetch("/api/result-files", {
          method: "POST",
          credentials: "same-origin",
          body: fd,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `업로드 실패 (${res.status})`);
        }
      }
      await fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = async (file: ResultFile) => {
    try {
      const res = await fetch(`/api/result-files/download?path=${encodeURIComponent(file.path)}`);
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (file: ResultFile) => {
    if (mode !== "admin") return;
    if (!confirm(`'${file.name}' 파일을 삭제하시겠습니까?`)) return;
    try {
      await fetch(
        `/api/result-files?service_type=${encodeURIComponent(serviceType)}&request_id=${encodeURIComponent(requestId)}&path=${encodeURIComponent(file.path)}`,
        { method: "DELETE", credentials: "same-origin" }
      );
      await fetchFiles();
    } catch {
      /* ignore */
    }
  };

  const isAdmin = mode === "admin";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">
          결과 파일 {files.length > 0 && `(${files.length}개)`}
        </span>
        {isAdmin && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {uploading ? "업로드 중..." : "파일 업로드"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </>
        )}
      </div>
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-xs text-red-600">{error}</div>
      )}
      {files.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-gray-400">
          {isAdmin ? "결과 파일을 업로드해 주세요" : "아직 등록된 결과 파일이 없습니다"}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {files.map((f, idx) => (
            <div key={f.path} className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50">
              <span className="text-xs text-gray-400 w-5 text-right shrink-0">{idx + 1}</span>
              <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700 truncate flex-1">{f.name}</span>
              <span className="text-xs text-gray-400 shrink-0">{formatSize(f.size)}</span>
              <button
                onClick={() => handleDownload(f)}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium shrink-0"
              >
                다운로드
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(f)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium shrink-0"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
