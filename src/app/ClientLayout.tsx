"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CreditBalance } from "./credits/CreditBalance";

function NavLink({ href, icon, label, pathname }: { href: string; icon: React.ReactNode; label: string; pathname: string }) {
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
        isActive
          ? "bg-white/10 text-white font-semibold border-l-[3px] border-blue-400 pl-[9px]"
          : "text-white/70 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent pl-[9px]"
      }`}
    >
      <span className={isActive ? "opacity-100" : "opacity-60"}>{icon}</span>
      {label}
    </Link>
  );
}

function SectionDivider({ color, label }: { color: string; label: string }) {
  return (
    <div className="pt-6 pb-2 px-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1.5 h-4 rounded-full ${color}`} />
        <span className="text-xs font-bold tracking-wider text-white/60 uppercase">{label}</span>
      </div>
      <div className="border-b border-white/5 mt-1" />
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Landing page: no sidebar, full width
  if (pathname === "/") {
    return <>{children}</>;
  }

  // All other pages: sidebar + main
  return (
    <div className="flex min-h-full bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen shrink-0">
        <div className="px-5 py-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/images/main.png" alt="ResearchOn" width={32} height={32} className="rounded-lg" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-white group-hover:text-[#d4a843] transition-colors">
                ResearchOn
              </h1>
              <p className="text-[10px] text-white/35 tracking-wide">연구 및 데이터 플랫폼</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <NavLink
            href="/dashboard"
            pathname={pathname}
            label="대시보드"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />

          <SectionDivider color="bg-blue-400/70" label="문서 코딩" />
          <NavLink
            href="/judgment"
            pathname={pathname}
            label="판결문 코딩"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
          />
          <NavLink
            href="/judgment-collection"
            pathname={pathname}
            label="판결문 수집 의뢰"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>}
          />
          <NavLink
            href="/news-search"
            pathname={pathname}
            label="기사 검색"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
          />
          <NavLink
            href="/templates/paper"
            pathname={pathname}
            label="학술논문"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          />
          <NavLink
            href="/templates/policy"
            pathname={pathname}
            label="정책문서"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />

          <SectionDivider color="bg-rose-400/70" label="계량통계분석" />
          <NavLink
            href="/stats-analysis"
            pathname={pathname}
            label="기초통계 및 시각화"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <NavLink
            href="/text-analysis"
            pathname={pathname}
            label="텍스트 분석"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <NavLink
            href="/stats-analysis#request"
            pathname={pathname}
            label="고급 분석 의뢰"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          />

          <SectionDivider color="bg-indigo-400/70" label="설문조사" />
          <NavLink
            href="/survey-request"
            pathname={pathname}
            label="설문조사 의뢰"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
          />
          <NavLink
            href="/survey-results"
            pathname={pathname}
            label="설문조사 결과 확인"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
          />

          <SectionDivider color="bg-cyan-400/70" label="연구 지원" />
          <NavLink
            href="/data-generation"
            pathname={pathname}
            label="연구 설계 지원"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
          />
          <NavLink
            href="/credits"
            pathname={pathname}
            label="크레딧 관리"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </nav>
        <div className="px-3 py-4 border-t border-white/8 space-y-3">
          <CreditBalance />
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] text-white/25 font-medium">v0.1.0</span>
            <span className="text-[10px] text-white/25">ResearchOn</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
