"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@/contexts/UserAuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ChatMessage {
  id: string;
  email: string;
  sender: "user" | "admin";
  message: string;
  createdAt: string;
}

const HIDDEN_PATHS = ["/login", "/signup", "/admin"];

/* ── 자동 응답 규칙 ── */
const autoReplies: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["가격", "비용", "요금", "얼마", "크레딧", "결제"],
    reply: "서비스 비용은 작업 범위에 따라 달라집니다. 간편 상담을 통해 구체적인 견적을 받아보실 수 있어요.\n\n상담사에게 연결하시겠어요?",
  },
  {
    keywords: ["기간", "소요", "며칠", "얼마나 걸", "일정", "빠르"],
    reply: "일반적으로 간단한 분석은 3~5일, 종합적인 연구 지원은 1~3주 정도 소요됩니다. 정확한 일정은 상담을 통해 안내드릴 수 있어요.\n\n상담사에게 연결하시겠어요?",
  },
  {
    keywords: ["통계", "분석", "spss", "stata", "회귀", "anova", "t-test", "sem"],
    reply: "PRIMER에서는 기초통계부터 회귀분석, ANOVA, SEM, 생존분석 등 다양한 통계분석을 지원합니다.\n\n'통계분석' 메뉴에서 직접 의뢰하시거나, 상담사에게 자세히 문의하실 수 있어요.",
  },
  {
    keywords: ["설문", "survey", "조사"],
    reply: "설문조사 설계부터 배포, 응답 수집까지 전 과정을 지원합니다.\n\n'자료 생성 & 수집 > 설문조사' 메뉴에서 의뢰하실 수 있어요.",
  },
  {
    keywords: ["판결문", "법원", "판례", "코딩"],
    reply: "판결문 수집, 코딩 체계 구성, 데이터 정리까지 지원합니다.\n\n'자료 생성 & 수집 > 판결문' 메뉴에서 의뢰하실 수 있어요.",
  },
  {
    keywords: ["학술지", "저널", "ssci", "sci", "scopus", "투고", "교정", "번역"],
    reply: "SSCI, SCI, SCOPUS 등 국제학술지 투고를 위한 저널 선정, 영문 교정, 포맷팅, 리뷰어 응답 지원을 제공합니다.\n\n'국제 학술지' 메뉴에서 상담을 신청하실 수 있어요.",
  },
  {
    keywords: ["텍스트", "질적", "내용분석", "토픽", "워드"],
    reply: "텍스트 마이닝, 내용분석, 토픽모델링, 질적 코딩 등 다양한 텍스트·질적분석을 지원합니다.\n\n'데이터 분석 > 텍스트 & 질적분석' 메뉴에서 의뢰하실 수 있어요.",
  },
  {
    keywords: ["공모전", "대회", "사업계획", "창업", "응모", "제안서", "지원사업"],
    reply: "PRIMER는 공모전 참가에 필요한 주제 발굴, 자료 수집·통계분석, 응모 자료 작성(사업계획서·제안서·발표자료)까지 한 흐름으로 지원합니다.\n\n'공모전/대회 > 참가 지원 신청' 메뉴에서 의뢰하시거나, 상담사에게 자세히 문의하실 수 있어요.",
  },
  {
    keywords: ["수정", "보완", "불만", "환불"],
    reply: "PRIMER는 만족하실 때까지 수정과 보완을 보장합니다. 불편한 점이 있으시면 상담사에게 직접 말씀해 주세요.\n\n상담사에게 연결하시겠어요?",
  },
];

function getAutoReply(message: string): string | null {
  const lower = message.toLowerCase();
  for (const rule of autoReplies) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.reply;
    }
  }
  return null;
}

const defaultGreeting = "안녕하세요! PRIMER 자동 상담입니다.\n\n궁금한 점을 입력해 주시면 안내해 드릴게요. 자세한 상담이 필요하시면 '상담사 연결' 버튼을 눌러주세요.";
const fallbackReply = "죄송합니다, 해당 내용은 자동 응답이 어렵습니다.\n\n아래 '상담사 연결' 버튼을 눌러주시면 전문 상담사가 직접 답변드릴게요.";

export default function ChatWidget() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [connectedToAgent, setConnectedToAgent] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const isHidden = HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const fetchMessages = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/global-chat?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      const msgs: ChatMessage[] = data.messages ?? [];
      setMessages(msgs);

      // 관리자 메시지가 있으면 자동으로 상담사 연결 상태로
      if (msgs.some((m) => m.sender === "admin")) {
        setConnectedToAgent(true);
      }

      const adminCount = msgs.filter((m) => m.sender === "admin").length;
      if (adminCount > prevCountRef.current && !isOpen) {
        setHasUnread(true);
      }
      prevCountRef.current = adminCount;
    } catch { /* ignore */ }
  }, [user?.email, isOpen]);

  useEffect(() => {
    if (!user?.email) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.email, fetchMessages]);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const sendMessage = async (text: string, sender: "user" | "admin" = "user") => {
    if (!user?.email) return;
    await fetch("/api/global-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, sender, message: text }),
    });
  };

  const handleSend = async () => {
    if (!user?.email || !input.trim() || sending) return;
    const userMessage = input.trim();
    setSending(true);
    setInput("");

    try {
      await sendMessage(userMessage);
      await fetchMessages();

      // AI 자동응답 (상담사 미연결 상태일 때만)
      if (!connectedToAgent) {
        const autoReply = getAutoReply(userMessage) || fallbackReply;
        // 짧은 딜레이 후 자동응답
        setTimeout(async () => {
          await sendMessage(autoReply, "admin");
          await fetchMessages();
        }, 800);
      }
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const handleConnectAgent = async () => {
    if (!user?.email) return;
    setConnectedToAgent(true);
    await sendMessage("[상담사 연결 요청] 고객이 실시간 상담을 요청했습니다.", "user");
    await sendMessage("상담사에게 연결 요청을 보냈습니다. 잠시만 기다려주세요. 담당자가 곧 응답드리겠습니다.", "admin");

    // Discord 알림으로 관리자에게 통보
    const lastUserMsg = messages.filter(m => m.sender === "user").pop();
    fetch("/api/global-chat/connect-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, lastMessage: lastUserMsg?.message }),
    }).catch(() => {});

    await fetchMessages();
  };

  if (isHidden) return null;

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-primary to-[#b08a28] text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  {connectedToAgent ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">PRIMER 상담</h3>
                  <p className="text-xs text-white/70 mt-0.5">
                    상담시간 10:00 ~ 18:00 (평일)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">로그인 후 이용 가능합니다</p>
              <p className="text-xs text-gray-500 mb-5">로그인하시면 상담이 가능합니다.</p>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#b08a28] transition-colors"
              >
                로그인하기
              </Link>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">안녕하세요!</p>
                    <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{defaultGreeting.split("\n\n").slice(1).join("\n")}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "admin" && (
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                          msg.sender === "user"
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-white/60 text-right" : "text-gray-400"}`}>
                            {new Date(msg.createdAt).toLocaleString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Connect to Agent button */}
              {!connectedToAgent && messages.length > 0 && (
                <div className="shrink-0 px-4 pb-2">
                  <button
                    onClick={handleConnectAgent}
                    className="w-full py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    상담사 연결하기
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !input.trim()}
                    className="p-2.5 bg-primary text-white rounded-xl hover:bg-[#b08a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button — 더 크게 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-4 sm:right-6 z-50 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-primary hover:bg-[#b08a28]"
        }`}
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}

        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
          </span>
        )}
      </button>
    </>
  );
}
