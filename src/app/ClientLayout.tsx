"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CreditBalance } from "./credits/CreditBalance";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserAuthContext";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import ChatWidget from "@/components/ChatWidget";

const NO_TOPNAV_PATHS = ["/login", "/signup"];

/* ── Highlight styles for special menu items ── */
type HighlightStyle = "consultation" | "journal" | null;

const highlightStyles: Record<string, { base: string; active: string; hover: string }> = {
  consultation: {
    base: "text-orange-600 lg:text-[1.1rem] font-bold",
    active: "text-orange-700 bg-orange-50",
    hover: "hover:text-orange-700 hover:bg-orange-50/70",
  },
  journal: {
    base: "text-indigo-600 lg:text-[1.1rem] font-bold",
    active: "text-indigo-700 bg-indigo-50",
    hover: "hover:text-indigo-700 hover:bg-indigo-50/70",
  },
};

/* ── Simplified menu data ── */
const menuGroups = [
  {
    label: "간편 상담",
    prefixes: ["/consultation"],
    highlight: "consultation" as HighlightStyle,
    items: [
      { label: "간편 상담 신청", href: "/consultation" },
    ],
  },
  {
    label: "연구 설계",
    prefixes: ["/data-generation", "/stats-design"],
    highlight: null as HighlightStyle,
    items: [
      { label: "연구 주제 및 방향 설계", href: "/data-generation" },
      { label: "통계분석 설계", href: "/stats-design" },
      { label: "결과물 샘플", href: "/samples", divider: true },
    ],
  },
  {
    label: "자료 생성 & 수집",
    prefixes: ["/survey-request", "/survey-results", "/judgment", "/judgment-collection", "/judgment-results", "/news-search", "/news-results"],
    highlight: null as HighlightStyle,
    items: [
      { label: "설문조사", href: "/survey-request" },
      { label: "판결문", href: "/judgment" },
      { label: "뉴스/언론 보도", href: "/news-search" },
      { label: "결과물 샘플", href: "/samples", divider: true },
    ],
  },
  {
    label: "데이터 분석",
    prefixes: ["/data-transform", "/data-transform-results", "/stats-analysis", "/quant-analysis", "/quant-results", "/text-analysis", "/text-results", "/qual-analysis", "/qual-results"],
    highlight: null as HighlightStyle,
    items: [
      { label: "전처리 & 기초통계", href: "/data-transform" },
      { label: "통계분석", href: "/quant-analysis" },
      { label: "텍스트 & 질적분석", href: "/text-analysis" },
      { label: "결과물 샘플", href: "/samples", divider: true },
    ],
  },
  {
    label: "국제 학술지",
    prefixes: ["/journal-submission"],
    highlight: "journal" as HighlightStyle,
    items: [
      { label: "국제학술지 투고 상담", href: "/journal-submission" },
    ],
  },
  {
    label: "고객센터",
    prefixes: ["/faq", "/contact", "/credits"],
    highlight: null as HighlightStyle,
    items: [
      { label: "자주 묻는 질문", href: "/faq" },
      { label: "문의사항", href: "/contact" },
      { label: "크레딧 관리", href: "/credits" },
    ],
  },
];

