"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserAuthContext";
import PageHeader from "@/components/PageHeader";

interface ConsultationRequest {
  id: string;
  email: string;
  services: string[];
  budget: string;
  timeline: string;
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

const serviceOptions = [
  { key: "research-design", label: "연구 주제 및 방향 설계", desc: "연구 주제 선정, 문헌 검토, 연구 방향 수립" },
  { key: "stats-design", label: "통계분석 설계", desc: "분석 방법 선정, 표본 산출, 변수 설계" },
  { key: "survey", label: "설문조사 설계 & 실시", desc: "설문지 제작, 배포, 응답 수집" },
  { key: "judgment", label: "판결문 수집 & 코딩", desc: "판결문 검색, 수집, 코딩 체계 구성" },
  { key: "news", label: "뉴스/언론 보도 수집", desc: "키워드 기반 뉴스 검색 및 수집" },
  { key: "data-transform", label: "전처리 & 기초통계", desc: "데이터 정제, 변환, 기초통계 산출" },
  { key: "quant-analysis", label: "통계분석", desc: "회귀분석, ANOVA, SEM 등 양적 분석" },
  { key: "text-analysis", label: "텍스트 & 질적분석", desc: "텍스트 마이닝, 내용분석, 질적 코딩" },
  { key: "journal-submission", label: "국제학술지 투고 지원", desc: "저널 선정, 논문 교정, 투고 절차 안내" },
  { key: "other", label: "기타 / 잘 모르겠어요", desc: "상담을 통해 필요한 서비스를 알아보고 싶습니다" },
];

const budgetOptions = ["50만원 이하", "50~100만원", "100~300만원", "300만원 이상", "상담 후 결정"];
const timelineOptions = ["1주 이내", "2~3주", "1~2개월", "3개월 이상", "상담 후 결정"];

const statusConfig = {
  pending: { label: "대기중", bg: "bg-gray-100", text: "text-gray-600" },
  in_progress: { label: "상담중", bg: "bg-blue-50", text: "text-blue-600" },
  completed: { label: "완료", bg: "bg-green-50", text: "text-green-600" },
};

export default function ConsultationPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Detail panel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/consultation");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const fetchMessages = useCallback(async (reqId: string) => {
    try {
      const res = await fetch(`/api/consultation/${reqId}/messages`);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedRequest = requests.find((r) => r.id === selectedId);

  const toggleService = (key: string) => {
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (selectedServices.length === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          services: selectedServices,
          budget,
          timeline,
          description: description.trim(),
        }),
      });
      setSelectedServices([]);
      setBudget("");
      setTimeline("");
      setDescription("");
      setSubmitted(true);
      await fetchRequests();
      setTimeout(() => setSubmitted(false), 5000);
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedId || !chatInput.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      await fetch(`/api/consultation/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: chatInput.trim() }),
      });
      setChatInput("");
      await fetchMessages(selectedId);
    } catch { /* ignore */ } finally {
      setSendingChat(false);
    }
  };

  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">간편 상담 신청</h1>
        <p className="text-gray-600 text-sm leading-relaxed mt-2">
          어떤 서비스가 필요한지 잘 모르셔도 괜찮습니다. 관심 있는 항목을 체크하고 간단히 설명해 주시면,
          전문 상담사가 맞춤 안내를 드립니다.
        </p>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">상담 신청이 접수되었습니다. 빠른 시일 내 연락드리겠습니다.</p>
        </div>
      )}

      {/* Consultation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">상담 신청서</h2>
        </div>
        <div className="px-6 py-5 space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              관심 서비스 선택 <span className="text-red-400">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">복수 선택 가능</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceOptions.map((svc) => {
                const checked = selectedServices.includes(svc.key);
                return (
                  <label
                    key={svc.key}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(svc.key)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/40"
                    />
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${checked ? "text-primary" : "text-gray-800"}`}>
                        {svc.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{svc.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예상 예산</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
              >
                <option value="">선택해주세요 (선택)</option>
                {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">희망 일정</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
              >
                <option value="">선택해주세요 (선택)</option>
                {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요청사항 / 연구 개요
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="간단히 설명해 주세요. 예: 석사 논문을 쓰고 있는데, 설문 설계부터 통계분석까지 도움이 필요합니다."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="연락받을 이메일 주소"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 md:max-w-sm"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting || selectedServices.length === 0}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "제출 중..." : "상담 신청하기"}
            </button>
          </div>
        </div>
      </form>

      {/* Request List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">상담 내역</h2>
        </div>
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-gray-400">아직 상담 내역이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((req) => {
              const sc = statusConfig[req.status];
              const labels = req.services
                .map((k) => serviceOptions.find((s) => s.key === k)?.label ?? k)
                .join(", ");
              return (
                <div
                  key={req.id}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedId(req.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 truncate">{labels}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 truncate max-w-xs">{req.description || "설명 없음"}</span>
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

      {/* Detail Panel */}
      {selectedId && selectedRequest && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={() => setSelectedId(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">간편 상담</h3>
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">선택 서비스</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.services.map((k) => (
                      <span key={k} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {serviceOptions.find((s) => s.key === k)?.label ?? k}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedRequest.budget && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">예상 예산</p>
                    <p className="text-sm text-gray-700">{selectedRequest.budget}</p>
                  </div>
                )}
                {selectedRequest.timeline && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">희망 일정</p>
                    <p className="text-sm text-gray-700">{selectedRequest.timeline}</p>
                  </div>
                )}
                {selectedRequest.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">요청사항</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                )}
              </div>

              {/* Admin Response */}
              {selectedRequest.status === "completed" && selectedRequest.adminResponse && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-700">상담 결과</span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedRequest.adminResponse}</div>
                  </div>
                </div>
              )}

              {/* Chat */}
              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">문의 및 대화</p>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">아직 메시지가 없습니다. 아래에서 문의사항을 보내보세요.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${msg.sender === "user" ? "bg-primary/10 border border-teal-600/20 text-gray-900" : "bg-gray-100 text-gray-900"}`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-primary/60 text-right" : "text-gray-400"}`}>
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

            {/* Chat Input */}
            <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingChat || !chatInput.trim()}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
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
