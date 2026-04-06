"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";

interface ClassifiedCase {
  court: string;
  case_no: string;
  judgment_date: string;
  charge: string;
  is_ipv: boolean;
  reason: string;
  raw_line: string;
}

interface ClassificationResult {
  ipv: ClassifiedCase[];
  nonIpv: ClassifiedCase[];
  ambiguous: ClassifiedCase[];
  total: number;
}

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileType, setFileType] = useState<"txt" | "xlsx">("txt");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileSelected = (f: File) => {
    setFile(f);
    setResult(null);
    setSaved(false);
    setError("");

    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext === "xlsx" || ext === "xls") {
      setFileType("xlsx");
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        setFileContent(base64);
      };
      reader.readAsArrayBuffer(f);
    } else {
      setFileType("txt");
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
      };
      reader.readAsText(f, "utf-8");
    }
  };

  const handleParse = async () => {
    if (!fileContent) return;
    setParsing(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: fileContent, type: fileType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "파일 분석에 실패했습니다.");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("파일 분석 중 오류가 발생했습니다.");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    if (!fileContent) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: fileContent, type: fileType, save: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "저장에 실패했습니다.");
      } else {
        setSaved(true);
        setTimeout(() => {
          router.push(`/project/${projectId}`);
        }, 1500);
      }
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const allCases = result ? [...result.ipv, ...result.ambiguous, ...result.nonIpv] : [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">대시보드</Link>
        <span>/</span>
        <Link href={`/project/${projectId}`} className="hover:text-foreground transition-colors">프로젝트</Link>
        <span>/</span>
        <span>목록 업로드</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">사건 목록 업로드</h1>
      <p className="text-muted-foreground text-sm mb-8">
        .txt 또는 .xlsx 파일을 업로드하여 사건 목록을 추가합니다.
      </p>

      {/* Upload area */}
      <FileUpload onFileSelected={handleFileSelected} />

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Parse button */}
      {file && !result && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleParse}
            disabled={parsing || !fileContent}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {parsing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                파싱 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                파일 분석
              </>
            )}
          </button>
        </div>
      )}

      {/* Parsed results */}
      {result && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              분석 결과 ({result.total}건)
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 dark:text-green-400">
                IPV: {result.ipv.length}건
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">
                판단보류: {result.ambiguous.length}건
              </span>
              <span className="text-muted-foreground">
                비IPV: {result.nonIpv.length}건
              </span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 font-medium">번호</th>
                  <th className="text-left px-4 py-3 font-medium">법원</th>
                  <th className="text-left px-4 py-3 font-medium">사건번호</th>
                  <th className="text-left px-4 py-3 font-medium">죄명</th>
                  <th className="text-left px-4 py-3 font-medium">IPV 분류</th>
                  <th className="text-left px-4 py-3 font-medium">사유</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allCases.map((c, idx) => {
                  const isAmbiguous = result.ambiguous.includes(c);
                  return (
                    <tr key={idx} className={!c.is_ipv && !isAmbiguous ? "opacity-50" : ""}>
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">{c.court}</td>
                      <td className="px-4 py-3 font-mono text-xs">{c.case_no}</td>
                      <td className="px-4 py-3">{c.charge}</td>
                      <td className="px-4 py-3">
                        {isAmbiguous ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full font-medium">
                            판단보류
                          </span>
                        ) : c.is_ipv ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                            IPV
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                            비IPV
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {c.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Save button */}
          <div className="mt-6 flex justify-end gap-3">
            <Link
              href={`/project/${projectId}`}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-border transition-colors"
            >
              취소
            </Link>
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saved ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  저장 완료 (이동 중...)
                </>
              ) : saving ? (
                "저장 중..."
              ) : (
                `저장 (IPV ${result.ipv.length}건 + 판단보류 ${result.ambiguous.length}건)`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
