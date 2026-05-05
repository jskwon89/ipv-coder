"use client";
import ServiceTabs from "@/components/ServiceTabs";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useUser } from "@/contexts/UserAuthContext";

const analysisTypes = [
  "인터뷰 분석",
  "관찰 분석",
  "주제분석(Thematic Analysis)",
  "근거이론(Grounded Theory)",
  "내러티브 분석",
  "담론분석",
  "내용분석",
  "기타",
];

const dataFormatOptions = [
  "인터뷰 녹취록",
  "관찰 기록",
  "문서/텍스트",
  "영상/음성",
  "기타",
];

export default function QualAnalysisPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [analysisType, setAnalysisType] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataFormat, setDataFormat] = useState("");
  const [analysisGoal, setAnalysisGoal] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!email.trim() || !analysisType) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/qual-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          analysisType,
          dataDescription: dataDescription.trim(),
          dataFormat,
          analysisGoal: analysisGoal.trim(),
          additionalNotes: additionalNotes.trim(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      console.error("의뢰 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <ServiceTabs tabs={[{ label: "분석 의뢰", href: "/qual-analysis" }, { label: "결과 확인", href: "/qual-results" }]} />
      <PageHeader
        title="질적분석 의뢰"
        subtitle="인터뷰, 관찰, 문서 등 질적 데이터 분석을 의뢰합니다"
        detailTooltip={"📋 요청 순서:\n① 분석 유형·데이터 형식 선택\n② 데이터 설명·분석 목표 작성\n③ 이메일·추가 요청사항 입력 → 의뢰 접수\n④ 결과 확인에서 진행 상황·채팅\n\n지원 유형:\n• 주제분석 (Thematic Analysis)\n• 근거이론 (Grounded Theory)\n• 내러티브·담론·내용분석\n• 인터뷰·관찰 데이터 분석"}
        breadcrumbs={[
          { label: "데이터 분석" },
          { label: "질적분석" },
        ]}
        iconBgClass="bg-amber-50"
        iconTextClass="text-primary"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
              <h3 className="font-semibold text-green-800">질적분석 의뢰가 접수되었습니다</h3>
              <p className="text-sm text-green-700 mt-1">
                담당자 검토 후 결과를 제공해 드리겠습니다. 진행 상황은 결과 확인 페이지에서 확인하실 수 있습니다.
              </p>
              <Link
                href="/qual-results"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
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

      {/* Analysis settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">분석 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              분석 유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
            >
              <option value="">선택하세요</option>
              {analysisTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">데이터 형식</label>
            <select
              value={dataFormat}
              onChange={(e) => setDataFormat(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
            >
              <option value="">선택하세요</option>
              {dataFormatOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">데이터 설명</label>
            <textarea
              value={dataDescription}
              onChange={(e) => setDataDescription(e.target.value)}
              rows={3}
              placeholder="보유하신 데이터의 내용, 규모, 수집 방법 등을 설명해주세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">분석 목표</label>
            <textarea
              value={analysisGoal}
              onChange={(e) => setAnalysisGoal(e.target.value)}
              rows={3}
              placeholder="분석을 통해 알고자 하는 것, 연구 질문 등을 기술해주세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none"
            />
          </div>
        </div>
      </div>

      {/* File attachment */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">자료 파일 첨부</h2>
        <div
          onDrop={(e) => { e.preventDefault(); setDragging(false); const files = Array.from(e.dataTransfer.files); setAttachedFiles((prev) => [...prev, ...files]); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging ? "border-teal-600 bg-amber-50" : "border-gray-300 hover:border-teal-600/50 hover:bg-amber-50/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.pdf,.docx,.doc,.hwp,.xlsx,.xls,.csv,.zip"
            className="hidden"
            onChange={(e) => { const files = Array.from(e.target.files || []); setAttachedFiles((prev) => [...prev, ...files]); e.target.value = ""; }}
          />
          <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">파일을 드래그하거나 클릭하여 업로드</p>
          <p className="text-xs text-gray-400 mt-1">녹취록, 문서, 텍스트 파일 등 지원</p>
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

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">의뢰 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="결과를 받을 이메일 주소"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">추가 요청사항</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder="추가적으로 요청하실 사항이 있으시면 작성해주세요."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Link
          href="/qual-results"
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          이전 의뢰 결과 확인
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting || !email.trim() || !analysisType}
          className="px-8 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "제출 중..." : "질적분석 의뢰하기"}
        </button>
      </div>
    </div>
  );
}
