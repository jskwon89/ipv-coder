"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserAuthContext";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

interface StatusBreakdown {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

interface ServiceStats {
  researchDesign: StatusBreakdown;
  judgment: StatusBreakdown;
  survey: StatusBreakdown;
  dataAnalysis: StatusBreakdown;
}

const quickServices = [
  {
    title: "연구 주제 설계",
    href: "/data-generation",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "통계분석 설계",
    href: "/stats-design",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "설문조사",
    href: "/survey-request",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "판결문 분석",
    href: "/judgment",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    title: "뉴스 수집",
    href: "/news-search",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    title: "계량분석",
    href: "/quant-analysis",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "텍스트 분석",
    href: "/text-analysis",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    title: "질적분석",
    href: "/qual-analysis",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { user, signOut: userSignOut } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const emptyBreakdown: StatusBreakdown = { total: 0, pending: 0, in_progress: 0, completed: 0 };
  const [stats, setStats] = useState<ServiceStats>({ researchDesign: { ...emptyBreakdown }, judgment: { ...emptyBreakdown }, survey: { ...emptyBreakdown }, dataAnalysis: { ...emptyBreakdown } });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("judgment");

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const emailParam = user.email ? `?email=${encodeURIComponent(user.email)}` : "";
      const [projRes, researchRes, statsDesignRes, surveyRes, dtRes, quantRes, textRes, qualRes] = await Promise.all([
        fetch("/api/projects"),
        fetch(`/api/research-design${emailParam}`),
        fetch(`/api/stats-design${emailParam}`),
        fetch(`/api/survey${emailParam}`),
        fetch(`/api/data-transform${emailParam}`),
        fetch(`/api/quant-analysis${emailParam}`),
        fetch(`/api/text-analysis-request${emailParam}`),
        fetch(`/api/qual-analysis${emailParam}`),
      ]);
      const projData = await projRes.json();
      const researchData = await researchRes.json();
      const statsDesignData = await statsDesignRes.json();
      const surveyData = await surveyRes.json();
      const dtData = await dtRes.json();
      const quantData = await quantRes.json();
      const textData = await textRes.json();
      const qualData = await qualRes.json();
      const prjs = projData.projects || [];
      setProjects(prjs);

      const countByStatus = (...lists: { status?: string }[][]) => {
        const all = lists.flat();
        return {
          total: all.length,
          pending: all.filter(r => r.status === "pending").length,
          in_progress: all.filter(r => r.status === "in_progress").length,
          completed: all.filter(r => r.status === "completed").length,
        };
      };

      const rdReqs = [...(researchData.requests || []), ...(statsDesignData.requests || [])];
      const surveyReqs = surveyData.requests || [];
      const daReqs = [...(dtData.requests || []), ...(quantData.requests || []), ...(textData.requests || []), ...(qualData.requests || [])];

      setStats({
        researchDesign: countByStatus(rdReqs),
        judgment: { total: prjs.length, pending: 0, in_progress: prjs.filter((p: Project) => p.codedCount < p.caseCount).length, completed: prjs.filter((p: Project) => p.caseCount > 0 && p.codedCount >= p.caseCount).length },
        survey: countByStatus(surveyReqs),
        dataAnalysis: countByStatus(daReqs),
      });
    } catch {
      console.error("데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        await fetchData();
      }
    } catch {
      console.error("프로젝트 생성 실패");
    } finally {
      setCreating(false);
    }
  };

