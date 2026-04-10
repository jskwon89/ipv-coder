"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserAuthContext";
import { saveDraft, loadDraft } from "@/lib/formDraft";
import { SampleButton, JudgmentCodingDetail } from "@/components/SampleModal";

type OutputFormat = "pdf" | "text" | "both";
type Purpose = "학술연구" | "정책연구" | "실무참고" | "교육" | "기타";
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

export default function JudgmentCollectionPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 첨부 파일 (사건번호 목록 등)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // 출력 형식 / 수집 범위
  const [scopeFirst, setScopeFirst] = useState(true);
  const [scopeSecond, setScopeSecond] = useState(true);
  const [scopeThird, setScopeThird] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("both");

  // 키워드/조건
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordLogic, setKeywordLogic] = useState<LogicOp>("AND");
  const [selectedCourts, setSelectedCourts] = useState<string[]>(["전체"]);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(currentYear);
  const [selectedCaseTypes, setSelectedCaseTypes] = useState<string[]>(["criminal"]);
  const [lawKeyword, setLawKeyword] = useState("");
  const [maxCount, setMaxCount] = useState(100);

  // Common
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("학술연구");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
    const d = loadDraft(pathname);
    if (d) {
      if (d.name) setName(d.name as string);
      if (d.email) setEmail(d.email as string);
      if (d.org) setOrg(d.org as string);
      if (d.purpose) setPurpose(d.purpose as Purpose);
      if (d.keywords) setKeywords(d.keywords as string[]);
      if (d.keywordLogic) setKeywordLogic(d.keywordLogic as LogicOp);
      if (d.selectedCourts) setSelectedCourts(d.selectedCourts as string[]);
      if (d.startYear) setStartYear(d.startYear as number);
      if (d.endYear) setEndYear(d.endYear as number);
      if (d.selectedCaseTypes) setSelectedCaseTypes(d.selectedCaseTypes as string[]);
      if (d.lawKeyword) setLawKeyword(d.lawKeyword as string);
      if (d.maxCount) setMaxCount(d.maxCount as number);
      if (d.additionalNotes) setAdditionalNotes(d.additionalNotes as string);
      if (d.outputFormat) setOutputFormat(d.outputFormat as OutputFormat);
    }
  }, [user]);

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords((prev) => [...prev, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  const toggleCourt = (court: string) => {
    if (court === "전체") {
      setSelectedCourts((prev) =>
        prev.includes("전체") ? [] : ["전체"]
      );
      return;
    }
    setSelectedCourts((prev) => {
      const without = prev.filter((c) => c !== "전체");
      return without.includes(court)
        ? without.filter((c) => c !== court)
        : [...without, court];
    });
  };

  const toggleCaseType = (type: string) => {
    setSelectedCaseTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setUploadedFile(f);
  };

  const handleSubmit = async () => {
    if (!user) {
      saveDraft(pathname, { name, email, org, purpose, keywords, keywordLogic, selectedCourts, startYear, endYear, selectedCaseTypes, lawKeyword, maxCount, additionalNotes, outputFormat });
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!name.trim() || !email.trim()) {
      setSubmitError("이름과 이메일은 필수 입력입니다.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        email: email.trim(),
        name: name.trim(),
        organization: org.trim(),
        purpose,
        searchType: "keyword" as const,
        caseNumbers: "",
        scopeFirst,
        scopeSecond,
        scopeThird,
        outputFormat,
        keywords: JSON.stringify(keywords),
        keywordLogic,
        courts: JSON.stringify(selectedCourts),
        startYear,
        endYear,
        caseTypes: JSON.stringify(selectedCaseTypes),
        lawKeyword: lawKeyword.trim(),
        maxCount,
        additionalNotes: additionalNotes.trim(),
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success banner */}
        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800">의뢰가 접수되었습니다</h3>
                <p className="text-sm text-green-700 mt-1">검토 후 견적과 예상 소요기간을 안내해드립니다.</p>
                <div className="flex items-center gap-3 mt-3">
                  <Link
                    href="/judgment-results"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    결과 확인
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-sm text-green-700 hover:text-green-900 font-medium"
                  >
                    새 의뢰 작성
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          대시보드로 돌아가기
        </Link>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">판결문 수집 의뢰</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            필요한 판결문 정보를 입력해주세요. 확인 후 판결문을 수집하여 제공해드립니다.
          </p>
        </div>

        {/* Section 1: 수집 조건 */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 mb-6 overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 bg-blue-50">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
            <h2 className="text-lg font-semibold text-gray-900">수집 조건</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">검색 키워드</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="hover:text-blue-900">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="예: 가정폭력, 스토킹, 보호명령 (Enter로 추가)"
                  className="w-full outline-none text-sm py-1 placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">연산:</span>
                {(["AND", "OR"] as const).map((op) => (
                  <label key={op} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="logic"
                      checked={keywordLogic === op}
                      onChange={() => setKeywordLogic(op)}
                      className="border-gray-200 text-blue-600 focus:ring-blue-500"
                    />
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

            {/* Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기간 범위</label>
              <div className="flex items-center gap-2">
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="text-gray-500">~</span>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Case type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사건 유형</label>
              <div className="flex flex-wrap gap-4">
                {CASE_TYPES.map((ct) => (
                  <label key={ct.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCaseTypes.includes(ct.value)}
                      onChange={() => toggleCaseType(ct.value)}
                      className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                    />
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

            {/* Max count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">최대 수집 건수</label>
              <input
                type="number"
                value={maxCount}
                onChange={(e) => setMaxCount(Number(e.target.value))}
                min={1}
                className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Scope checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">수집 범위</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={scopeFirst} onChange={(e) => setScopeFirst(e.target.checked)} className="rounded border-gray-200 text-blue-600 focus:ring-blue-500" />
                  1심 판결문
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={scopeSecond} onChange={(e) => setScopeSecond(e.target.checked)} className="rounded border-gray-200 text-blue-600 focus:ring-blue-500" />
                  2심/항소심
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={scopeThird} onChange={(e) => setScopeThird(e.target.checked)} className="rounded border-gray-200 text-blue-600 focus:ring-blue-500" />
                  3심/대법원
                </label>
              </div>
            </div>

            {/* Output format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">출력 형식</label>
              <div className="flex flex-wrap gap-4">
                {(["pdf", "text", "both"] as const).map((fmt) => (
                  <label key={fmt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="outputFormat"
                      checked={outputFormat === fmt}
                      onChange={() => setOutputFormat(fmt)}
                      className="border-gray-200 text-blue-600 focus:ring-blue-500"
                    />
                    {fmt === "pdf" ? "PDF" : fmt === "text" ? "텍스트" : "둘 다"}
                  </label>
                ))}
              </div>
            </div>

            {/* File attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                참고 파일 첨부 <span className="text-gray-400 font-normal">(선택 - 사건번호 목록 등)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  파일 선택
                </button>
                <span className="text-sm text-gray-500">
                  {uploadedFile ? uploadedFile.name : "txt, xlsx, pdf 등"}
                </span>
                {uploadedFile && (
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.xlsx,.xls,.pdf,.hwp,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">사건번호 목록이나 참고 자료가 있으면 첨부해주세요</p>
            </div>
          </div>
        </div>

        {/* Section 2: Requester info */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 mb-6 overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 bg-blue-50">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
            <h2 className="text-lg font-semibold text-gray-900">의뢰자 정보</h2>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  소속 <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">사용 목적</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as Purpose)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="학술연구">학술연구</option>
                  <option value="정책연구">정책연구</option>
                  <option value="실무참고">실무참고</option>
                  <option value="교육">교육</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Additional notes */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 mb-6 overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 bg-blue-50">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
            <h2 className="text-lg font-semibold text-gray-900">추가 요청사항</h2>
          </div>
          <div className="px-6 pb-6">
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              placeholder="수집 시 특별히 확인이 필요한 사항이 있으면 기재해주세요"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Cost info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-700 mb-2">수집 비용 안내</h3>
              <p className="text-sm text-blue-700 mb-3">
                수집 건수와 난이도에 따라 비용이 달라집니다.
              </p>
              <ul className="space-y-1.5 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">&#8226;</span>
                  <span><strong>사건번호 지정:</strong> ~100 크레딧/건</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">&#8226;</span>
                  <span><strong>키워드 검색 수집:</strong> ~200 크레딧/건 (검색 포함)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">&#8226;</span>
                  <span><strong>대량 수집 (50건 이상):</strong> 별도 견적</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit */}
        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}
        <div className="flex justify-end items-center gap-3">
          <SampleButton title="판결문 코딩 결과물 샘플"><JudgmentCodingDetail /></SampleButton>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "접수 중..." : "수집 의뢰 접수"}
          </button>
        </div>
      </div>
    </div>
  );
}
