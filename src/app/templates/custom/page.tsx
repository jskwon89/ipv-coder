import Link from "next/link";

export default function CustomTemplatePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; 대시보드로 돌아가기
      </Link>

      <div className="mt-8 bg-card rounded-xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-500/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>

        <span className="inline-block text-xs font-medium bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full mb-4">
          준비 중
        </span>

        <h1 className="text-2xl font-bold mb-3">커스텀 코딩</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
          나만의 코딩 변수와 코딩 체계를 직접 정의하여 어떤 종류의 문서든
          체계적으로 분석할 수 있는 도구입니다. 연구 목적에 맞는 맞춤형
          코딩 시스템을 구축하세요.
        </p>

        <div className="mt-8 text-left max-w-md mx-auto space-y-3">
          <h3 className="text-sm font-semibold mb-2">계획된 기능</h3>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>드래그 앤 드롭으로 코딩 변수 정의</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>텍스트, 숫자, 선택형, 체크박스 등 다양한 변수 유형</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>코딩 스키마 공유 및 가져오기</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>코더 간 신뢰도(Inter-rater reliability) 자동 계산</span>
          </div>
        </div>
      </div>
    </div>
  );
}
