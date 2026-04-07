"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const relationData = [
  { name: "배우자", value: 145 },
  { name: "동거인", value: 68 },
  { name: "연인", value: 92 },
  { name: "전 배우자", value: 55 },
  { name: "전 연인", value: 47 },
];

const dispositionData = [
  { name: "징역(실형)", value: 85 },
  { name: "징역(집유)", value: 180 },
  { name: "벌금", value: 95 },
  { name: "무죄", value: 12 },
  { name: "공소기각", value: 35 },
];

const prisonData = [
  { range: "6월 이하", count: 45 },
  { range: "6-12월", count: 78 },
  { range: "1-2년", count: 92 },
  { range: "2-3년", count: 35 },
  { range: "3-5년", count: 12 },
  { range: "5년 초과", count: 3 },
];

const ccData = [
  { name: "경제적 통제", count: 89 },
  { name: "고립시키기", count: 124 },
  { name: "감시/스토킹", count: 156 },
  { name: "위협/협박", count: 203 },
  { name: "정서적 학대", count: 178 },
  { name: "자녀 이용", count: 67 },
  { name: "남성 특권", count: 45 },
  { name: "성적 강압", count: 34 },
  { name: "부인/최소화", count: 112 },
];

const severityData = [
  { name: "경미", value: 120 },
  { name: "보통", value: 165 },
  { name: "중", value: 80 },
  { name: "중상", value: 30 },
  { name: "사망", value: 12 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function StatsPage() {
  const params = useParams();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">통계 대시보드</h1>
          <p className="text-gray-600 text-sm mt-1">코딩 완료 330건 기준 분석 결과</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Excel 내보내기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 관계유형 분포 */}
        <ChartCard title="관계유형 분포">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={relationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {relationData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 처분 분포 */}
        <ChartCard title="처분 분포">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dispositionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 징역 히스토그램 */}
        <ChartCard title="징역형 분포">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={prisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CC 항목별 빈도 */}
        <ChartCard title="강압적 통제(CC) 항목별 빈도">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ccData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Severity 분포 */}
        <ChartCard title="상해 심각도 분포">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {severityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-amber-200 p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}
