"use client";

import Link from "next/link";

export default function SurveyResultsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">대시보드</Link>
        <span>/</span>
        <span>설문조사 결과 확인</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">설문조사 결과 확인</h1>
      <p className="text-muted-foreground text-sm mb-8">의뢰하신 설문조사의 진행 상황과 결과를 확인합니다.</p>

      {/* 의뢰 목록 */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">의뢰 내역</h2>
        </div>
        <div className="divide-y divide-border">
          {/* Empty state */}
          <div className="px-6 py-16 text-center">
            <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm text-muted-foreground mb-4">아직 의뢰 내역이 없습니다.</p>
            <Link
              href="/survey-request"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              설문조사 의뢰하기
            </Link>
          </div>
        </div>
      </div>

      {/* 진행 상태 설명 */}
      <div className="mt-8 bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">진행 절차 안내</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
            <p className="text-sm font-medium">의뢰 접수</p>
            <p className="text-xs text-muted-foreground mt-1">설문 정보 입력 및 제출</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
            <p className="text-sm font-medium">견적 안내</p>
            <p className="text-xs text-muted-foreground mt-1">검토 후 비용 및 일정 안내</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
            <p className="text-sm font-medium">조사 진행</p>
            <p className="text-xs text-muted-foreground mt-1">설문 배포 및 응답 수집</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
            <p className="text-sm font-medium">결과 전달</p>
            <p className="text-xs text-muted-foreground mt-1">원시 데이터 + 기초 분석 보고서</p>
          </div>
        </div>
      </div>
    </div>
  );
}
