"use client";

import { useState } from "react";
import Link from "next/link";

const PRESET_QUESTIONS = [
  "핵심 정책 요약",
  "예산/재원 분석",
  "추진 일정 정리",
  "이해관계자 분석",
  "기대효과 정리",
];

export default function PolicyTemplatePage() {
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
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">정책문서 분석</h1>
            <span className="text-[10px] font-medium bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
              준비 중
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">정책문서를 업로드하고 질문하세요</p>
        </div>
      </div>

      {/* Upload / Text input area */}
      <div className="mt-6 bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-3">문서 입력</h2>

        {/* File upload */}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-orange-500/50 transition-colors mb-4">
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
          placeholder="정책문서 본문을 여기에 붙여넣으세요..."
          rows={6}
          className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
        />
      </div>

      {/* Question area */}
      <div className="mt-4 bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-3">분석 질문</h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="이 문서에서 추출할 내용을 입력하세요 (예: 핵심 정책 요약, 예산 규모, 추진 일정)"
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="px-3 py-1.5 text-xs font-medium border border-orange-500/30 text-orange-400 rounded-full hover:bg-orange-500/10 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <button
          disabled
          className="mt-4 w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          분석 시작
        </button>
      </div>

      {/* Results placeholder */}
      <div className="mt-4 bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-3">분석 결과</h2>
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
          문서를 입력하고 질문을 작성하면 분석 결과가 여기에 표시됩니다
        </div>
      </div>
    </div>
  );
}
