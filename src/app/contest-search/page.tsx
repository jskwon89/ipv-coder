"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserAuthContext";
import InfoTooltip from "@/components/InfoTooltip";

interface ContestSearchRequestItem {
  id: string;
  email: string;
  contestField: string;
  eligibility: string;
  urgency: string;
  keywords: string;
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

const fieldOptions = [
  "창업/사업화", "학술/논문", "정책 제안", "디자인",
  "창의 아이디어", "영상/콘텐츠", "광고/마케팅", "공학/기술", "기타",
];

const eligibilityOptions = [
  "대학생", "대학원생", "일반인 / 직장인", "청소년 / 고등학생",
  "팀 단위", "스타트업 / 예비창업자", "제한 없음",
];

const urgencyOptions = [
  "1주 이내 마감", "2주 이내", "1개월 이내", "3개월 이내", "기간 무관",
];

const statusConfig = {
  pending: { label: "대기중", bg: "bg-gray-100", text: "text-gray-600" },
  in_progress: { label: "검색중", bg: "bg-blue-50", text: "text-blue-600" },
  completed: { label: "완료", bg: "bg-green-50", text: "text-green-600" },
};

export default function ContestSearchPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [contestField, setContestField] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [urgency, setUrgency] = useState("");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<ContestSearchRequestItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user?.email && !email) setEmail(user.email); }, [user]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/contest-search");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const fetchMessages = useCallback(async (reqId: string) => {
    try {
      const res = await fetch(`/api/contest-search/${reqId}/messages`);
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
    if (!contestField) return;
    setSubmitting(true);
    try {
      await fetch("/api/contest-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(), contestField, eligibility, urgency,
          keywords: keywords.trim(), description: description.trim(),
        }),
      });
      setContestField(""); setEligibility(""); setUrgency("");
      setKeywords(""); setDescription("");
      setSubmitted(true);
      await fetchRequests();
      setTimeout(() => setSubmitted(false), 5000);
    } catch { /* ignore */ } finally { setSubmitting(false); }
  };

  const handleSendMessage = async () => {
    if (!selectedId || !chatInput.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      await fetch(`/api/contest-search/${selectedId}/messages`, {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">공모전 정보 검색</h1>
        <div className="flex items-start gap-2 mt-2">
          <p className="text-gray-600 text-sm leading-relaxed">
            관심 분야와 자격 요건을 알려주시면, 적합한 공모전 정보를 정리해 드립니다.
            진행 중인 공모전, 마감 임박 공모전, 분야별 우수 공모전을 한눈에 받아보세요.
          </p>
          <InfoTooltip text={"📋 안내 가능한 정보:\n• 분야별 진행 중 공모전 목록\n• 자격 요건에 맞는 공모전 추천\n• 상금/혜택/인지도가 우수한 공모전\n• 마감일·접수처·심사 기준 정리\n• 과거 수상작 사례 안내\n\n잘 모르셔도 괜찮습니다.\n관심 분야만 알려주시면 맞춤 안내를 드립니다."} />
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">검색 의뢰가 접수되었습니다. 빠른 시일 내 결과를 정리해 드리겠습니다.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">검색 의뢰</h2>
          <p className="text-xs text-gray-500 mt-1">관심 분야만 선택해도 됩니다. 추가 조건은 비워두셔도 좋아요.</p>
        </div>
        <div className="px-6 py-5 space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">자격 요건</label>
              <select value={eligibility} onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600">
                <option value="">선택해주세요 (선택)</option>
                {eligibilityOptions.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">마감 임박도</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600">
                <option value="">선택해주세요 (선택)</option>
                {urgencyOptions.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">검색 키워드</label>
              <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                placeholder="예: AI, ESG, 청년창업"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 요청사항</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 대학생 4인 팀이 참가할 수 있는 ESG 관련 공모전을 찾고 있습니다. 상금 500만원 이상이면 좋겠습니다."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="결과를 받을 이메일 주소"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 md:max-w-sm" />
          </div>

          <div className="pt-1">
            <button type="submit" disabled={submitting || !contestField}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "제출 중..." : "검색 의뢰하기"}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="font-semibold">검색 의뢰 내역</h2></div>
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-gray-400">아직 검색 의뢰 내역이 없습니다</p>
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
                      <span className="text-sm font-medium text-gray-900 truncate">{req.contestField}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 truncate max-w-xs">{req.keywords || req.description || ""}</span>
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
                <h3 className="font-semibold text-gray-900 truncate">{selectedRequest.contestField}</h3>
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
                {selectedRequest.eligibility && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">자격 요건</p>
                    <p className="text-sm text-gray-700">{selectedRequest.eligibility}</p>
                  </div>
                )}
                {selectedRequest.urgency && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">마감 임박도</p>
                    <p className="text-sm text-gray-700">{selectedRequest.urgency}</p>
                  </div>
                )}
                {selectedRequest.keywords && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">키워드</p>
                    <p className="text-sm text-gray-700">{selectedRequest.keywords}</p>
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
                      <span className="text-sm font-medium text-green-700">검색 결과</span>
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
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
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
