"use client";

import { useState } from "react";
import Link from "next/link";

const PRESET_QUESTIONS = [
  "연구방법론 요약",
  "주요 발견 정리",
  "한계점 분석",
  "참고문헌 추출",
  "비교표 생성",
];

export default function PaperTemplatePage() {
  const [textInput, setTextInput] = useState("");
  const [question, setQuestion] = useState("");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; 대시보드로 돌아가기
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">학술논문 분석</h1>
            <span className="text-[10px] font-medium bg-purple-900/30 text-purple-600 px-2 py-0.5 rounded-full">
              준비 중
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">논문을 업로드하고 질문하세요</p>
        </div>
      </div>

      {/* Upload / Text input area */}
      <div className="mt-6 bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-3">논문 입력</h2>

        {/* File upload */}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors mb-4">
          <svg className="w-8 h-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm text-muted-foreground">PDF 파일을 드래그하거나 클릭하여 업로드</span>
          <input type="file" accept=".pdf" className="hidden" disabled />
        </label>

        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">또는 텍스트 직접 붙여넣기</span>
          </div>
        </div>

        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="논문 본문을 여기에 붙여넣으세요..."
          rows={6}
          className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />
      </div>

      {/* Question area */}
      <div className="mt-4 bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-3">분석 질문</h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="이 논문에서 알고 싶은 내용을 입력하세요 (예: 연구방법론 요약, 주요 발견, 한계점 정리)"
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="px-3 py-1.5 text-xs font-medium border border-purple-700/40 text-purple-600 rounded-full hover:bg-purple-900/30 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <button
          disabled
          className="mt-4 w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          분석 시작
        </button>
      </div>

      {/* Results placeholder */}
      <div className="mt-4 bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-3">분석 결과</h2>
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
          논문을 입력하고 질문을 작성하면 분석 결과가 여기에 표시됩니다
        </div>
      </div>
    </div>
  );
}
