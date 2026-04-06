import Link from "next/link";

export default function PaperTemplatePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; 대시보드로 돌아가기
      </Link>

      <div className="mt-8 bg-card rounded-xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <span className="inline-block text-xs font-medium bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full mb-4">
          준비 중
        </span>

        <h1 className="text-2xl font-bold mb-3">학술논문 코딩</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
          체계적 문헌 고찰(Systematic Review)을 위한 학술논문 코딩 도구입니다.
          논문의 연구 설계, 표본 특성, 주요 변수, 결과 등을 체계적으로
          코딩하고 관리할 수 있습니다.
        </p>

        <div className="mt-8 text-left max-w-md mx-auto space-y-3">
          <h3 className="text-sm font-semibold mb-2">계획된 기능</h3>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-purple-500 mt-0.5">-</span>
            <span>PubMed, Google Scholar 등 학술 DB 연동 검색</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-purple-500 mt-0.5">-</span>
            <span>PRISMA 흐름도 자동 생성</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-purple-500 mt-0.5">-</span>
            <span>연구 품질 평가 도구 (RoB, NOS 등) 내장</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="text-purple-500 mt-0.5">-</span>
            <span>코딩 결과 메타분석 데이터 형식 내보내기</span>
          </div>
        </div>
      </div>
    </div>
  );
}
