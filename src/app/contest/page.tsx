"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserAuthContext";
import InfoTooltip from "@/components/InfoTooltip";

type Scope = "domestic" | "international";

interface ContestRequestItem {
  id: string;
  email: string;
  scope: Scope;
  contestField: string;
  contestName: string;
  eligibility: string;
  deadline: string;
  stage: string;
  supportItems: string; // JSON array string
  description: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
}

interface ChatMessage {
  id: string;
  requestId: string;
  sender: "user" | "admin";
  message: string;
  createdAt: string;
}

const fieldOptionsByScope: Record<Scope, string[]> = {
  domestic: [
    "창업/사업화", "학술/논문", "정책 제안", "디자인",
    "창의 아이디어", "영상/콘텐츠", "광고/마케팅", "공학/기술", "기타",
  ],
  international: [
    "International Startup / Business",
    "International Research / Academic",
    "Global Policy / Social Innovation",
    "Design / Creative",
    "Tech / Engineering Challenge",
    "Film / Video / Media",
    "Marketing / Advertising",
    "Hackathon / Innovation",
    "기타",
  ],
};

const eligibilityOptionsByScope: Record<Scope, string[]> = {
  domestic: [
    "대학생", "대학원생", "일반인 / 직장인", "청소년 / 고등학생",
    "팀 단위", "스타트업 / 예비창업자", "제한 없음",
  ],
  international: [
    "Undergraduate", "Graduate / PhD", "Professional / Working",
    "Team", "Startup / Founder", "한국인 거주자 (영문 지원 필요)",
    "제한 없음",
  ],
};

const stageOptions = [
  "공모전 정보 탐색 단계",
  "참가 확정, 아직 시작 전",
  "주제/아이템 구상 중",
  "초안 작성 중",
  "초안 완성 (검토/보완 필요)",
  "최종 마무리 단계",
];

const supportItemOptionsByScope: Record<Scope, { key: string; label: string; desc: string }[]> = {
  domestic: [
    { key: "info", label: "공모전 정보 안내", desc: "분야·자격·마감·수상작 정리" },
    { key: "topic", label: "주제/아이템 발굴", desc: "차별화된 기획 방향 도출" },
    { key: "data", label: "자료 수집", desc: "설문·판결문·뉴스 등" },
    { key: "stats", label: "통계분석", desc: "근거 데이터 분석" },
    { key: "qual", label: "텍스트/질적분석", desc: "인터뷰·문헌 분석" },
    { key: "writing", label: "응모 자료 작성", desc: "사업계획서·제안서·논문" },
    { key: "pt", label: "발표자료 (PT)", desc: "스토리·디자인" },
    { key: "review", label: "최종 검토·보완", desc: "심사 기준 부합 점검" },
  ],
  international: [
    { key: "info", label: "공모전 정보 안내", desc: "글로벌 공모전 탐색·자격·마감 정리" },
    { key: "topic", label: "주제/아이템 발굴", desc: "글로벌 트렌드 기반 기획" },
    { key: "data", label: "자료 수집", desc: "해외 데이터·문헌·시장조사" },
    { key: "stats", label: "통계분석", desc: "근거 데이터 분석" },
    { key: "qual", label: "텍스트/질적분석", desc: "영문 문헌·인터뷰 분석" },
    { key: "writing", label: "영문 응모 자료 작성", desc: "Business Plan·Proposal·Paper" },
    { key: "pt", label: "영문 발표자료 (PT)", desc: "Pitch Deck·Visual Storytelling" },
    { key: "translation", label: "번역 / 영문 교정", desc: "한→영 번역, 네이티브 교정" },
    { key: "review", label: "최종 검토·보완", desc: "심사 기준·언어 표현 점검" },
  ],
};

const statusConfig = {
  pending: { label: "대기중", bg: "bg-gray-100", text: "text-gray-600" },
  in_progress: { label: "진행중", bg: "bg-blue-50", text: "text-blue-600" },
  completed: { label: "완료", bg: "bg-green-50", text: "text-green-600" },
};

export default function ContestPage() {
  return (
    <Suspense fallback={<div className="p-8 max-w-4xl mx-auto text-sm text-gray-400">불러오는 중...</div>}>
      <ContestPageInner />
    </Suspense>
  );
}

