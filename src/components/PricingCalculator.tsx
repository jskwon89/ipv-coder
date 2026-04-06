"use client";

import { estimateCost, getSelectedVariableCount } from "@/lib/variable-groups";

interface PricingCalculatorProps {
  textLength: number;
  selectedVars: string[];
  customRequest: string;
}

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

export default function PricingCalculator({
  textLength,
  selectedVars,
  customRequest,
}: PricingCalculatorProps) {
  const selectedVarCount = getSelectedVariableCount(selectedVars);
  const effectiveTextLength = textLength + customRequest.length;
  const { inputTokens, outputTokens, apiCost, totalKRW } = estimateCost(
    effectiveTextLength,
    selectedVarCount
  );

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <h4 className="text-sm font-semibold pb-2 border-b border-border">
        예상 비용
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">선택된 변수</span>
          <span className="font-medium">{formatNumber(selectedVarCount)}개</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">판결문 길이</span>
          <span className="font-medium">{formatNumber(textLength)}자</span>
        </div>
        {customRequest.length > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">추가 요청</span>
            <span className="font-medium">{formatNumber(customRequest.length)}자</span>
          </div>
        )}

        <div className="border-t border-border pt-2 mt-2" />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>입력 토큰</span>
          <span>{formatNumber(inputTokens)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>출력 토큰</span>
          <span>{formatNumber(outputTokens)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">예상 API 비용</span>
          <span className="font-medium">${apiCost.toFixed(4)}</span>
        </div>

        <div className="border-t border-border pt-2 mt-2" />

        <div className="flex justify-between items-baseline">
          <span className="font-semibold">서비스 이용료</span>
          <span className="text-lg font-bold text-primary">
            {formatNumber(totalKRW)}원
          </span>
        </div>
      </div>
    </div>
  );
}
