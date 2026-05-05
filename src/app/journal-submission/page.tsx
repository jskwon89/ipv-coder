"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserAuthContext";
import InfoTooltip from "@/components/InfoTooltip";

interface JournalRequest {
  id: string;
  email: string;
  serviceType: string;
  journalField: string;
  targetJournal: string;
  paperStage: string;
  language: string;
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

const serviceTypeOptions = [
  "저널 선정 컨설팅",
  "논문 영문 교정 (Proofreading)",
  "논문 번역 (한→영)",
  "투고 커버레터 작성",
  "리뷰어 응답 작성 지원",
  "논문 포맷팅 (저널 규정)",
  "통계 결과 검증 & 보완",
  "종합 투고 패키지",
  "기타 / 상담 후 결정",
];

const fieldOptions = [
  "사회과학", "교육학", "심리학", "경영/경제", "법학",
  "의학/보건", "공학", "자연과학", "인문학", "기타",
];

const stageOptions = [
  "아직 시작 전 (상담 원함)",
  "초고 작성 중",
  "초고 완성 (투고 전)",
  "1차 심사 후 수정 (R&R)",
  "2차 이상 수정",
  "리젝 후 재투고",
];

const statusConfig = {
  pending: { label: "대기중", bg: "bg-gray-100", text: "text-gray-600" },
  in_progress: { label: "상담중", bg: "bg-blue-50", text: "text-blue-600" },
  completed: { label: "완료", bg: "bg-green-50", text: "text-green-600" },
};

export default function JournalSubmissionPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [journalField, setJournalField] = useState("");
  const [targetJournal, setTargetJournal] = useState("");
  const [paperStage, setPaperStage] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<JournalRequest[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user?.email && !email) setEmail(user.email); }, [user]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/journal-submission");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const fetchMessages = useCallback(async (reqId: string) => {
    try {
      const res = await fetch(`/api/journal-submission/${reqId}/messages`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); return; }
    if (!serviceType) return;
    setSubmitting(true);
    try {
      await fetch("/api/journal-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(), serviceType, journalField, targetJournal: targetJournal.trim(),
          paperStage, language, description: description.trim(),
        }),
      });
      setServiceType(""); setJournalField(""); setTargetJournal("");
      setPaperStage(""); setLanguage(""); setDescription("");
      await fetchRequests();
    } catch { /* ignore */ } finally { setSubmitting(false); }
  };

  const handleSendMessage = async () => {
    if (!selectedId || !chatInput.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      await fetch(`/api/journal-submission/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: chatInput.trim() }),
      });
      setChatInput("");
      await fetchMessages(selectedId);
    } catch { /* ignore */ } finally { setSendingChat(false); }
  };

  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">국제학술지 투고 상담</h1>
        <div className="flex items-start gap-2 mt-2">
          <p className="text-gray-600 text-sm leading-relaxed">
            SSCI, SCI, SCOPUS 등 국제학술지 투고를 위한 전문 상담 서비스입니다.
            저널 선정, 영문 교정, 투고 절차 등 어떤 단계에서든 도움을 받으실 수 있습니다.
          </p>
          <InfoTooltip text={"📋 상담 가능 내용:\n• 적합 저널 추천 (Impact Factor, 심사 기간 고려)\n• 논문 영문 교정 & 번역\n• 투고 커버레터 작성\n• 저널 규정에 맞는 포맷팅\n• Reviewer 코멘트 응답 작성 지원\n• 리젝 후 재투고 전략 수립\n\n잘 모르셔도 괜찮습니다.\n상담을 통해 필요한 서비스를 안내해 드립니다."} />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "저널 선정", desc: "연구에 적합한 저널 추천" },
          { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", title: "교정 & 번역", desc: "원어민 수준 영문 교정" },
          { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "투고 지원", desc: "커버레터부터 리뷰 응답까지" },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">상담 신청</h2>
          <p className="text-xs text-gray-500 mt-1">구체적인 내용을 모르셔도 괜찮습니다. 간단히 선택하고 상담을 통해 진행하세요.</p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                관심 서비스 <span className="text-red-400">*</span>
              </label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" required>
                <option value="">선택해주세요</option>
                {serviceTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연구 분야</label>
              <select value={journalField} onChange={(e) => setJournalField(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600">
                <option value="">선택해주세요 (선택)</option>
                {fieldOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">논문 진행 단계</label>
              <select value={paperStage} onChange={(e) => setPaperStage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600">
                <option value="">선택해주세요 (선택)</option>
                {stageOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">투고 대상 저널</label>
              <input type="text" value={targetJournal} onChange={(e) => setTargetJournal(e.target.value)}
                placeholder="미정이면 비워두세요"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">궁금한 점 / 요청사항</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 범죄학 분야 SSCI 저널에 투고하고 싶은데, 어떤 저널이 적합한지부터 상담받고 싶습니다."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="연락받을 이메일 주소"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 md:max-w-sm" />
          </div>

          <div className="pt-1">
            <button type="submit" disabled={submitting || !serviceType}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "제출 중..." : "상담 신청하기"}
            </button>
          </div>
        </div>
      </form>

      {/* Request List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="font-semibold">상담 내역</h2></div>
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-400">아직 상담 내역이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((req) => {
              const sc = statusConfig[req.status];
              return (
                <div key={req.id}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedId(req.id)}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 truncate">{req.serviceType}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 truncate max-w-xs">{req.journalField || req.description || ""}</span>
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{selectedRequest.serviceType}</h3>
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
                {selectedRequest.journalField && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">연구 분야</p>
                    <p className="text-sm text-gray-700">{selectedRequest.journalField}</p>
                  </div>
                )}
                {selectedRequest.targetJournal && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">투고 대상 저널</p>
                    <p className="text-sm text-gray-700">{selectedRequest.targetJournal}</p>
                  </div>
                )}
                {selectedRequest.paperStage && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">논문 진행 단계</p>
                    <p className="text-sm text-gray-700">{selectedRequest.paperStage}</p>
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
                      <span className="text-sm font-medium text-green-700">상담 결과</span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedRequest.adminResponse}</div>
                  </div>
                </div>
              )}

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

            <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-white">
              <div className="flex gap-2">
                <input type="text" value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" />
                <button onClick={handleSendMessage} disabled={sendingChat || !chatInput.trim()}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
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