function ContestPageInner() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scopeParam = searchParams.get("scope");
  const scope: Scope = scopeParam === "international" ? "international" : "domestic";
  const isIntl = scope === "international";

  const fieldOptions = fieldOptionsByScope[scope];
  const eligibilityOptions = eligibilityOptionsByScope[scope];
  const supportItemOptions = supportItemOptionsByScope[scope];

  const [email, setEmail] = useState("");
  const [contestField, setContestField] = useState("");
  const [contestName, setContestName] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [deadline, setDeadline] = useState("");
  const [stage, setStage] = useState("");
  const [supportItems, setSupportItems] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<ContestRequestItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user?.email && !email) setEmail(user.email); }, [user]);

  // Reset scope-dependent fields when scope changes (so options stay valid)
  useEffect(() => {
    setContestField("");
    setEligibility("");
    setSupportItems([]);
  }, [scope]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/contest");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const fetchMessages = useCallback(async (reqId: string) => {
    try {
      const res = await fetch(`/api/contest/${reqId}/messages`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetchMessages(selectedId);
    const interval = setInterval(() => fetchMessages(selectedId), 5000);
    return () => clearInterval(interval);
  }, [selectedId, fetchMessages]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const selectedRequest = requests.find((r) => r.id === selectedId);

  const toggleSupport = (key: string) => {
    setSupportItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); return; }
    if (!contestField) return;
    if (supportItems.length === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/contest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          scope,
          contestField,
          contestName: contestName.trim(),
          eligibility,
          deadline: deadline.trim(),
          stage,
          supportItems: JSON.stringify(supportItems),
          description: description.trim(),
        }),
      });
      setContestField(""); setContestName(""); setEligibility("");
      setDeadline(""); setStage(""); setSupportItems([]); setDescription("");
      setSubmitted(true);
      await fetchRequests();
      setTimeout(() => setSubmitted(false), 5000);
    } catch { /* ignore */ } finally { setSubmitting(false); }
  };

  const handleSendMessage = async () => {
    if (!selectedId || !chatInput.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      await fetch(`/api/contest/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: chatInput.trim() }),
      });
      setChatInput("");
      await fetchMessages(selectedId);
    } catch { /* ignore */ } finally { setSendingChat(false); }
  };

  // Show only requests matching the current scope (legacy items without scope are treated as domestic)
  const filtered = requests.filter((r) => (r.scope ?? "domestic") === scope);
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const parseSupportItems = (raw: string): string[] => {
    try {
      const arr = JSON.parse(raw || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  };

  const supportLabel = (key: string) =>
    supportItemOptions.find((o) => o.key === key)?.label ?? key;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isIntl ? "국제공모전 상담신청" : "국내공모전 상담신청"}
        </h1>
        <div className="flex items-start gap-2 mt-2">
          <p className="text-gray-600 text-sm leading-relaxed">
            {isIntl
              ? "해외/글로벌 공모전 참가를 준비 중이시라면, 영문 자료 작성·번역·교정부터 주제 발굴·데이터 분석까지 한 흐름으로 지원해 드립니다."
              : "참가하고자 하는 공모전 종류를 알려주시면, 주제 발굴부터 자료 수집·통계분석·응모 자료 작성까지 필요한 부분을 한 흐름으로 지원해 드립니다."}
          </p>
          <InfoTooltip text={isIntl
            ? "📋 국제공모전 지원 항목:\n• 글로벌 공모전 정보 안내\n• 주제 / 아이템 발굴 (글로벌 트렌드 기반)\n• 해외 데이터 수집 / 시장조사\n• 통계분석 / 영문 문헌·인터뷰 분석\n• 영문 Business Plan·Proposal·Paper 작성\n• 영문 Pitch Deck / Visual Storytelling\n• 한→영 번역 및 네이티브 교정\n• 최종 검토 및 심사 기준 부합 점검"
            : "📋 국내공모전 지원 항목:\n• 공모전 정보 안내 (분야·자격·마감·수상작)\n• 주제 / 아이템 발굴 및 차별화\n• 자료 수집 (설문·판결문·뉴스)\n• 통계분석 / 텍스트·질적분석\n• 사업계획서·제안서·발표자료 작성\n• 최종 검토 및 심사 기준 부합 점검\n\n잘 모르셔도 괜찮습니다.\n관심 분야와 필요 항목만 선택해 주세요."} />
        </div>
      </div>

      {/* Scope tabs */}
      <div className="mb-6 inline-flex p-1 bg-gray-100 rounded-lg">
        <Link href="/contest?scope=domestic"
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            !isIntl ? "bg-white shadow-sm text-teal-700" : "text-gray-500 hover:text-gray-700"
          }`}>
          국내공모전
        </Link>
        <Link href="/contest?scope=international"
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isIntl ? "bg-white shadow-sm text-teal-700" : "text-gray-500 hover:text-gray-700"
          }`}>
          국제공모전
        </Link>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">{isIntl ? "국제공모전 상담 신청이 접수되었습니다." : "국내공모전 상담 신청이 접수되었습니다."} 빠른 시일 내 연락드리겠습니다.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">{isIntl ? "국제공모전 상담 신청" : "국내공모전 상담 신청"}</h2>
          <p className="text-xs text-gray-500 mt-1">공모전 분야와 필요한 지원 항목만 선택해도 됩니다.</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                공모전 분야 <span className="text-red-400">*</span>
              </label>
              <select value={contestField} onChange={(e) => setContestField(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" required>
                <option value="">선택해주세요</option>
                {fieldOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">공모전명 / 주관기관</label>
              <input type="text" value={contestName} onChange={(e) => setContestName(e.target.value)}
                placeholder={isIntl ? "예: Hult Prize, MIT Solve, Global Innovation Challenge" : "예: 청년 창업 공모전 (○○공단 주관)"}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">자격 / 참가 형태</label>
              <select value={eligibility} onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600">
                <option value="">선택해주세요 (선택)</option>
                {eligibilityOptions.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">마감일 / 일정</label>
              <input type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                placeholder="예: 2026-06-15"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 진행 단계</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600">
                <option value="">선택해주세요 (선택)</option>
                {stageOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              필요한 지원 항목 <span className="text-red-400">*</span>
              <span className="ml-2 text-xs font-normal text-gray-400">중복 선택 가능</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {supportItemOptions.map((opt) => {
                const checked = supportItems.includes(opt.key);
                return (
                  <button key={opt.key} type="button" onClick={() => toggleSupport(opt.key)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      checked
                        ? "bg-teal-50 border-teal-600 ring-1 ring-teal-600/40"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}>
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        checked ? "bg-teal-600 border-teal-600" : "bg-white border-gray-300"
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${checked ? "text-teal-700" : "text-gray-900"}`}>{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 요청사항</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={isIntl
                ? "예: Hult Prize 글로벌 스타트업 공모전에 4인 팀으로 참가합니다. ESG 헬스케어 아이템이고, 영문 사업계획서 10장과 Pitch Deck이 필요합니다. 한→영 번역 및 네이티브 교정도 부탁드립니다."
                : "예: 대학생 4인 팀이 참가하는 ESG 관련 창업 공모전입니다. 헬스케어 아이템 방향이고, 차별화 포인트와 시장 분석 데이터가 필요합니다. 사업계획서 5장 분량으로 응모 예정입니다."}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="연락받을 이메일 주소"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 md:max-w-sm" />
          </div>

          <div className="pt-1">
            <button type="submit" disabled={submitting || !contestField || supportItems.length === 0}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "제출 중..." : (isIntl ? "국제공모전 상담 신청하기" : "국내공모전 상담 신청하기")}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="font-semibold">{isIntl ? "국제공모전 상담 내역" : "국내공모전 상담 내역"}</h2></div>
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-400">아직 상담 신청 내역이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((req) => {
              const sc = statusConfig[req.status];
              const items = parseSupportItems(req.supportItems);
              return (
                <div key={req.id}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedId(req.id)}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {req.contestField}{req.contestName ? ` · ${req.contestName}` : ""}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 truncate max-w-md">
                        {items.length > 0 ? items.map(supportLabel).join(" · ") : (req.description || "")}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">{new Date(req.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedId && selectedRequest && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={() => setSelectedId(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {selectedRequest.contestField}{selectedRequest.contestName ? ` · ${selectedRequest.contestName}` : ""}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedRequest.status].bg} ${statusConfig[selectedRequest.status].text}`}>
                    {statusConfig[selectedRequest.status].label}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(selectedRequest.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 shrink-0">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 space-y-3">
                {(() => {
                  const items = parseSupportItems(selectedRequest.supportItems);
                  return items.length > 0 ? (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">지원 요청 항목</p>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((k) => (
                          <span key={k} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                            {supportLabel(k)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
                {selectedRequest.eligibility && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">자격 / 참가 형태</p>
                    <p className="text-sm text-gray-700">{selectedRequest.eligibility}</p>
                  </div>
                )}
                {selectedRequest.deadline && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">마감일</p>
                    <p className="text-sm text-gray-700">{selectedRequest.deadline}</p>
                  </div>
                )}
                {selectedRequest.stage && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">진행 단계</p>
                    <p className="text-sm text-gray-700">{selectedRequest.stage}</p>
                  </div>
                )}
                {selectedRequest.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">요청사항</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === "completed" && selectedRequest.adminResponse && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-700">지원 결과</span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedRequest.adminResponse}</div>
                  </div>
                </div>
              )}

              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">문의 및 대화</p>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">아직 메시지가 없습니다. 아래에서 추가 문의를 보내보세요.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${msg.sender === "user" ? "bg-teal-50 border border-teal-200 text-gray-900" : "bg-gray-100 text-gray-900"}`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-teal-600/60 text-right" : "text-gray-400"}`}>
                            {new Date(msg.createdAt).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-white">
              <div className="flex gap-2">
                <input type="text" value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" />
                <button onClick={handleSendMessage} disabled={sendingChat || !chatInput.trim()}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            .animate-slide-in { animation: slideIn 0.3s ease-out; }
          `}</style>
        </>
      )}
    </div>
  );
}
