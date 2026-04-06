import Link from "next/link";

export default function PolicyTemplatePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; 대시보드로 돌아가기
      </Link>

      <div className="mt-8 bg-card rounded-xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <span className="inline-block text-xs font-medium bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full mb-4">
          준비 중
        </span>

        <h1 className="text-2xl font-bold mb-3">정책문서 코딩</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
          정책 보고서, 법률안, 행정 문서 등을 체계적으로 분석하고 코딩하는
          도구입니다. 정책 내용, 대상, 수단, 효과 등을 구조화하여
          비교 분석할 수 있습니다.
        </p>

        <div className="mt-8 text-left max-w-md mx-auto space-y-3">
          <h3 className="text-sm font-semibold mb-2">계획된 기능</h3>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-orange-500 mt-0.5">-</span>
            <span>정책 분석 프레임워크 템플릿 제공</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-orange-500 mt-0.5">-</span>
            <span>국회 의안정보, 법령정보 연동</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-orange-500 mt-0.5">-</span>
            <span>정책 비교 매트릭스 자동 생성</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-orange-500 mt-0.5">-</span>
            <span>시계열 정책 변화 추적</span>
          </div>
        </div>
      </div>
    </div>
  );
}
