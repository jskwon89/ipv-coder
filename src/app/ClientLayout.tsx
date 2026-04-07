"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CreditBalance } from "./credits/CreditBalance";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLoginModal } from "@/components/AdminLoginModal";

function NavLink({ href, icon, label, pathname, onClick }: { href: string; icon: React.ReactNode; label: string; pathname: string; onClick?: () => void }) {
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
        isActive
          ? "bg-[#c49a2e]/20 text-white font-semibold border-l-[3px] border-[#c49a2e] pl-[9px]"
          : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-x-0.5 border-l-[3px] border-transparent pl-[9px]"
      }`}
    >
      <span className={isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>{icon}</span>
      {label}
    </Link>
  );
}

function SectionDivider({ color, label }: { color: string; label: string }) {
  return (
    <div className="pt-6 pb-2 px-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1.5 h-5 rounded-full ${color}`} />
        <span className="text-sm font-bold tracking-wide text-white/90">{label}</span>
      </div>
      <div className="border-b border-white/8 mt-1" />
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Landing page: no sidebar, full width
  if (pathname === "/") {
    return <>{children}</>;
  }

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <>
      <div className="px-5 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group" onClick={closeSidebar}>
          <Image src="/images/main.png" alt="ResearchOn" width={32} height={32} className="rounded-lg" />
          <div>
            <h1 className="text-base font-bold tracking-tight text-white group-hover:text-[#d4a843] transition-colors">
              ResearchOn
            </h1>
            <p className="text-[10px] text-white/50 tracking-wide">연구 및 데이터 플랫폼</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <NavLink href="/dashboard" pathname={pathname} label="대시보드" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        />

        <SectionDivider color="bg-blue-400/70" label="문서 코딩 및 요약" />
        <NavLink href="/judgment" pathname={pathname} label="판결문 코딩" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
        />
        <NavLink href="/judgment-collection" pathname={pathname} label="판결문 수집 의뢰" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>}
        />
        <NavLink href="/news-search" pathname={pathname} label="기사 검색" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
        />
        <NavLink href="/templates/paper" pathname={pathname} label="학술논문 / 정책문서" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />

        <SectionDivider color="bg-rose-400/70" label="계량통계분석" />
        <NavLink href="/stats-analysis" pathname={pathname} label="기초통계 및 시각화" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <NavLink href="/text-analysis" pathname={pathname} label="텍스트 분석" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <NavLink href="/stats-analysis#request" pathname={pathname} label="고급 분석 의뢰" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
        />

        <SectionDivider color="bg-indigo-400/70" label="설문조사" />
        <NavLink href="/survey-request" pathname={pathname} label="설문조사 의뢰" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
        />
        <NavLink href="/survey-results" pathname={pathname} label="설문조사 결과 확인" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
        />

        <SectionDivider color="bg-cyan-400/70" label="연구 지원" />
        <NavLink href="/data-generation" pathname={pathname} label="연구 설계 지원" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
        />
        <NavLink href="/credits" pathname={pathname} label="크레딧 관리" onClick={closeSidebar}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-3 bg-[#0b1422] mt-auto">
        <CreditBalance />

        {/* Admin section */}
        {isAdmin ? (
          <div className="space-y-1">
            <NavLink href="/admin" pathname={pathname} label="관리자 패널" onClick={closeSidebar}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <button
              onClick={() => { logout(); closeSidebar(); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400/80 hover:text-red-300 hover:bg-white/10 transition-all w-full border-l-[3px] border-transparent pl-[9px]"
            >
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/10 transition-all w-full"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            관리자
          </button>
        )}

        <div className="flex items-center justify-between px-3">
          <span className="text-[10px] text-white/30 font-medium">v0.1.0</span>
          <span className="text-[10px] text-white/30">ResearchOn</span>
        </div>
      </div>
    </>
  );

  // All other pages: sidebar + main
  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#0f1a2e] flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/main.png" alt="ResearchOn" width={28} height={28} className="rounded-lg" />
          <span className="text-sm font-bold text-white">ResearchOn</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar - desktop: always visible, mobile: slide-in */}
      <aside className={`
        fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-auto
        w-[260px] md:w-60 bg-[#0f1a2e] text-[#c8d6e5] flex flex-col shrink-0
        md:h-screen md:top-0 md:bottom-auto
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
        style={{ height: '100dvh' }}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 min-h-screen overflow-x-hidden bg-gray-100 pt-14 md:pt-0">
        {children}
      </main>

      {/* Admin login modal */}
      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
