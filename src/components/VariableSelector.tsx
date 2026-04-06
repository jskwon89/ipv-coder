"use client";

import { useState } from "react";
import { VARIABLE_GROUPS } from "@/lib/variable-groups";

interface VariableSelectorProps {
  selectedVars: string[];
  onSelectionChange: (ids: string[]) => void;
  customRequest: string;
  onCustomRequestChange: (text: string) => void;
}

export default function VariableSelector({
  selectedVars,
  onSelectionChange,
  customRequest,
  onCustomRequestChange,
}: VariableSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    );
  };

  const selectedSet = new Set(selectedVars);

  const isGroupAllSelected = (groupId: string) => {
    const group = VARIABLE_GROUPS.find((g) => g.id === groupId);
    if (!group) return false;
    return group.variables.every((v) => selectedSet.has(v.id));
  };

  const isGroupPartiallySelected = (groupId: string) => {
    const group = VARIABLE_GROUPS.find((g) => g.id === groupId);
    if (!group) return false;
    const count = group.variables.filter((v) => selectedSet.has(v.id)).length;
    return count > 0 && count < group.variables.length;
  };

  const getGroupSelectedCount = (groupId: string) => {
    const group = VARIABLE_GROUPS.find((g) => g.id === groupId);
    if (!group) return 0;
    return group.variables.filter((v) => selectedSet.has(v.id)).length;
  };

  const toggleGroupAll = (groupId: string) => {
    const group = VARIABLE_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const groupIds = group.variables.map((v) => v.id);

    if (isGroupAllSelected(groupId)) {
      // Uncheck all in group
      onSelectionChange(selectedVars.filter((id) => !groupIds.includes(id)));
    } else {
      // Check all in group
      const newIds = new Set(selectedVars);
      groupIds.forEach((id) => newIds.add(id));
      onSelectionChange(Array.from(newIds));
    }
  };

  const toggleVariable = (varId: string) => {
    if (selectedSet.has(varId)) {
      onSelectionChange(selectedVars.filter((id) => id !== varId));
    } else {
      onSelectionChange([...selectedVars, varId]);
    }
  };

  const selectAll = () => {
    const allIds = VARIABLE_GROUPS.flatMap((g) => g.variables.map((v) => v.id));
    onSelectionChange(allIds);
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const totalVars = VARIABLE_GROUPS.reduce((sum, g) => sum + g.variables.length, 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          변수 선택{" "}
          <span className="text-muted-foreground font-normal">
            ({selectedVars.length}/{totalVars}개)
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            전체 선택
          </button>
          <span className="text-muted-foreground text-xs">|</span>
          <button
            onClick={deselectAll}
            className="text-xs text-primary hover:underline"
          >
            전체 해제
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-1">
        {VARIABLE_GROUPS.map((group) => {
          const isExpanded = expandedGroups.includes(group.id);
          const allSelected = isGroupAllSelected(group.id);
          const partial = isGroupPartiallySelected(group.id);
          const count = getGroupSelectedCount(group.id);

          return (
            <div key={group.id} className="border border-border rounded-lg overflow-hidden">
              {/* Group header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0f1a2e] hover:bg-secondary transition-colors">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = partial;
                  }}
                  onChange={() => toggleGroupAll(group.id)}
                  className="w-4 h-4 rounded border-border shrink-0"
                />
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex-1 flex items-center justify-between text-sm font-medium text-left"
                >
                  <span>
                    {group.koreanName}
                    <span className="text-muted-foreground font-normal ml-1.5 text-xs">
                      ({count}/{group.variables.length})
                    </span>
                  </span>
                  <svg
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Variables list */}
              {isExpanded && (
                <div className="px-3 py-2 space-y-1 max-h-[300px] overflow-y-auto">
                  {group.variables.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-start gap-2 py-1 text-sm cursor-pointer hover:bg-[#0f1a2e] rounded px-1 -mx-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSet.has(v.id)}
                        onChange={() => toggleVariable(v.id)}
                        className="w-3.5 h-3.5 rounded border-border mt-0.5 shrink-0"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block leading-tight">{v.koreanName}</span>
                        <span className="block text-xs text-muted-foreground leading-tight">
                          {v.englishName} &middot; {v.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom request */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          추가 정보 요청
        </label>
        <textarea
          value={customRequest}
          onChange={(e) => onCustomRequestChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm min-h-[80px] resize-y"
          placeholder="추가로 추출하고 싶은 정보가 있으면 여기에 입력하세요..."
        />
      </div>
    </div>
  );
}