  const totalStats: StatusBreakdown = {
    total: stats.researchDesign.total + stats.judgment.total + stats.survey.total + stats.dataAnalysis.total,
    pending: stats.researchDesign.pending + stats.judgment.pending + stats.survey.pending + stats.dataAnalysis.pending,
    in_progress: stats.researchDesign.in_progress + stats.judgment.in_progress + stats.survey.in_progress + stats.dataAnalysis.in_progress,
    completed: stats.researchDesign.completed + stats.judgment.completed + stats.survey.completed + stats.dataAnalysis.completed,
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">연구 현황을 한눈에 확인하세요</p>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{user.email}</span>
                </div>
                <button
                  onClick={() => userSignOut()}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <OverviewCard label="전체 의뢰" breakdown={totalStats} color="slate" />
          <OverviewCard label="연구설계" breakdown={stats.researchDesign} color="emerald" href="/data-generation" />
          <OverviewCard label="자료 수집" breakdown={stats.judgment.total + stats.survey.total > 0 ? { total: stats.judgment.total + stats.survey.total, pending: stats.judgment.pending + stats.survey.pending, in_progress: stats.judgment.in_progress + stats.survey.in_progress, completed: stats.judgment.completed + stats.survey.completed } : emptyBreakdown} color="blue" href="/judgment-results" />
          <OverviewCard label="설문조사" breakdown={stats.survey} color="violet" href="/survey-results" />
          <OverviewCard label="데이터 분석" breakdown={stats.dataAnalysis} color="amber" href="/quant-results" />
        </div>

        {/* Quick Access Services */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">바로가기</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
            {quickServices.map((svc) => (
              <Link
                key={svc.title}
                href={svc.href}
                className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 text-gray-500 group-hover:bg-teal-50 group-hover:text-teal-600 flex items-center justify-center transition-colors">
                  {svc.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-gray-600 group-hover:text-gray-900 text-center leading-tight transition-colors">{svc.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Two-column layout: Projects + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">프로젝트</h2>
                <p className="text-xs text-gray-400 mt-0.5">생성된 프로젝트를 관리합니다</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 프로젝트
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="px-6 py-16 text-center">
                  <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    로딩 중...
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">프로젝트가 없습니다</p>
                  <p className="text-gray-400 text-xs">새 프로젝트를 만들어 연구를 시작하세요</p>
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
                      className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors truncate">{project.name}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            {project.caseCount}건 중 {project.codedCount}건 완료 &middot; {project.createdAt.slice(0, 10)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="text-sm font-bold text-gray-900">{pct}%</div>
                        </div>
                        <div className="w-20 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all"
                            style={{ width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%` }}
                          />
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Status Summary Sidebar */}
          <div className="space-y-4">
            {/* Status breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">의뢰 현황</h3>
              <div className="space-y-4">
                <StatusRow label="연구설계" stats={stats.researchDesign} href="/data-generation" />
                <StatusRow label="판결문" stats={stats.judgment} href="/judgment-results" />
                <StatusRow label="설문조사" stats={stats.survey} href="/survey-results" />
                <StatusRow label="데이터 분석" stats={stats.dataAnalysis} href="/quant-results" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">빠른 작업</h3>
              <div className="space-y-2">
                <QuickAction label="새 프로젝트 만들기" onClick={() => setShowModal(true)} icon="plus" />
                <QuickAction label="결과물 샘플 보기" href="/samples" icon="eye" />
                <QuickAction label="문의하기" href="/contact" icon="chat" />
                <QuickAction label="FAQ" href="/faq" icon="question" />
              </div>
            </div>
          </div>
        </div>

        {/* New project modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">새 프로젝트 만들기</h2>
                  <p className="text-xs text-gray-400">프로젝트 정보를 입력하세요</p>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">템플릿 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTemplate("judgment")}
                    className={`px-3 py-2.5 rounded-xl text-sm border-2 transition-all ${
                      selectedTemplate === "judgment"
                        ? "border-teal-600 bg-teal-50 text-teal-700 font-medium"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    판결문
                  </button>
                  <button disabled className="px-3 py-2.5 rounded-xl text-sm border-2 border-gray-100 opacity-40 cursor-not-allowed text-gray-400">
                    학술논문 (준비 중)
                  </button>
                  <button disabled className="px-3 py-2.5 rounded-xl text-sm border-2 border-gray-100 opacity-40 cursor-not-allowed text-gray-400">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-shadow placeholder-gray-300"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { setShowModal(false); setNewName(""); setSelectedTemplate("judgment"); }}
                  className="px-5 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {creating ? "생성 중..." : "생성"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function OverviewCard({
  label,
  breakdown,
  color,
  href,
}: {
  label: string;
  breakdown: StatusBreakdown;
  color: string;
  href?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
    slate: { bg: "bg-slate-50", text: "text-slate-900", accent: "bg-slate-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-200" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", accent: "bg-violet-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-200" },
  };
  const c = colorMap[color] || colorMap.slate;

  const content = (
    <div className={`rounded-xl border border-gray-100 bg-white p-4 sm:p-5 hover:shadow-md transition-all ${href ? "cursor-pointer" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${c.accent}`} />
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{breakdown.total}</div>
      <div className="flex items-center gap-3 text-[10px] sm:text-xs">
        <span className="flex items-center gap-1 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          접수 {breakdown.pending}
        </span>
        <span className="flex items-center gap-1 text-blue-500">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          진행 {breakdown.in_progress}
        </span>
        <span className="flex items-center gap-1 text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          완료 {breakdown.completed}
        </span>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function StatusRow({ label, stats, href }: { label: string; stats: StatusBreakdown; href: string }) {
  const total = stats.total || 1;
  const completedPct = (stats.completed / total) * 100;
  const inProgressPct = (stats.in_progress / total) * 100;

  return (
    <Link href={href} className="block group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700 transition-colors">{label}</span>
        <span className="text-xs text-gray-400">{stats.total}건</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
        {stats.completed > 0 && (
          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${completedPct}%` }} />
        )}
        {stats.in_progress > 0 && (
          <div className="h-full bg-blue-400 transition-all" style={{ width: `${inProgressPct}%` }} />
        )}
      </div>
    </Link>
  );
}

function QuickAction({ label, onClick, href, icon }: { label: string; onClick?: () => void; href?: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    plus: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    eye: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    chat: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    question: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const cls = "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-slate-50 hover:text-gray-900 transition-colors";

  if (href) {
    return (
      <Link href={href} className={cls}>
        <span className="text-gray-400">{icons[icon]}</span>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      <span className="text-gray-400">{icons[icon]}</span>
      {label}
    </button>
  );
}
