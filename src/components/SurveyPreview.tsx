"use client";

import React, { useState } from "react";
import type { SurveyQuestion } from "./QuestionEditor";

interface Props {
  title: string;
  onTitleChange: (title: string) => void;
  questions: SurveyQuestion[];
}

export default function SurveyPreview({ title, onTitleChange, questions }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});

  const progressPercent = questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">미리보기</h3>
        <button
          type="button"
          onClick={() => setIsMobile(!isMobile)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
            isMobile
              ? "border-indigo-500 bg-indigo-50 text-indigo-600"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {isMobile ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M11 18h2" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M2 8h20" />
            </svg>
          )}
          {isMobile ? "모바일" : "데스크톱"}
        </button>
      </div>

      {/* Progress bar */}
      {questions.length > 0 && (
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>진행률</span>
            <span>{currentIdx + 1} / {questions.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className={`p-5 space-y-5 ${isMobile ? "max-w-sm mx-auto" : ""}`}>
        {/* Survey title */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="설문지 제목을 입력하세요"
          className="w-full text-lg font-bold bg-transparent border-b-2 border-indigo-500/30 pb-2 focus:outline-none focus:border-indigo-500 placeholder:text-muted-foreground/50"
        />

        {questions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            왼쪽에서 문항을 추가하면 여기에 미리보기가 표시됩니다.
          </p>
        )}

        {questions.map((q, idx) => {
          const isSection = q.description?.startsWith("---");

          return (
            <React.Fragment key={q.id}>
              {/* Section divider */}
              {isSection && (
                <div className="border-t-2 border-indigo-500/20 pt-4 mt-4">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                    {q.description?.replace(/^---\s*/, "") || "새 섹션"}
                  </p>
                </div>
              )}

              <div
                className="space-y-2.5 cursor-pointer"
                onClick={() => setCurrentIdx(idx)}
              >
                <p className="text-sm font-medium">
                  {idx + 1}. {q.text || "(질문 미입력)"}
                  {q.required && <span className="text-red-600 ml-1 text-base font-bold">*</span>}
                </p>

                {/* Description */}
                {q.description && !isSection && (
                  <p className="text-xs text-muted-foreground pl-1">{q.description}</p>
                )}

                {/* Radio */}
                {q.type === "radio" && (
                  <div className="space-y-1.5 pl-1">
                    {q.options?.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-default">
                        <input type="radio" name={`preview-${q.id}`} disabled className="w-4 h-4" />
                        <span className="text-sm text-muted-foreground">{opt}</span>
                      </label>
                    ))}
                    {q.hasOtherOption && (
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 cursor-default">
                          <input type="radio" name={`preview-${q.id}`} disabled className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">기타 (직접 입력)</span>
                        </label>
                        <input
                          type="text"
                          value={otherTexts[q.id] || ""}
                          onChange={(e) => setOtherTexts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="직접 입력..."
                          className="ml-6 w-[calc(100%-1.5rem)] px-3 py-1.5 border border-border rounded-lg text-sm bg-[#0f1a2e] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Checkbox */}
                {q.type === "checkbox" && (
                  <div className="space-y-1.5 pl-1">
                    {q.options?.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-default">
                        <input type="checkbox" disabled className="w-4 h-4 rounded" />
                        <span className="text-sm text-muted-foreground">{opt}</span>
                      </label>
                    ))}
                    {q.hasOtherOption && (
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 cursor-default">
                          <input type="checkbox" disabled className="w-4 h-4 rounded" />
                          <span className="text-sm text-muted-foreground">기타 (직접 입력)</span>
                        </label>
                        <input
                          type="text"
                          value={otherTexts[q.id] || ""}
                          onChange={(e) => setOtherTexts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="직접 입력..."
                          className="ml-6 w-[calc(100%-1.5rem)] px-3 py-1.5 border border-border rounded-lg text-sm bg-[#0f1a2e] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Scale */}
                {q.type === "scale" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Array.from({ length: q.scaleSize || 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled
                          className="w-9 h-9 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:border-indigo-500 transition-colors"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{q.scaleLabels?.left || ""}</span>
                      <span>{q.scaleLabels?.right || ""}</span>
                    </div>
                  </div>
                )}

                {/* Short text */}
                {q.type === "short" && (
                  <input
                    type="text"
                    disabled
                    placeholder="단답형 텍스트"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-[#0f1a2e]"
                  />
                )}

                {/* Long text */}
                {q.type === "long" && (
                  <textarea
                    disabled
                    rows={3}
                    placeholder="장문형 텍스트"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-[#0f1a2e] resize-none"
                  />
                )}

                {/* Number */}
                {q.type === "number" && (
                  <input
                    type="number"
                    disabled
                    placeholder="숫자 입력"
                    className="w-full max-w-[200px] px-3 py-2 border border-border rounded-lg text-sm bg-[#0f1a2e]"
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Submit button preview */}
        {questions.length > 0 && (
          <div className="pt-4 border-t border-border">
            <button
              type="button"
              disabled
              className="px-6 py-2.5 bg-indigo-400 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
            >
              제출
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