/* ── Dropdown menu component ── */
function TopMenuGroup({
  group,
  pathname,
  activeGroup,
  onOpen,
  onClose,
}: {
  group: (typeof menuGroups)[0];
  pathname: string;
  activeGroup: string | null;
  onOpen: (label: string) => void;
  onClose: () => void;
}) {
  const isOpen = activeGroup === group.label;
  const isGroupActive = group.prefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const hl = group.highlight ? highlightStyles[group.highlight] : null;

  return (
    <div
      className="relative"
      onMouseEnter={() => onOpen(group.label)}
      onMouseLeave={onClose}
    >
      <button
        onClick={() => (isOpen ? onClose() : onOpen(group.label))}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
          hl
            ? `${hl.base} ${isGroupActive ? hl.active : hl.hover}`
            : `text-base font-semibold ${isGroupActive ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`
        }`}
      >
        {group.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-50">
          {group.items.map((item) => {
            const isActive = group.prefixes.some(
              (p) => p.startsWith(item.href) && (pathname === p || pathname.startsWith(p + "/"))
            ) || pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <div key={item.href}>
                {"divider" in item && item.divider && (
                  <div className="my-1 border-t border-gray-100" />
                )}
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "text-teal-600 bg-teal-50 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();
  const { user, signOut: userSignOut } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isNoTopnav = NO_TOPNAV_PATHS.includes(pathname);

  // Close everything on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedGroup(null);
    setActiveDesktopGroup(null);
    clearTimeout(closeTimerRef.current);
  }, [pathname]);

  const handleDesktopOpen = useCallback((label: string) => {
    clearTimeout(closeTimerRef.current);
    setActiveDesktopGroup(label);
  }, []);

  const handleDesktopClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setActiveDesktopGroup(null), 120);
  }, []);

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);

  if (isNoTopnav) {
    return <>{children}</>;
  }

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileExpandedGroup(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image src="/logo-primer.png" alt="PRIMER" width={220} height={50} className="h-10 sm:h-12 w-auto" priority />
            </Link>

            {/* Desktop nav - flex with auto spacing */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0">
              {menuGroups.map((group) => {
                const hl = group.highlight ? highlightStyles[group.highlight] : null;
                const isActive = group.prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
                return group.items.length === 1 ? (
                  <Link
                    key={group.label}
                    href={group.items[0].href}
                    className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      hl
                        ? `${hl.base} ${isActive ? hl.active : hl.hover}`
                        : `text-base font-semibold ${isActive ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`
                    }`}
                  >
                    {group.label}
                  </Link>
                ) : (
                  <TopMenuGroup
                    key={group.label}
                    group={group}
                    pathname={pathname}
                    activeGroup={activeDesktopGroup}
                    onOpen={handleDesktopOpen}
                    onClose={handleDesktopClose}
                  />
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block">
                <CreditBalance />
              </div>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600 max-w-[120px] truncate">{user.email}</span>
                    <button onClick={() => userSignOut()} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  로그인
                </Link>
              )}

              {isAdmin ? (
                <Link
                  href="/admin"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    pathname === "/admin" ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  관리자
                </Link>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  관리자
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={closeMobile} />
          <div className="fixed top-14 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {menuGroups.map((group) => {
                const isExpanded = mobileExpandedGroup === group.label;
                const isGroupActive = group.prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
                const hl = group.highlight ? highlightStyles[group.highlight] : null;

                // Single-item highlighted groups render as direct links on mobile too
                if (group.items.length === 1 && hl) {
                  return (
                    <Link
                      key={group.label}
                      href={group.items[0].href}
                      onClick={closeMobile}
                      className={`block px-3 py-2.5 rounded-lg font-semibold text-sm ${isGroupActive ? hl.active : `${hl.base.replace(/lg:text-\[.*?\]/, '')} ${hl.hover}`}`}
                    >
                      {group.label}
                    </Link>
                  );
                }

                return (
                  <div key={group.label}>
                    <button
                      onClick={() => setMobileExpandedGroup(isExpanded ? null : group.label)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium ${isGroupActive ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {group.label}
                      <svg className={`w-4 h-4 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                        {group.items.map((item) => (
                          <div key={item.href}>
                            {"divider" in item && item.divider && <div className="my-1 border-t border-gray-100" />}
                            <Link
                              href={item.href}
                              onClick={closeMobile}
                              className={`block px-3 py-2 rounded-lg text-sm ${pathname === item.href || pathname.startsWith(item.href + "/") ? "text-teal-600 font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                            >
                              {item.label}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                <div className="px-3"><CreditBalance /></div>
                {user ? (
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    <button onClick={() => { userSignOut(); closeMobile(); }} className="text-xs text-gray-400 hover:text-gray-600">로그아웃</button>
                  </div>
                ) : (
                  <Link href="/login" onClick={closeMobile} className="block px-3 py-2.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg">로그인</Link>
                )}
                {isAdmin ? (
                  <div className="space-y-1">
                    <Link href="/admin" onClick={closeMobile} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">관리자 패널</Link>
                    <button onClick={() => { logout(); closeMobile(); }} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">관리자 로그아웃</button>
                  </div>
                ) : (
                  <button onClick={() => { setShowLogin(true); closeMobile(); }} className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 rounded-lg">관리자</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="min-h-screen pt-16 sm:pt-20">
        {children}
      </main>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
      <ChatWidget />
    </div>
  );
}
