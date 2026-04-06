"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("judgment");

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      console.error("프로젝트 목록 로드 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setNewName("");
        setSelectedTemplate("judgment");
        setShowModal(false);
        await fetchProjects();
      }
    } catch {
      console.error("프로젝트 생성 실패");
    } finally {
      setCreating(false);
    }
  };

  const totalProjects = projects.length;
  const totalCases = projects.reduce((sum, p) => sum + p.caseCount, 0);
  const totalCoded = projects.reduce((sum, p) => sum + p.codedCount, 0);
  const completionRate = totalCases > 0 ? ((totalCoded / totalCases) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-500 text-sm mt-1">문서 코딩 및 분석 시스템</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#162d4a] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트 만들기
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="총 프로젝트 수" value={totalProjects} icon="folder" color="blue" />
        <StatCard label="총 사건 수" value={totalCases} icon="document" color="amber" />
        <StatCard label="코딩 완료 수" value={totalCoded} icon="check" color="green" />
        <StatCard label="완료율" value={`${completionRate}%`} icon="chart" color="purple" />
      </div>

      {/* Template cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">서비스</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/?type=judgment" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-emerald-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">판결문 코딩</h3>
              <p className="text-xs text-gray-500 mt-1">{totalCases}건 등록 / {totalCoded}건 완료</p>
            </div>
          </Link>

          <Link href="/news-search" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">기사 검색/수집</h3>
              <p className="text-xs text-gray-500 mt-1">뉴스 기사 검색 및 인용</p>
            </div>
          </Link>

          <Link href="/templates/paper" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-purple-500 relative">
              <span className="absolute top-3 right-3 text-[10px] font-medium bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">준비 중</span>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">학술논문 코딩</h3>
              <p className="text-xs text-gray-500 mt-1">체계적 문헌 고찰</p>
            </div>
          </Link>

          <Link href="/templates/policy" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-orange-500 relative">
              <span className="absolute top-3 right-3 text-[10px] font-medium bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">준비 중</span>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">정책문서 코딩</h3>
              <p className="text-xs text-gray-500 mt-1">정책 보고서 분석</p>
            </div>
          </Link>

          <Link href="/stats-analysis" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-rose-500 relative">
              <span className="absolute top-3 right-3 text-[10px] font-medium bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">준비 중</span>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">통계분석/시각화</h3>
              <p className="text-xs text-gray-500 mt-1">데이터 분석 및 시각화</p>
            </div>
          </Link>

          <Link href="/survey-request" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-indigo-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">설문조사 의뢰</h3>
              <p className="text-xs text-gray-500 mt-1">설문조사 설계 및 의뢰</p>
            </div>
          </Link>

          <Link href="/data-generation" className="group block">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-cyan-500 relative">
              <span className="absolute top-3 right-3 text-[10px] font-medium bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full">준비 중</span>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">연구 설계 지원</h3>
              <p className="text-xs text-gray-500 mt-1">검정력 분석, 시뮬레이션 데이터, 설문 설계</p>
            </div>
          </Link>

        </div>
      </div>

      {/* Projects list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">프로젝트 목록</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500 text-sm">
              로딩 중...
            </div>
          ) : projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 text-sm">
              프로젝트가 없습니다. 새 프로젝트를 만들어주세요.
            </div>
          ) : (
            projects.map((project) => {
              const pct = project.caseCount > 0
                ? ((project.codedCount / project.caseCount) * 100).toFixed(1)
                : "0.0";
              return (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {project.caseCount}건 중 {project.codedCount}건 완료
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{pct}%</div>
                      <div className="text-xs text-gray-400">
                        생성일: {project.createdAt.slice(0, 10)}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1e3a5f] rounded-full"
                        style={{
                          width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* New project modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">새 프로젝트 만들기</h2>

            {/* Template selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">템플릿 선택</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTemplate("judgment")}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    selectedTemplate === "judgment"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  판결문
                </button>
                <button
                  disabled
                  className="px-3 py-2 rounded-lg text-sm border border-gray-200 opacity-40 cursor-not-allowed text-gray-500"
                >
                  학술논문 (준비 중)
                </button>
                <button
                  disabled
                  className="px-3 py-2 rounded-lg text-sm border border-gray-200 opacity-40 cursor-not-allowed text-gray-500"
                >
                  정책문서 (준비 중)
                </button>
              </div>
            </div>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="프로젝트 이름 입력"
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setNewName(""); setSelectedTemplate("judgment"); }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#162d4a] transition-colors disabled:opacity-50"
              >
                {creating ? "생성 중..." : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    blue: { border: "border-l-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
    amber: { border: "border-l-amber-500", bg: "bg-amber-50", text: "text-amber-600" },
    green: { border: "border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { border: "border-l-purple-500", bg: "bg-purple-50", text: "text-purple-600" },
  };

  const c = colorMap[color] || colorMap.blue;

  const icons: Record<string, React.ReactNode> = {
    folder: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    document: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    check: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 ${c.border}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
          {icons[icon]}
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
