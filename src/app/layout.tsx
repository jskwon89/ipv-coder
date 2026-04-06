import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocCoder - 문서 코딩 시스템",
  description: "문서 코딩 및 분석 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen shrink-0">
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="block">
              <h1 className="text-lg font-bold tracking-tight">
                DocCoder
              </h1>
              <p className="text-xs text-white/50 mt-0.5">문서 코딩 시스템</p>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-hover transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              대시보드
            </Link>

            {/* 문서 코딩 */}
            <div className="pt-5 pb-2 px-3 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-blue-400"></div><span className="text-xs font-bold tracking-wide text-white/70">문서 코딩</span></div>
            <Link href="/?type=judgment" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              판결문 코딩
            </Link>
            <Link href="/judgment-collection" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
              판결문 수집 의뢰
            </Link>
            <Link href="/news-search" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              기사 검색
            </Link>
            <Link href="/templates/paper" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              학술논문
            </Link>
            <Link href="/templates/policy" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              정책문서
            </Link>

            {/* 통계분석 */}
            <div className="pt-5 pb-2 px-3 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-rose-400"></div><span className="text-xs font-bold tracking-wide text-white/70">통계분석</span></div>
            <Link href="/stats-analysis" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              기초통계 및 시각화
            </Link>
            <Link href="/stats-analysis#request" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              고급 분석 의뢰
            </Link>

            {/* 설문조사 */}
            <div className="pt-5 pb-2 px-3 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-indigo-400"></div><span className="text-xs font-bold tracking-wide text-white/70">설문조사</span></div>
            <Link href="/survey-request" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              설문조사 의뢰
            </Link>
            <Link href="/survey-results" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              설문조사 결과 확인
            </Link>

            {/* 연구 지원 */}
            <div className="pt-5 pb-2 px-3 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-cyan-400"></div><span className="text-xs font-bold tracking-wide text-white/70">연구 지원</span></div>
            <Link href="/data-generation" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              연구 설계 지원
            </Link>
          </nav>
          <div className="p-4 border-t border-white/10 text-xs text-white/40">
            v0.1.0
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
