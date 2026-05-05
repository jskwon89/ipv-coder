"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserAuthContext";
import ResultFilesPanel from "@/components/ResultFilesPanel";

const services = [
  { type: "research-design", label: "연구 주제 설계", api: "/api/research-design", titleField: "keywords" },
  { type: "stats-design", label: "통계분석 설계", api: "/api/stats-design", titleField: "researchType" },
  { type: "survey", label: "설문조사", api: "/api/survey", titleField: "title" },
  { type: "judgment-collection", label: "판결문 수집", api: "/api/judgment-collection", titleField: "purpose" },
  { type: "judgment-coding", label: "판결문 코딩", api: "/api/judgment-coding", titleField: "projectName" },
  { type: "news-collection", label: "뉴스/언론 수집", api: "/api/news-collection", titleField: "purpose" },
  { type: "data-transform", label: "데이터 전처리", api: "/api/data-transform", titleField: "dataDescription" },
  { type: "quant-analysis", label: "통계분석", api: "/api/quant-analysis", titleField: "analysisType" },
  { type: "qual-analysis", label: "질적분석", api: "/api/qual-analysis", titleField: "analysisType" },
  { type: "text-analysis-request", label: "텍스트 분석", api: "/api/text-analysis-request", titleField: "analysisTypes" },
  { type: "consultation", label: "간편 상담", api: "/api/consultation", titleField: "description" },
  { type: "journal-submission", label: "국제학술지 투고", api: "/api/journal-submission", titleField: "serviceType" },
  { type: "contest", label: "공모전 상담", api: "/api/contest", titleField: "contestField" },
];

interface RequestItem {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  adminResponse: string;
  respondedAt: string;
  _serviceType: string;
  _serviceLabel: string;
  _serviceApi: string;
  _title: string;
  [key: string]: unknown;
}

interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  message: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "접수 대기중", bg: "bg-gray-100", text: "text-gray-600" },
  received: { label: "접수 완료", bg: "bg-yellow-50", text: "text-yellow-700" },
  in_progress: { label: "작업 진행중", bg: "bg-blue-50", text: "text-blue-700" },
  completed: { label: "작업 완료", bg: "bg-emerald-50", text: "text-emerald-700" },
};

type StatusFilter = "all" | "pending" | "in_progress" | "completed";

export default function MyPage() {
  return (
    <Suspense fallback={<div className="p-8 max-w-5xl mx-auto text-sm text-gray-400">불러오는 중...</div>}>
      <MyPageInner />
    </Suspense>
  );
}

