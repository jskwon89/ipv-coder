"use client";
import ServiceTabs from "@/components/ServiceTabs";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useUser } from "@/contexts/UserAuthContext";
import { saveDraft, loadDraft } from "@/lib/formDraft";

type InputMethod = "pdf" | "excel" | "collection";
type LogicOp = "AND" | "OR";

const COURTS = [
  "전체", "서울", "수원", "대전", "대구", "부산", "광주",
  "인천", "창원", "춘천", "제주", "의정부", "청주", "전주", "울산",
] as const;

const CASE_TYPES = [
  { label: "형사 (고단/고합/고정)", value: "criminal" },
  { label: "민사", value: "civil" },
  { label: "가사", value: "family" },
] as const;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

const INPUT_METHODS: { key: InputMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: "pdf",
    label: "PDF 업로드",
    desc: "보유한 판결문 PDF를 직접 업로드",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "excel",
    label: "엑셀 파일 업로드",
    desc: "판결문 데이터가 정리된 엑셀 파일 업로드",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "collection",
    label: "수집 의뢰",
    desc: "원하는 유형·건수를 알려주시면 수집해 드립니다",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

export default function JudgmentPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [inputMethod, setInputMethod] = useState<InputMethod>("pdf");
  const [email, setEmail] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Collection-specific fields
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordLogic, setKeywordLogic] = useState<LogicOp>("AND");
  const [selectedCourts, setSelectedCourts] = useState<string[]>(["전체"]);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(currentYear);
  const [selectedCaseTypes, setSelectedCaseTypes] = useState<string[]>(["criminal"]);
  const [lawKeyword, setLawKeyword] = useState("");
  const [maxCount, setMaxCount] = useState(100);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
    const d = loadDraft(pathname);
    if (d) {
      if (d.email) setEmail(d.email as string);
      if (d.inputMethod) setInputMethod(d.inputMethod as InputMethod);
      if (d.additionalNotes) setAdditionalNotes(d.additionalNotes as string);
      if (d.keywords) setKeywords(d.keywords as string[]);
      if (d.keywordLogic) setKeywordLogic(d.keywordLogic as LogicOp);
      if (d.selectedCourts) setSelectedCourts(d.selectedCourts as string[]);
      if (d.startYear) setStartYear(d.startYear as number);
      if (d.endYear) setEndYear(d.endYear as number);
      if (d.selectedCaseTypes) setSelectedCaseTypes(d.selectedCaseTypes as string[]);
      if (d.lawKeyword) setLawKeyword(d.lawKeyword as string);
      if (d.maxCount) setMaxCount(d.maxCount as number);
    }
  }, [user]);

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords((prev) => [...prev, trimmed]);
      setKeywordInput("");
    }
  };

  const toggleCourt = (court: string) => {
    if (court === "전체") {
      setSelectedCourts((prev) => prev.includes("전체") ? [] : ["전체"]);
      return;
    }
    setSelectedCourts((prev) => {
      const without = prev.filter((c) => c !== "전체");
      return without.includes(court) ? without.filter((c) => c !== court) : [...without, court];
    });
  };

  const toggleCaseType = (type: string) => {
    setSelectedCaseTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const fileAccept = inputMethod === "pdf"
    ? ".pdf"
    : inputMethod === "excel"
    ? ".xlsx,.xls,.csv"
    : ".txt,.xlsx,.xls,.pdf,.hwp,.csv";

  const fileLabel = inputMethod === "pdf"
    ? "PDF 파일"
    : inputMethod === "excel"
    ? "Excel / CSV 파일"
    : "참고 파일";

  const handleSubmit = async () => {
    if (!user) {
      saveDraft(pathname, { email, inputMethod, additionalNotes, keywords, keywordLogic, selectedCourts, startYear, endYear, selectedCaseTypes, lawKeyword, maxCount });
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!email.trim()) {
      setSubmitError("이메일은 필수 입력입니다.");
      return;
    }
    if ((inputMethod === "pdf" || inputMethod === "excel") && attachedFiles.length === 0) {
      setSubmitError("파일을 첨부해주세요.");
      return;
    }
    if (inputMethod === "collection" && keywords.length === 0) {
      setSubmitError("검색 키워드를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        email: email.trim(),
        name: user.email?.split("@")[0] || "",
        searchType: inputMethod === "collection" ? "keyword" : inputMethod,
        inputMethod,
        caseNumbers: "",
        scopeFirst: true,
        scopeSecond: true,
        scopeThird: false,
        outputFormat: "both",
        keywords: inputMethod === "collection" ? JSON.stringify(keywords) : "",
        keywordLogic,
        courts: inputMethod === "collection" ? JSON.stringify(selectedCourts) : "",
        startYear,
        endYear,
        caseTypes: inputMethod === "collection" ? JSON.stringify(selectedCaseTypes) : "",
        lawKeyword: inputMethod === "collection" ? lawKeyword.trim() : "",
        maxCount: inputMethod === "collection" ? maxCount : 0,
        additionalNotes: additionalNotes.trim(),
        fileNames: attachedFiles.map((f) => f.name),
      };
      const res = await fetch("/api/judgment-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "의뢰 생성에 실패했습니다.");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <ServiceTabs tabs={[{ label: "판결문 의뢰", href: "/judgment" }, { label: "결과 확인", href: "/judgment-results" }]} />
      <PageHeader
        title="판결문 의뢰"
        subtitle="판결문 데이터를 업로드하거나 수집을 의뢰합니다"
        detailTooltip={"📋 의뢰 방법:\n① PDF 업로드 — 보유한 판결문 PDF를 직접 업로드\n② 엑셀 파일 업로드 — 정리된 판결문 데이터 업로드\n③ 수집 의뢰 — 유형·건수 지정 시 수집해 드립니다\n\n의뢰 후 결과 확인 페이지에서 진행 상황을 확인하세요."}
        breadcrumbs={[
          { label: "자료 생성 & 수집" },
          { label: "판결문" },
        ]}
        iconBgClass="bg-blue-50"
        iconTextClass="text-blue-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
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
              <h3 className="font-semibold text-green-800">의뢰가 접수되었습니다</h3>
              <p className="text-sm text-green-700 mt-1">
                담당자 검토 후 안내를 드리겠습니다. 진행 상황은 결과 확인 페이지에서 확인하실 수 있습니다.
              </p>
              <Link
                href="/judgment-results"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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

      {/* Input method selection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">의뢰 방법 선택</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {INPUT_METHODS.map((m) => (
            <button
              key={m.key}
              onClick={() => { setInputMethod(m.key); setAttachedFiles([]); }}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                inputMethod === m.key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                inputMethod === m.key ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
              }`}>
                {m.icon}
              </div>
              <p className={`text-sm font-semibold ${inputMethod === m.key ? "text-blue-700" : "text-gray-900"}`}>{m.label}</p>
              <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* File upload (PDF / Excel) */}
      {(inputMethod === "pdf" || inputMethod === "excel") && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{fileLabel} 첨부</h2>
          <div
            onDrop={(e) => { e.preventDefault(); setDragging(false); const files = Array.from(e.dataTransfer.files); setAttachedFiles((prev) => [...prev, ...files]); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={fileAccept}
              className="hidden"
              onChange={(e) => { const files = Array.from(e.target.files || []); setAttachedFiles((prev) => [...prev, ...files]); e.target.value = ""; }}
            />
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500 font-medium">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-xs text-gray-400 mt-1">
              {inputMethod === "pdf" ? "PDF 파일 지원" : "Excel (.xlsx, .xls), CSV 파일 지원"}
            </p>
          </div>
          {attachedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="text-sm text-gray-700 truncate">{f.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">({(f.size / 1024).toFixed(0)}KB)</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setAttachedFiles((prev) => prev.filter((_, idx) => idx !== i)); }} className="text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collection form */}
      {inputMethod === "collection" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">수집 조건</h2>
          <div className="space-y-5">
            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">검색 키워드 <span className="text-red-500">*</span></label>
              <div className="border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {kw}
                      <button onClick={() => setKeywords((prev) => prev.filter((k) => k !== kw))} className="hover:text-blue-900">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addKeyword(); } }}
                  placeholder="예: 가정폭력, 스토킹, 보호명령 (Enter로 추가)"
                  className="w-full outline-none text-sm py-1 placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">연산:</span>
                {(["AND", "OR"] as const).map((op) => (
                  <label key={op} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input type="radio" name="logic" checked={keywordLogic === op} onChange={() => setKeywordLogic(op)} className="border-gray-200 text-blue-600 focus:ring-blue-500" />
                    {op}
                  </label>
                ))}
              </div>
            </div>

            {/* Court selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">법원 선택</label>
              <div className="flex flex-wrap gap-2">
                {COURTS.map((court) => (
                  <button
                    key={court}
                    type="button"
                    onClick={() => toggleCourt(court)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedCourts.includes(court)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {court}
                  </button>
                ))}
              </div>
            </div>

            {/* Period + Case type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기간 범위</label>
                <div className="flex items-center gap-2">
                  <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <span className="text-gray-500">~</span>
                  <select value={endYear} onChange={(e) => setEndYear(Number(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최대 수집 건수</label>
                <input
                  type="number"
                  value={maxCount}
                  onChange={(e) => setMaxCount(Number(e.target.value))}
                  min={1}
                  className="w-32 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Case type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사건 유형</label>
              <div className="flex flex-wrap gap-4">
                {CASE_TYPES.map((ct) => (
                  <label key={ct.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={selectedCaseTypes.includes(ct.value)} onChange={() => toggleCaseType(ct.value)} className="rounded border-gray-200 text-blue-600 focus:ring-blue-500" />
                    {ct.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Law keyword */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                죄명/법조문 키워드 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={lawKeyword}
                onChange={(e) => setLawKeyword(e.target.value)}
                placeholder="예: 상해, 폭행, 협박, 스토킹처벌법"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">의뢰 정보</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="결과를 받을 이메일 주소"
            className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">추가 요청사항</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder="분석 목적, 코딩 항목 등 추가 요청사항을 작성해주세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {submitError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Link href="/judgment-results" className="text-sm text-gray-500 hover:text-gray-700 underline">
          이전 의뢰 결과 확인
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting || !email.trim()}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "접수 중..." : "의뢰 접수"}
        </button>
      </div>
    </div>
  );
}
