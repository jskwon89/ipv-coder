"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/PageHeader";

interface Transaction {
  id: string;
  type: "charge" | "use" | "refund";
  amount: number;
  description: string;
  service: string;
  createdAt: string;
  balanceAfter: number;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const PRICE_TABLE = [
  { service: "기초통계 분석", credit: "500", note: "5,000원 | 빈도, 평균, 교차표, 시각화" },
  { service: "중급 분석", credit: "2,000", note: "20,000원 | 회귀분석, 교차분석, ANOVA" },
  { service: "고급 분석", credit: "5,000~", note: "50,000원~ | GBTM, SEM, 생존분석 등" },
  { service: "판결문 AI 코딩 (전체)", credit: "1,000", note: "10,000원 | 전체변수 + 긴 전문" },
  { service: "판결문 AI 코딩 (기본)", credit: "500", note: "5,000원 | 기본변수 + 짧은 전문" },
  { service: "토픽모델링 / 감성분석 / 네트워크", credit: "300", note: "3,000원" },
  { service: "기사 요약 / 문서 요약 / 워드클라우드", credit: "200", note: "2,000원" },
  { service: "기술통계표 Excel", credit: "200", note: "2,000원" },
  { service: "키워드 빈도분석", credit: "100", note: "1,000원" },
  { service: "판결문 수집 (사건번호)", credit: "300/건", note: "3,000원/건" },
  { service: "판결문 수집 (키워드)", credit: "500/건", note: "5,000원/건" },
  { service: "PDF 텍스트 추출 / 검색", credit: "무료", note: "" },
];

export default function CreditsPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState("");
  const [charging, setCharging] = useState(false);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      const data = await res.json();
      setBalance(data.balance ?? 0);
      setTransactions(data.transactions ?? []);
    } catch {
      console.error("크레딧 정보 로드 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const handleCharge = async (amount: number) => {
    if (amount <= 0) return;
    setCharging(true);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        await fetchCredits();
        setCustomAmount("");
      }
    } catch {
      console.error("충전 실패");
    } finally {
      setCharging(false);
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "charge": return "충전";
      case "use": return "사용";
      case "refund": return "환불";
      default: return type;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "charge": return "text-green-600 bg-green-50";
      case "use": return "text-red-600 bg-red-50";
      case "refund": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="크레딧 관리"
        subtitle="서비스 이용에 필요한 크레딧을 관리합니다."
        breadcrumbs={[
          { label: "연구 지원" },
          { label: "크레딧 관리" },
        ]}
        iconBgClass="bg-teal-50"
        iconTextClass="text-teal-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <p className="text-sm text-blue-100 font-medium">현재 잔액</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-5xl font-bold tabular-nums">
            {balance.toLocaleString()}
          </span>
          <span className="text-lg text-blue-200">크레딧</span>
        </div>
        <p className="text-xs text-blue-200 mt-3">1 크레딧 = 10원</p>
      </div>

      {/* Charge Section */}
      <div className="bg-white rounded-xl border border-teal-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">크레딧 충전</h2>

        {/* Quick amounts */}
        <div>
          <p className="text-sm text-gray-600 mb-3">빠른 충전</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => handleCharge(amt)}
                disabled={charging}
                className="px-4 py-2.5 rounded-lg border border-gray-200 hover:border-[#c49a2e] hover:bg-gray-200 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {amt.toLocaleString()} 크레딧
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <p className="text-sm text-gray-600 mb-3">직접 입력</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="충전할 금액"
              min={1}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleCharge(Number(customAmount))}
              disabled={charging || !customAmount || Number(customAmount) <= 0}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              충전하기
            </button>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4 text-sm text-amber-300">
          <p className="font-medium">안내</p>
          <p className="mt-1">충전 요청 후 안내되는 계좌로 입금해주세요. 확인 후 크레딧이 충전됩니다.</p>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-xl border border-teal-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">서비스 요금표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">서비스</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">크레딧</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">비고</th>
              </tr>
            </thead>
            <tbody>
              {PRICE_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 px-4 text-gray-900">{row.service}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    {row.credit === "무료" ? (
                      <span className="text-green-600">{row.credit}</span>
                    ) : (
                      <span className="text-gray-900">{row.credit}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-teal-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">거래 내역</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>거래 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">유형</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">금액</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">서비스</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">설명</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">잔액</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeColor(tx.type)}`}>
                        {typeLabel(tx.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium tabular-nums">
                      <span className={tx.type === "use" ? "text-red-600" : "text-green-600"}>
                        {tx.type === "use" ? "-" : "+"}{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{tx.service}</td>
                    <td className="py-3 px-4 text-gray-600">{tx.description}</td>
                    <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{tx.balanceAfter.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