function MyPageInner() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialStatus = (searchParams.get("status") as StatusFilter) || "all";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [user, router, pathname]);

  const fetchAll = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const normalizedEmail = user.email.trim().toLowerCase();
      const emailParam = `?email=${encodeURIComponent(normalizedEmail)}`;
      const results = await Promise.all(
        services.map((svc) =>
          fetch(`${svc.api}${emailParam}`)
            .then((r) => r.json())
            .then((d) => ({ svc, requests: d.requests ?? [] }))
            .catch(() => ({ svc, requests: [] }))
        )
      );
      const merged: RequestItem[] = [];
      for (const { svc, requests: reqs } of results) {
        for (const r of reqs) {
          merged.push({
            ...r,
            _serviceType: svc.type,
            _serviceLabel: svc.label,
            _serviceApi: svc.api,
            _title: String(r[svc.titleField] ?? "").slice(0, 60) || svc.label,
          });
        }
      }
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequests(merged);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const fetchMessages = useCallback(async (req: RequestItem) => {
    try {
      const res = await fetch(`${req._serviceApi}/${req.id}/messages`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch { /* ignore */ }
  }, []);

  const selectedReq = requests.find((r) => r.id === selectedId);

  useEffect(() => {
    if (!selectedReq) return;
    fetchMessages(selectedReq);
    const interval = setInterval(() => fetchMessages(selectedReq), 5000);
    return () => clearInterval(interval);
  }, [selectedReq, fetchMessages]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedReq || !chatInput.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      await fetch(`${selectedReq._serviceApi}/${selectedReq.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: chatInput.trim() }),
      });
      setChatInput("");
      await fetchMessages(selectedReq);
    } catch { /* ignore */ } finally { setSendingChat(false); }
  };

  const filtered = requests.filter((r) => {
    if (serviceFilter !== "all" && r._serviceType !== serviceFilter) return false;
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return r.status === "pending" || r.status === "received";
    return r.status === statusFilter;
  });

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending" || r.status === "received").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  const setStatus = (s: StatusFilter) => {
    setStatusFilter(s);
    const sp = new URLSearchParams(searchParams.toString());
    if (s === "all") sp.delete("status"); else sp.set("status", s);
    router.replace(`${pathname}?${sp.toString()}`);
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">내 의뢰</h1>
        <p className="text-sm text-gray-500 mt-1">{user.email}님이 신청하신 모든 의뢰의 진행 상황과 결과 파일을 한 곳에서 확인하실 수 있습니다.</p>
      </div>

      {/* Status counter cards (clickable filters) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {([
          { key: "all", label: "전체", value: counts.total, accent: "text-gray-900", bg: "bg-slate-50", border: "border-gray-200" },
          { key: "pending", label: "접수", value: counts.pending, accent: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
          { key: "in_progress", label: "진행중", value: counts.in_progress, accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { key: "completed", label: "완료", value: counts.completed, accent: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        ] as const).map((c) => {
          const active = statusFilter === c.key;
          return (
            <button key={c.key} onClick={() => setStatus(c.key)}
              className={`text-left rounded-xl p-4 border transition-all ${c.bg} ${c.border} ${active ? "ring-2 ring-teal-500/50 shadow-sm" : "hover:shadow-sm"}`}>
              <div className={`text-2xl sm:text-3xl font-bold ${c.accent}`}>{c.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{c.label}</div>
            </button>
          );
        })}
      </div>

      {/* Service filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setServiceFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            serviceFilter === "all" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}>
          전체 서비스
        </button>
        {services.map((svc) => {
          const has = requests.some((r) => r._serviceType === svc.type);
          if (!has) return null;
          return (
            <button key={svc.type} onClick={() => setServiceFilter(svc.type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                serviceFilter === svc.type ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}>
              {svc.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-400 mb-3">의뢰 내역이 없습니다</p>
            <Link href="/" className="text-sm text-teal-600 hover:text-teal-700 font-medium">서비스 둘러보기 →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((req) => {
              const sc = statusConfig[req.status] ?? statusConfig.pending;
              return (
                <div key={`${req._serviceType}-${req.id}`}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedId(req.id)}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{req._serviceLabel}</span>
                      <span className="text-sm font-medium text-gray-900 truncate">{req._title || "(제목 없음)"}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
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

      {/* Detail slide-over */}
      {selectedReq && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedId(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{selectedReq._serviceLabel}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${(statusConfig[selectedReq.status] ?? statusConfig.pending).bg} ${(statusConfig[selectedReq.status] ?? statusConfig.pending).text}`}>
                    {(statusConfig[selectedReq.status] ?? statusConfig.pending).label}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{selectedReq._title || "(제목 없음)"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(selectedReq.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 shrink-0">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Result files */}
              <div className="px-6 py-4 border-b border-gray-100">
                <ResultFilesPanel
                  serviceType={selectedReq._serviceType}
                  requestId={selectedReq.id}
                  mode="user"
                />
              </div>

              {/* Admin response */}
              {selectedReq.adminResponse && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-emerald-700">담당자 응답</span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedReq.adminResponse}</div>
                  </div>
                </div>
              )}

              {/* Chat */}
              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">문의 및 대화</p>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">아직 메시지가 없습니다.</p>
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
