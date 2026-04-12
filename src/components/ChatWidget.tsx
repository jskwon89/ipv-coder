"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@/contexts/UserAuthContext";
import { usePathname } from "next/navigation";

interface ChatMessage {
  id: string;
  email: string;
  sender: "user" | "admin";
  message: string;
  createdAt: string;
}

const HIDDEN_PATHS = ["/login", "/signup", "/admin"];

export default function ChatWidget() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
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

      // Check for new admin messages
      const adminCount = msgs.filter((m) => m.sender === "admin").length;
      if (adminCount > prevCountRef.current && !isOpen) {
        setHasUnread(true);
      }
      prevCountRef.current = adminCount;
    } catch { /* ignore */ }
  }, [user?.email, isOpen]);

  // Poll messages
  useEffect(() => {
    if (!user?.email) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.email, fetchMessages]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Clear unread when opening
  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const handleSend = async () => {
    if (!user?.email || !input.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/global-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, sender: "user", message: input.trim() }),
      });
      setInput("");
      await fetchMessages();
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  if (isHidden || !user) return null;

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-primary to-[#b08a28] text-white shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">PRIMER 상담</h3>
                <p className="text-xs text-white/80 mt-0.5">무엇이든 편하게 물어보세요</p>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">안녕하세요!</p>
                <p className="text-xs text-gray-400 mt-1">궁금한 점을 메시지로 보내주세요.</p>
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
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-primary hover:bg-[#b08a28]"
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}

        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        )}
      </button>
    </>
  );
}
