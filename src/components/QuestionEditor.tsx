"use client";

import React, { useState } from "react";

export interface SurveyQuestion {
  id: string;
  text: string;
  description?: string;
  type: "radio" | "checkbox" | "scale" | "short" | "long" | "number";
  required: boolean;
  options?: string[];
  scaleSize?: 5 | 7 | 10;
  scaleLabels?: { left: string; right: string };
  hasOtherOption?: boolean;
}

const QUESTION_TYPES: { value: SurveyQuestion["type"]; label: string }[] = [
  { value: "radio", label: "단일 선택" },
  { value: "checkbox", label: "복수 선택" },
  { value: "scale", label: "리커트 척도" },
  { value: "short", label: "단답형" },
  { value: "long", label: "장문형" },
  { value: "number", label: "숫자 입력" },
];

const TYPE_ICONS: Record<SurveyQuestion["type"], React.ReactNode> = {
  radio: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <circle cx="12" cy="12" r="4" strokeWidth={2} />
    </svg>
  ),
  checkbox: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
    </svg>
  ),
  scale: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15h4v5H4zM10 10h4v10h-4zM16 5h4v15h-4z" />
    </svg>
  ),
  short: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h7M4 12h16M4 17h11" />
    </svg>
  ),
  long: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h10" />
    </svg>
  ),
  number: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  ),
};

const TYPE_BORDER_COLORS: Record<SurveyQuestion["type"], string> = {
  radio: "border-l-blue-500",
  checkbox: "border-l-green-500",
  scale: "border-l-purple-500",
  short: "border-l-orange-500",
  long: "border-l-amber-500",
  number: "border-l-teal-500",
};

const TYPE_BADGE_COLORS: Record<SurveyQuestion["type"], string> = {
  radio: "bg-blue-50 text-blue-600",
  checkbox: "bg-green-50 text-green-600",
  scale: "bg-purple-50 text-purple-600",
  short: "bg-orange-50 text-orange-600",
  long: "bg-amber-50 text-amber-600",
  number: "bg-teal-50 text-teal-600",
};

interface Props {
  questions: SurveyQuestion[];
  onChange: (questions: SurveyQuestion[]) => void;
}

export default function QuestionEditor({ questions, onChange }: Props) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllCollapse = () => {
    if (allCollapsed) {
      setCollapsedIds(new Set());
    } else {
      setCollapsedIds(new Set(questions.map((q) => q.id)));
    }
    setAllCollapsed(!allCollapsed);
  };

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

  const duplicateQuestion = (id: string) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const newQ: SurveyQuestion = {
      ...q,
      id: crypto.randomUUID(),
      text: q.text ? `${q.text} (복사)` : "",
      options: q.options ? [...q.options] : undefined,
      scaleLabels: q.scaleLabels ? { ...q.scaleLabels } : undefined,
    };
    const idx = questions.findIndex((q) => q.id === id);
    const next = [...questions];
    next.splice(idx + 1, 0, newQ);
    onChange(next);
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
      patch.hasOtherOption = undefined;
    } else {
      patch.options = undefined;
      patch.scaleSize = undefined;
      patch.scaleLabels = undefined;
      patch.hasOtherOption = undefined;
    }
    update(id, patch);
  };

  const requiredCount = questions.filter((q) => q.required).length;
  const estimatedMinutes = Math.max(1, Math.ceil((questions.length * 15) / 60));

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            문항 목록 ({questions.length}개)
          </h3>
          {questions.length > 0 && (
            <>
              <span className="text-xs text-muted-foreground">
                필수 {requiredCount}개
              </span>
              <span className="text-xs text-muted-foreground">
                약 {estimatedMinutes}분 소요
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <button
              type="button"
              onClick={toggleAllCollapse}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {allCollapsed ? "전체 펼치기" : "전체 접기"}
            </button>
          )}
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
      </div>

      {questions.length === 0 && (
        <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            아직 문항이 없습니다. &quot;문항 추가&quot; 버튼을 눌러 시작하세요.
          </p>
        </div>
      )}

      {questions.length > 0 && questions.map((q, idx) => {
        const isCollapsed = collapsedIds.has(q.id);
        const typeMeta = QUESTION_TYPES.find((t) => t.value === q.type);

        return (
          <div
            key={q.id}
            className={`bg-card rounded-xl border border-border overflow-hidden border-l-4 ${TYPE_BORDER_COLORS[q.type]}`}
          >
            {/* Header */}
            <div
              className="px-5 py-3 border-b border-border flex items-center justify-between gap-3 cursor-pointer"
              onClick={() => toggleCollapse(q.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Drag handle icon */}
                <span
                  className="text-muted-foreground cursor-grab shrink-0"
                  title="드래그하여 이동"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="7" cy="4" r="1.5" />
                    <circle cx="13" cy="4" r="1.5" />
                    <circle cx="7" cy="10" r="1.5" />
                    <circle cx="13" cy="10" r="1.5" />
                    <circle cx="7" cy="16" r="1.5" />
                    <circle cx="13" cy="16" r="1.5" />
                  </svg>
                </span>
                <span className="text-sm font-bold text-indigo-600 shrink-0">Q{idx + 1}</span>
                {isCollapsed && (
                  <span className="text-sm text-muted-foreground truncate">
                    {q.text || "(질문 미입력)"}
                  </span>
                )}
                {/* Type badge with icon */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${TYPE_BADGE_COLORS[q.type]}`}
                >
                  {TYPE_ICONS[q.type]}
                  {typeMeta?.label}
                </span>
                {q.required && (
                  <span className="text-[10px] font-medium bg-red-50 text-red-600 px-1.5 py-0.5 rounded shrink-0">
                    필수
                  </span>
                )}
                {/* Collapse chevron */}
                <svg
                  className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isCollapsed ? "" : "rotate-180"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
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
                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => duplicateQuestion(q.id)}
                  className="p-1.5 rounded-md hover:bg-indigo-50 text-muted-foreground hover:text-indigo-600 transition-colors"
                  title="복제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body - collapsible */}
            {!isCollapsed && (
              <div className="p-5 space-y-4">
                {/* Type selector */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground shrink-0">{TYPE_ICONS[q.type]}</span>
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

                {/* Question text */}
                <textarea
                  value={q.text}
                  onChange={(e) => update(q.id, { text: e.target.value })}
                  placeholder="질문을 입력하세요"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />

                {/* Description text */}
                <textarea
                  value={q.description || ""}
                  onChange={(e) => update(q.id, { description: e.target.value })}
                  placeholder="문항에 대한 설명을 추가하세요 (선택사항)"
                  rows={1}
                  className="w-full px-4 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-muted-foreground"
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
                          className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {/* "기타" option preview */}
                    {q.hasOtherOption && (
                      <div className="flex items-center gap-2 opacity-60">
                        {q.type === "radio" ? (
                          <span className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded border-2 border-border shrink-0" />
                        )}
                        <span className="flex-1 px-3 py-1.5 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
                          기타 (직접 입력)
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => addOption(q.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        선택지 추가
                      </button>
                    </div>
                    {/* "기타" option toggle */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">&quot;기타 (직접 입력)&quot; 옵션 추가</span>
                      <button
                        type="button"
                        onClick={() => update(q.id, { hasOtherOption: !q.hasOtherOption })}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          q.hasOtherOption ? "bg-indigo-500" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#1e2d47] transition-transform ${
                            q.hasOtherOption ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
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
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#1e2d47] transition-transform ${
                        q.required ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 하단 문항 추가 버튼 */}
      {questions.length > 0 && (
        <div className="flex justify-end">
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
      )}
    </div>
  );
}
