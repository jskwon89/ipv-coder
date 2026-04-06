"use client";

import React from "react";
import type { SurveyQuestion } from "./QuestionEditor";

interface Props {
  title: string;
  onTitleChange: (title: string) => void;
  questions: SurveyQuestion[];
}

export default function SurveyPreview({ title, onTitleChange, questions }: Props) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-sm">미리보기</h3>
      </div>
      <div className="p-5 space-y-5">
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

        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-2.5">
            <p className="text-sm font-medium">
              {idx + 1}. {q.text || "(질문 미입력)"}
              {q.required && <span className="text-red-400 ml-1">*</span>}
            </p>

            {/* Radio */}
            {q.type === "radio" && (
              <div className="space-y-1.5 pl-1">
                {q.options?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-default">
                    <input type="radio" name={`preview-${q.id}`} disabled className="w-4 h-4" />
                    <span className="text-sm text-muted-foreground">{opt}</span>
                  </label>
                ))}
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
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted/30"
              />
            )}

            {/* Long text */}
            {q.type === "long" && (
              <textarea
                disabled
                rows={3}
                placeholder="장문형 텍스트"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted/30 resize-none"
              />
            )}

            {/* Number */}
            {q.type === "number" && (
              <input
                type="number"
                disabled
                placeholder="숫자 입력"
                className="w-full max-w-[200px] px-3 py-2 border border-border rounded-lg text-sm bg-muted/30"
              />
            )}
          </div>
        ))}

        {/* Submit button preview */}
        {questions.length > 0 && (
          <div className="pt-4 border-t border-border">
            <button
              type="button"
              disabled
              className="px-6 py-2.5 bg-indigo-500/50 text-white/70 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              제출
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
