"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CreditData {
  balance: number;
  transactions: { id: string; type: string; amount: number; description: string; createdAt: string }[];
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chargeAmount, setChargeAmount] = useState("");
  const [charging, setCharging] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "credits" | "projects">("overview");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchData();
  }, [isAdmin, router]);

  const fetchData = async () => {
    const [credRes, projRes] = await Promise.all([
      fetch("/api/credits"),
      fetch("/api/projects"),
    ]);
    const credData = await credRes.json();
    const projData = await projRes.json();
    setCredits(credData);
    setProjects(projData.projects || []);
  };

  const handleCharge = async () => {
    const amount = parseInt(chargeAmount);
    if (!amount || amount <= 0) return;
    setCharging(true);
    try {
      await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description: `관리자 수동 충전 (${amount.toLocaleString()} 크레딧)` }),
      });
      setChargeAmount("");
      await fetchData();
    } finally {
      setCharging(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`"${name}" 프로젝트를 삭제하시겠습니까?`)) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    await fetchData();
  };

  if (!isAdmin) return null;

  const totalCases = projects.reduce((s, p) => s + p.caseCount, 0);
  const totalCoded = projects.reduce((s, p) => s + p.codedCount, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">관리자 패널</h1>
          <p className="text-xs text-gray-400">시스템 관리 및 모니터링</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(["overview", "credits", "projects"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "overview" ? "전체 현황" : tab === "credits" ? "크레딧 관리" : "프로젝트 관리"}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviewCard label="크레딧 잔액" value={credits?.balance?.toLocaleString() ?? "..."} color="amber" />
            <OverviewCard label="총 프로젝트" value={projects.length} color="blue" />
            <OverviewCard label="총 사건 수" value={totalCases} color="green" />
            <OverviewCard label="코딩 완료" value={totalCoded} color="purple" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">최근 크레딧 내역</h3>
            {credits?.transactions?.length ? (
              <div className="space-y-2">
                {credits.transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <span className="text-sm text-gray-700">{tx.description}</span>
                      <span className="text-xs text-gray-400 ml-2">{tx.createdAt.slice(0, 16).replace("T", " ")}</span>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === "charge" ? "text-green-600" : "text-red-500"}`}>
                      {tx.type === "charge" ? "+" : "-"}{tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">내역이 없습니다</p>
            )}
          </div>
        </div>
      )}

      {/* Credits */}
      {activeTab === "credits" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-1">크레딧 잔액</h3>
            <p className="text-3xl font-bold text-[#c49a2e] mb-6">{credits?.balance?.toLocaleString() ?? 0} 크레딧</p>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">충전 금액</label>
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCharge()}
                  placeholder="충전할 크레딧 수"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/30 focus:border-[#c49a2e]"
                />
              </div>
              <div className="flex gap-2">
                {[1000, 5000, 10000, 50000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setChargeAmount(String(amt))}
                    className="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                  >
                    {(amt / 1000)}K
                  </button>
                ))}
              </div>
              <button
                onClick={handleCharge}
                disabled={charging || !chargeAmount}
                className="px-6 py-2.5 bg-[#c49a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#d4a843] disabled:opacity-50 transition-colors"
              >
                {charging ? "충전 중..." : "충전"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">전체 거래 내역</h3>
            <div className="max-h-96 overflow-y-auto">
              {credits?.transactions?.length ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-2 font-medium">날짜</th>
                      <th className="pb-2 font-medium">유형</th>
                      <th className="pb-2 font-medium">설명</th>
                      <th className="pb-2 font-medium text-right">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credits.transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-50">
                        <td className="py-2.5 text-gray-500">{tx.createdAt.slice(0, 10)}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            tx.type === "charge" ? "bg-green-50 text-green-600" : tx.type === "refund" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"
                          }`}>
                            {tx.type === "charge" ? "충전" : tx.type === "refund" ? "환불" : "사용"}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-700">{tx.description}</td>
                        <td className={`py-2.5 text-right font-bold ${tx.type === "charge" || tx.type === "refund" ? "text-green-600" : "text-red-500"}`}>
                          {tx.type === "charge" || tx.type === "refund" ? "+" : "-"}{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-400 py-4">거래 내역이 없습니다</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">프로젝트 목록 ({projects.length}개)</h3>
          </div>
          {projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">프로젝트가 없습니다</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">이름</th>
                  <th className="px-6 py-3 font-medium">생성일</th>
                  <th className="px-6 py-3 font-medium text-center">사건</th>
                  <th className="px-6 py-3 font-medium text-center">코딩</th>
                  <th className="px-6 py-3 font-medium text-center">진행률</th>
                  <th className="px-6 py-3 font-medium text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const pct = p.caseCount > 0 ? ((p.codedCount / p.caseCount) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-3 text-gray-500">{p.createdAt.slice(0, 10)}</td>
                      <td className="px-6 py-3 text-center text-gray-700">{p.caseCount}</td>
                      <td className="px-6 py-3 text-center text-gray-700">{p.codedCount}</td>
                      <td className="px-6 py-3 text-center">
                        <span className="text-sm font-bold text-[#c49a2e]">{pct}%</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDeleteProject(p.id, p.name)}
                          className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function OverviewCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    amber: "bg-[#c49a2e]/10 text-[#c49a2e]",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium mb-3 ${colors[color]}`}>{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
