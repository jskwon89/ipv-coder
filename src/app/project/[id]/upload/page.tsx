"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";

interface ParsedCase {
  seq: number;
  court: string;
  caseNo: string;
  charge: string;
  isIPV: boolean;
}

const mockParsed: ParsedCase[] = [
  { seq: 1, court: "서울중앙지방법원", caseNo: "2024고단1234", charge: "상해", isIPV: true },
  { seq: 2, court: "수원지방법원", caseNo: "2024고단5678", charge: "폭행, 재물손괴", isIPV: true },
  { seq: 3, court: "인천지방법원", caseNo: "2024고합901", charge: "상해, 협박", isIPV: true },
  { seq: 4, court: "대전지방법원", caseNo: "2024고단2345", charge: "절도", isIPV: false },
  { seq: 5, court: "부산지방법원", caseNo: "2024고단6789", charge: "상해", isIPV: true },
];

export default function UploadPage() {
  const params = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedCase[] | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileSelected = (f: File) => {
    setFile(f);
    setParsed(null);
    setSaved(false);
  };

  const handleParse = () => {
    setParsing(true);
    // Simulate parsing
    setTimeout(() => {
      setParsed(mockParsed);
      setParsing(false);
    }, 1000);
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">대시보드</Link>
        <span>/</span>
        <Link href={`/project/${params.id}`} className="hover:text-foreground transition-colors">프로젝트</Link>
        <span>/</span>
        <span>목록 업로드</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">사건 목록 업로드</h1>
      <p className="text-muted-foreground text-sm mb-8">
        .txt 또는 .xlsx 파일을 업로드하여 사건 목록을 추가합니다.
      </p>

      {/* Upload area */}
      <FileUpload onFileSelected={handleFileSelected} />

      {/* Parse button */}
      {file && !parsed && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleParse}
            disabled={parsing}
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
      {parsed && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              분석 결과 ({parsed.length}건)
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 dark:text-green-400">
                IPV: {parsed.filter((c) => c.isIPV).length}건
              </span>
              <span className="text-muted-foreground">
                비IPV: {parsed.filter((c) => !c.isIPV).length}건
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {parsed.map((c) => (
                  <tr key={c.seq} className={!c.isIPV ? "opacity-50" : ""}>
                    <td className="px-4 py-3">{c.seq}</td>
                    <td className="px-4 py-3">{c.court}</td>
                    <td className="px-4 py-3 font-mono text-xs">{c.caseNo}</td>
                    <td className="px-4 py-3">{c.charge}</td>
                    <td className="px-4 py-3">
                      {c.isIPV ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                          IPV
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                          비IPV
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save button */}
          <div className="mt-6 flex justify-end gap-3">
            <Link
              href={`/project/${params.id}`}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-border transition-colors"
            >
              취소
            </Link>
            <button
              onClick={handleSave}
              disabled={saved}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saved ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  저장 완료
                </>
              ) : (
                "저장"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
