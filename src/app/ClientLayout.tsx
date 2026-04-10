"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { CreditBalance } from "./credits/CreditBalance";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserAuthContext";
import { AdminLoginModal } from "@/components/AdminLoginModal";

const NO_SIDEBAR_PATHS = ["/", "/login", "/signup"];

/* ── Leaf nav link ── */
function NavLink({ href, label, pathname, onClick }: { href: string; label: string; pathname: string; onClick?: () => void }) {
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 pl-9 pr-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
        isActive
          ? "bg-teal-50 text-teal-700 font-semibold"
          : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}

/* ── Accordion sub-category (▸ 설문조사, ▸ 판결문 등) ── */
function SubCategory({ label, children, pathname, prefixes }: { label: string; children: React.ReactNode; pathname: string; prefixes: string[] }) {
  const hasActive = prefixes.some(p => pathname === p || pathname.startsWith(p + "/"));
  const [open, setOpen] = useState(hasActive);

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full pl-6 pr-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
          hasActive ? "text-white font-medium" : "text-gray-700 hover:bg-white/8 hover:text-gray-900"
        }`}
      >
        <span>{label}</span>
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 opacity-50 ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {open && <div className="space-y-0.5 mt-0.5">{children}</div>}
    </div>
  );
}

/* ── Top-level section (▼ 연구 자료 생성 등) ── */
function SectionGroup({ color, label, children, pathname, prefixes, defaultOpen }: { color: string; label: string; children: React.ReactNode; pathname: string; prefixes: string[]; defaultOpen?: boolean }) {
  const hasActive = prefixes.some(p => pathname === p || pathname.startsWith(p + "/"));
  const [open, setOpen] = useState(defaultOpen ?? hasActive);

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div className="pt-4 first:pt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-1.5 group"
      >
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-5 rounded-full ${color}`} />
          <span className="text-sm font-bold tracking-wide text-white">{label}</span>
        </div>
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="border-b border-gray-200 mt-1 mx-3" />
      {open && <div className="space-y-0.5 mt-1.5">{children}</div>}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, logout } = useAuth();
  const { user, loading: userLoading, signOut: userSignOut } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const isNoSidebar = NO_SIDEBAR_PATHS.includes(pathname);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Pages without sidebar (landing, login, signup)
  if (isNoSidebar) {
    return <>{children}</>;
  }

  const closeSidebar = () => setSidebarOpen(false);

  // All menu items for search filtering
  const allMenuItems = [
    { label: "대시보드", href: "/dashboard" },
    { label: "연구 주제 및 방향 설계", href: "/data-generation" },
    { label: "통계분석 설계", href: "/stats-design" },
    { label: "설문조사 의뢰", href: "/survey-request" },
    { label: "설문조사 결과 확인", href: "/survey-results" },
    { label: "판결문 코딩", href: "/judgment" },
    { label: "판결문 수집 의뢰", href: "/judgment-collection" },
    { label: "판결문 결과 확인", href: "/judgment-results" },
    { label: "뉴스/언론 보도 수집 의뢰", href: "/news-search" },
    { label: "뉴스/언론 보도 결과 확인", href: "/news-results" },
    { label: "데이터 변환", href: "/data-transform" },
    { label: "데이터 전처리 결과 확인", href: "/data-transform-results" },
    { label: "기초통계", href: "/stats-analysis" },
    { label: "계량분석 의뢰", href: "/quant-analysis" },
    { label: "계량분석 결과 확인", href: "/quant-results" },
    { label: "텍스트 분석 의뢰", href: "/text-analysis" },
    { label: "텍스트 분석 결과 확인", href: "/text-results" },
    { label: "질적분석 의뢰", href: "/qual-analysis" },
    { label: "질적분석 결과 확인", href: "/qual-results" },
    { label: "자주 묻는 질문", href: "/faq" },
    { label: "문의사항", href: "/contact" },
    { label: "크레딧 관리", href: "/credits" },
  ];

  const filtered = search.trim()
    ? allMenuItems.filter(item => item.label.toLowerCase().includes(search.trim().toLowerCase()))
    : null;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3 group" onClick={closeSidebar}>
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-900 group-hover:text-teal-600 transition-colors">
              PRIMER
            </h1>
            <p className="text-[10px] text-gray-400 tracking-wide">연구 및 데이터 플랫폼</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="메뉴 검색..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/8 border border-gray-200 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/12 focus:border-white/20 transition-all"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {filtered ? (
          /* Search results */
          filtered.length > 0 ? (
            filtered.map(item => (
              <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} onClick={closeSidebar} />
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">검색 결과 없음</p>
          )
        ) : (
          /* Full menu */
          <>
            <Link
              href="/dashboard"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                pathname === "/dashboard"
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              대시보드
            </Link>

            {/* 연구설계 */}
            <SectionGroup color="bg-teal-400/70" label="연구설계" pathname={pathname} prefixes={["/data-generation", "/stats-design"]} defaultOpen>
              <NavLink href="/data-generation" label="연구 주제 및 방향 설계" pathname={pathname} onClick={closeSidebar} />
              <NavLink href="/stats-design" label="통계분석 설계" pathname={pathname} onClick={closeSidebar} />
            </SectionGroup>

            {/* 연구 자료 생성 */}
            <SectionGroup color="bg-blue-400/70" label="연구 자료 생성" pathname={pathname} prefixes={["/survey-request", "/survey-results", "/judgment", "/judgment-collection", "/judgment-results", "/news-search", "/news-results"]} defaultOpen>
              <SubCategory label="설문조사" pathname={pathname} prefixes={["/survey-request", "/survey-results"]}>
                <NavLink href="/survey-request" label="설문조사 의뢰" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/survey-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
              <SubCategory label="판결문" pathname={pathname} prefixes={["/judgment", "/judgment-collection", "/judgment-results"]}>
                <NavLink href="/judgment" label="판결문 코딩" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/judgment-collection" label="수집 의뢰" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/judgment-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
              <SubCategory label="뉴스/언론 보도" pathname={pathname} prefixes={["/news-search", "/news-results"]}>
                <NavLink href="/news-search" label="수집 의뢰" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/news-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
            </SectionGroup>

            {/* 데이터 분석 */}
            <SectionGroup color="bg-rose-400/70" label="데이터 분석" pathname={pathname} prefixes={["/data-transform", "/data-transform-results", "/stats-analysis", "/quant-analysis", "/quant-results", "/text-analysis", "/text-results", "/qual-analysis", "/qual-results"]} defaultOpen>
              <SubCategory label="데이터 전처리" pathname={pathname} prefixes={["/data-transform", "/data-transform-results", "/stats-analysis"]}>
                <NavLink href="/data-transform" label="데이터 변환" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/data-transform-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/stats-analysis" label="기초통계" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
              <SubCategory label="계량분석" pathname={pathname} prefixes={["/quant-analysis", "/quant-results"]}>
                <NavLink href="/quant-analysis" label="분석 의뢰" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/quant-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
              <SubCategory label="텍스트 분석" pathname={pathname} prefixes={["/text-analysis", "/text-results"]}>
                <NavLink href="/text-analysis" label="분석 의뢰" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/text-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
              <SubCategory label="질적분석" pathname={pathname} prefixes={["/qual-analysis", "/qual-results"]}>
                <NavLink href="/qual-analysis" label="분석 의뢰" pathname={pathname} onClick={closeSidebar} />
                <NavLink href="/qual-results" label="결과 확인" pathname={pathname} onClick={closeSidebar} />
              </SubCategory>
            </SectionGroup>

            {/* 고객센터 */}
            <SectionGroup color="bg-amber-400/70" label="고객센터" pathname={pathname} prefixes={["/faq", "/contact", "/credits"]}>
              <NavLink href="/faq" label="자주 묻는 질문" pathname={pathname} onClick={closeSidebar} />
              <NavLink href="/contact" label="문의사항" pathname={pathname} onClick={closeSidebar} />
              <NavLink href="/credits" label="크레딧 관리" pathname={pathname} onClick={closeSidebar} />
            </SectionGroup>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-3 bg-[#e8e4df] mt-auto">
        {/* User info - mobile only */}
        <div className="md:hidden">
          {user ? (
            <div className="px-3 py-2 rounded-lg bg-white/[0.05] border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-[11px] text-gray-500 truncate flex-1">{user.email}</span>
              </div>
              <button
                onClick={() => { userSignOut(); closeSidebar(); }}
                className="flex items-center gap-2 mt-2 text-[11px] text-gray-400 hover:text-gray-900/70 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={closeSidebar}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-teal-500 hover:text-teal-500/80 hover:bg-gray-200/50 transition-all w-full"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그인
            </Link>
          )}
        </div>

        <CreditBalance />

        {isAdmin ? (
          <div className="space-y-1">
            <Link
              href="/admin"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                pathname === "/admin" ? "bg-teal-50 text-teal-700 font-semibold" : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              관리자 패널
            </Link>
            <button
              onClick={() => { logout(); closeSidebar(); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400/80 hover:text-red-300 hover:bg-gray-200/50 transition-all w-full"
            >
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 transition-all w-full"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            관리자
          </button>
        )}

        <div className="flex items-center justify-between px-3">
          <span className="text-[10px] text-gray-300 font-medium">v0.2.0</span>
          <span className="text-[10px] text-gray-300">PRIMER</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#f0ede8] flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-sm font-bold text-gray-900">PRIMER</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 transition-colors"
        >
          {sidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeSidebar} />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50
        w-[260px] md:w-60 bg-[#f0ede8] text-gray-700 flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarCollapsed ? "md:-translate-x-full" : "md:translate-x-0"}
      `}>
        {sidebarContent}
        {/* 데스크톱 토글 버튼 — 화살표만 */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-14 items-center justify-center text-gray-400 hover:text-teal-500 transition-colors z-50 rounded-r-md hover:bg-gray-100/50"
        >
          <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* 사이드바 숨겼을 때 여는 버튼 — 화살표만 */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 w-6 h-14 items-center justify-center text-gray-400 hover:text-teal-500 transition-colors z-50 rounded-r-md hover:bg-gray-200/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <main className={`min-h-screen overflow-x-hidden bg-gray-100 pt-14 md:pt-0 transition-all duration-300 ${sidebarCollapsed ? "md:ml-0" : "md:ml-60"}`}>
        {children}
      </main>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
