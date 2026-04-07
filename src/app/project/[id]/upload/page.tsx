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

type UploadMode = "list" | "pdf";

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [mode, setMode] = useState<UploadMode>("list");

  // 목록 업로드 상태
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileType, setFileType] = useState<"txt" | "xlsx">("txt");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>("");

  // PDF 업로드 상태
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfResults, setPdfResults] = useState<{ name: string; pages: number; chars: number; status: string }[]>([]);
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");

  const handleFileSelected = (f: File) => {
    if (mode === "pdf") {
      setPdfFiles((prev) => [...prev, f]);
      return;
    }
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

  const handlePdfUpload = async () => {
    if (pdfFiles.length === 0) return;
    setPdfProcessing(true);
    setPdfResults([]);

    for (let i = 0; i < pdfFiles.length; i++) {
      const f = pdfFiles[i];
      setPdfProgress(`처리 중... (${i + 1}/${pdfFiles.length}) ${f.name}`);

      const formData = new FormData();
      formData.append("file", f);
      formData.append("projectId", projectId);

      try {
        const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          setPdfResults((prev) => [...prev, {
            name: f.name, pages: data.pages, chars: data.chars, status: "성공"
          }]);
        } else {
          setPdfResults((prev) => [...prev, {
            name: f.name, pages: 0, chars: 0, status: `오류: ${data.error}`
          }]);
        }
      } catch {
        setPdfResults((prev) => [...prev, {
          name: f.name, pages: 0, chars: 0, status: "네트워크 오류"
        }]);
      }
    }
    setPdfProcessing(false);
    setPdfProgress(`완료: ${pdfFiles.length}건 처리됨`);
  };

  const allCases = result ? [...result.ipv, ...result.ambiguous, ...result.nonIpv] : [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-2">사건 업로드</h1>
      <p className="text-gray-600 text-sm mb-6">
        사건 목록 파일 또는 판결문 PDF를 업로드합니다.
      </p>

      {/* Mode tabs */}
      <div className="flex gap-1 bg-gray-50 rounded-lg p-1 mb-8 w-fit">
        <button
          onClick={() => setMode("list")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "list" ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          사건 목록 (.txt / .xlsx)
        </button>
        <button
          onClick={() => setMode("pdf")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "pdf" ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          판결문 PDF 직접 업로드
        </button>
      </div>

      {mode === "list" ? (
        <>
          {/* 목록 업로드 */}
          <div className="mb-4 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
            사건 목록을 업로드하면 casenote.kr에서 판결문 전문을 자동으로 가져옵니다.
            casenote에 없는 판결문은 &quot;미등록&quot;으로 표시되며, PDF 직접 업로드가 필요합니다.
          </div>

          <FileUpload onFileSelected={handleFileSelected} accept=".txt,.xlsx,.xls" />

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {file && !result && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleParse}
                disabled={parsing || !fileContent}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {parsing ? "파싱 중..." : "파일 분석"}
              </button>
            </div>
          )}

          {result && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">분석 결과 ({result.total}건)</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">IPV: {result.ipv.length}건</span>
                  <span className="text-yellow-600">판단보류: {result.ambiguous.length}건</span>
                  <span className="text-muted-foreground">비IPV: {result.nonIpv.length}건</span>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-amber-50">
                      <th className="text-left px-4 py-3 font-medium">번호</th>
                      <th className="text-left px-4 py-3 font-medium">법원</th>
                      <th className="text-left px-4 py-3 font-medium">사건번호</th>
                      <th className="text-left px-4 py-3 font-medium">죄명</th>
                      <th className="text-left px-4 py-3 font-medium">분류</th>
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
                              <span className="inline-flex px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full font-medium">판단보류</span>
                            ) : c.is_ipv ? (
                              <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium">IPV</span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">비IPV</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{c.reason}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Link href={`/project/${projectId}`} className="px-4 py-2 bg-gray-50 text-secondary-foreground rounded-lg text-sm font-medium hover:bg-border transition-colors">
                  취소
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saved || saving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saved ? "저장 완료 (이동 중...)" : saving ? "저장 중..." : `저장 (IPV ${result.ipv.length}건 + 판단보류 ${result.ambiguous.length}건)`}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* PDF 직접 업로드 */}
          <div className="mb-4 px-4 py-3 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-100">
            casenote에 미등록된 판결문을 PDF로 직접 업로드합니다. 텍스트가 자동 추출되어 코딩에 사용됩니다.
          </div>

          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files).filter((f) => f.name.endsWith(".pdf"));
              files.forEach((f) => setPdfFiles((prev) => [...prev, f]));
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".pdf";
              input.multiple = true;
              input.onchange = (e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                files.forEach((f) => setPdfFiles((prev) => [...prev, f]));
              };
              input.click();
            }}
          >
            <svg className="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-muted-foreground">PDF 파일을 드래그하거나 클릭하여 선택 (복수 선택 가능)</p>
          </div>

          {/* 선택된 PDF 목록 */}
          {pdfFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">선택된 파일 ({pdfFiles.length}개)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPdfFiles([]); setPdfResults([]); setPdfProgress(""); }}
                    className="px-3 py-1.5 text-xs bg-gray-50 text-secondary-foreground rounded-lg hover:bg-border transition-colors"
                  >
                    초기화
                  </button>
                  <button
                    onClick={handlePdfUpload}
                    disabled={pdfProcessing}
                    className="px-4 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {pdfProcessing ? "처리 중..." : "텍스트 추출 시작"}
                  </button>
                </div>
              </div>

              {pdfProgress && (
                <div className="mb-3 px-4 py-2 bg-gray-50 rounded-lg text-sm">{pdfProgress}</div>
              )}

              <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-amber-50">
                      <th className="text-left px-4 py-3 font-medium">파일명</th>
                      <th className="text-left px-4 py-3 font-medium">크기</th>
                      <th className="text-left px-4 py-3 font-medium">페이지</th>
                      <th className="text-left px-4 py-3 font-medium">추출 글자</th>
                      <th className="text-left px-4 py-3 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pdfFiles.map((f, idx) => {
                      const r = pdfResults[idx];
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-mono text-xs">{f.name}</td>
                          <td className="px-4 py-3 text-xs">{(f.size / 1024).toFixed(0)}KB</td>
                          <td className="px-4 py-3 text-xs">{r ? r.pages : "-"}</td>
                          <td className="px-4 py-3 text-xs">{r ? `${r.chars.toLocaleString()}자` : "-"}</td>
                          <td className="px-4 py-3 text-xs">
                            {r ? (
                              r.status === "성공" ? (
                                <span className="text-green-600">성공</span>
                              ) : (
                                <span className="text-red-600">{r.status}</span>
                              )
                            ) : (
                              <span className="text-muted-foreground">대기</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
