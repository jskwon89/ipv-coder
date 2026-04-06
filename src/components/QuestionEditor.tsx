"use client";

import React from "react";

export interface SurveyQuestion {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "scale" | "short" | "long" | "number";
  required: boolean;
  options?: string[];
  scaleSize?: 5 | 7 | 10;
  scaleLabels?: { left: string; right: string };
}

const QUESTION_TYPES: { value: SurveyQuestion["type"]; label: string }[] = [
  { value: "radio", label: "단일 선택" },
  { value: "checkbox", label: "복수 선택" },
  { value: "scale", label: "리커트 척도" },
  { value: "short", label: "단답형" },
  { value: "long", label: "장문형" },
  { value: "number", label: "숫자 입력" },
];

interface Props {
  questions: SurveyQuestion[];
  onChange: (questions: SurveyQuestion[]) => void;
}

export default function QuestionEditor({ questions, onChange }: Props) {
  const update = (id: string, patch: Partial<SurveyQuestion>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const addQuestion = () => {
    const newQ: SurveyQuestion = {
      id: crypto.randomUUID(),
      text: "",
      type: "radio",
      required: false,
      options: ["선택지 1", "선택지 2"],
    };
    onChange([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addOption = (id: string) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const opts = [...(q.options || []), `선택지 ${(q.options?.length || 0) + 1}`];
    update(id, { options: opts });
  };

  const updateOption = (id: string, optIdx: number, value: string) => {
    const q = questions.find((q) => q.id === id);
    if (!q?.options) return;
    const opts = [...q.options];
    opts[optIdx] = value;
    update(id, { options: opts });
  };

  const removeOption = (id: string, optIdx: number) => {
    const q = questions.find((q) => q.id === id);
    if (!q?.options || q.options.length <= 1) return;
    update(id, { options: q.options.filter((_, i) => i !== optIdx) });
  };

  const handleTypeChange = (id: string, type: SurveyQuestion["type"]) => {
    const patch: Partial<SurveyQuestion> = { type };
    if (type === "radio" || type === "checkbox") {
      patch.options = ["선택지 1", "선택지 2"];
      patch.scaleSize = undefined;
      patch.scaleLabels = undefined;
    } else if (type === "scale") {
      patch.options = undefined;
      patch.scaleSize = 5;
      patch.scaleLabels = { left: "전혀 그렇지 않다", right: "매우 그렇다" };
    } else {
      patch.options = undefined;
      patch.scaleSize = undefined;
      patch.scaleLabels = undefined;
    }
    update(id, patch);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          문항 목록 ({questions.length}개)
        </h3>
        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          문항 추가
        </button>
      </div>

      {questions.length === 0 && (
        <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            아직 문항이 없습니다. &quot;문항 추가&quot; 버튼을 눌러 시작하세요.
          </p>
        </div>
      )}

      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="bg-card rounded-xl border border-border overflow-hidden border-l-4 border-l-indigo-500"
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Drag handle icon */}
              <span className="text-muted-foreground cursor-grab shrink-0" title="드래그하여 이동">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="7" cy="4" r="1.5" />
                  <circle cx="13" cy="4" r="1.5" />
                  <circle cx="7" cy="10" r="1.5" />
                  <circle cx="13" cy="10" r="1.5" />
                  <circle cx="7" cy="16" r="1.5" />
                  <circle cx="13" cy="16" r="1.5" />
                </svg>
              </span>
              <span className="text-sm font-bold text-indigo-400 shrink-0">Q{idx + 1}</span>
              <select
                value={q.type}
                onChange={(e) => handleTypeChange(q.id, e.target.value as SurveyQuestion["type"])}
                className="px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Move up */}
              <button
                type="button"
                onClick={() => moveQuestion(idx, -1)}
                disabled={idx === 0}
                className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
                title="위로 이동"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              {/* Move down */}
              <button
                type="button"
                onClick={() => moveQuestion(idx, 1)}
                disabled={idx === questions.length - 1}
                className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
                title="아래로 이동"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Delete */}
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                title="삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <textarea
              value={q.text}
              onChange={(e) => update(q.id, { text: e.target.value })}
              placeholder="질문을 입력하세요"
              rows={2}
              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />

            {/* Options for radio / checkbox */}
            {(q.type === "radio" || q.type === "checkbox") && (
              <div className="space-y-2">
                {q.options?.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    {q.type === "radio" ? (
                      <span className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded border-2 border-border shrink-0" />
                    )}
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(q.id, optIdx)}
                      className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(q.id)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 mt-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  선택지 추가
                </button>
              </div>
            )}

            {/* Scale settings */}
            {q.type === "scale" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-muted-foreground">척도 범위</label>
                  <select
                    value={q.scaleSize || 5}
                    onChange={(e) => update(q.id, { scaleSize: Number(e.target.value) as 5 | 7 | 10 })}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value={5}>5점</option>
                    <option value={7}>7점</option>
                    <option value={10}>10점</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">왼쪽 라벨 (최소)</label>
                    <input
                      type="text"
                      value={q.scaleLabels?.left || ""}
                      onChange={(e) =>
                        update(q.id, {
                          scaleLabels: { left: e.target.value, right: q.scaleLabels?.right || "" },
                        })
                      }
                      placeholder="전혀 그렇지 않다"
                      className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">오른쪽 라벨 (최대)</label>
                    <input
                      type="text"
                      value={q.scaleLabels?.right || ""}
                      onChange={(e) =>
                        update(q.id, {
                          scaleLabels: { left: q.scaleLabels?.left || "", right: e.target.value },
                        })
                      }
                      placeholder="매우 그렇다"
                      className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Required toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">필수 응답</span>
              <button
                type="button"
                onClick={() => update(q.id, { required: !q.required })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  q.required ? "bg-indigo-500" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    q.required ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
