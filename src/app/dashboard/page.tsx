"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/contexts/UserAuthContext";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

const serviceCards = [
  {
    title: "연구 설계 지원",
    desc: "연구 주제 설계, 통계분석 설계",
    href: "/data-generation",
    image: "/images/서비스_연구설계지원.png",
  },
  {
    title: "설문조사",
    desc: "설문 설계부터 데이터 수집까지",
    href: "/survey-request",
    image: "/images/서비스_설문조사.png",
  },
  {
    title: "판결문 분석",
    desc: "판결문 수집부터 변수 코딩까지",
    href: "/judgment",
    image: "/images/서비스_판결문 코딩.png",
  },
  {
    title: "뉴스/언론 보도",
    desc: "키워드 기반 뉴스 수집 및 분석",
    href: "/news-search",
    image: "/images/서비스_기사분석.png",
  },
  {
    title: "계량분석",
    desc: "기초통계부터 고급 계량분석까지",
    href: "/quant-analysis",
    image: "/images/서비스_계량통계분석.png",
  },
  {
    title: "텍스트 분석",
    desc: "토픽모델링, 감성분석, 워드클라우드",
    href: "/text-analysis",
    image: "/images/서비스_텍스트분석.png",
  },
];

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
    try {
      const [projRes, researchRes, statsDesignRes, surveyRes, dtRes, quantRes, textRes, qualRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/research-design"),
        fetch("/api/stats-design"),
        fetch("/api/survey"),
        fetch("/api/data-transform"),
        fetch("/api/quant-analysis"),
        fetch("/api/text-analysis-request"),
        fetch("/api/qual-analysis"),
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
  }, []);

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
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/dashboard-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="p-3 sm:p-4 lg:p-6 max-w-full mx-2 sm:mx-4 lg:mx-6 relative z-10">
        {/* Welcome Banner + Stats */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0f1a2e] to-[#1a2744] p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-5 sm:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  환영합니다
                </h1>
                <p className="text-[#d4a843] mt-1.5 sm:mt-2 text-xs sm:text-sm lg:text-base leading-relaxed">
                  ResearchOn에서 연구를 시작하세요
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#c49a2e] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#d4a843] transition-colors shadow-md"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  새 프로젝트 만들기
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {user ? (
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-[#c49a2e]/30 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#c49a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs text-white/70 hidden sm:inline">{user.email}</span>
                    <button
                      onClick={() => userSignOut()}
                      className="text-[10px] text-white/40 hover:text-white/70 transition-colors ml-1"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 bg-[#c49a2e] hover:bg-[#d4a843] rounded-lg px-4 py-2 transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm text-white font-semibold">로그인</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats inside banner */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
              <StatCard label="전체 의뢰" breakdown={totalStats} icon="folder" color="blue" />
              <StatCard label="연구설계" breakdown={stats.researchDesign} icon="lightbulb" color="green" href="/data-generation"
                subLinks={[{ label: "의뢰", href: "/data-generation" }, { label: "결과", href: "/data-generation" }]}
              />
              <StatCard label="판결문 분석" breakdown={stats.judgment} icon="document" color="amber" href="/judgment"
                subLinks={[{ label: "코딩", href: "/judgment" }, { label: "수집의뢰", href: "/judgment-collection" }, { label: "결과", href: "/judgment-results" }]}
              />
              <StatCard label="설문조사" breakdown={stats.survey} icon="clipboard" color="purple" href="/survey-request"
                subLinks={[{ label: "의뢰", href: "/survey-request" }, { label: "결과", href: "/survey-results" }]}
              />
              <StatCard label="데이터 분석" breakdown={stats.dataAnalysis} icon="chart" color="rose" href="/stats-analysis"
                subLinks={[{ label: "기초통계", href: "/stats-analysis" }, { label: "계량분석", href: "/quant-analysis" }, { label: "텍스트", href: "/text-analysis" }]}
              />
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-[#c49a2e]/10" />
        </div>

        {/* Service Cards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">서비스</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
            {serviceCards.map((card) => (
              <Link key={card.title} href={card.href} className="group block">
                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-[#c49a2e]/40 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="relative bg-gray-50 h-28 sm:h-44">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-5 border-t border-gray-100">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900">{card.title}</h3>
                    <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1.5 line-clamp-2">{card.desc}</p>
                    <span className="hidden sm:inline-block text-sm text-[#c49a2e] font-medium group-hover:underline underline-offset-4 mt-2">시작하기 &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Projects list */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">프로젝트 목록</h2>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">생성된 프로젝트를 관리합니다</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#c49a2e] border border-[#c49a2e]/30 rounded-lg hover:bg-[#c49a2e]/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              추가
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
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#c49a2e]/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#c49a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#c49a2e] transition-colors truncate">{project.name}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                          {project.caseCount}건 중 {project.codedCount}건 완료 &middot; {project.createdAt.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-gray-900">{pct}%</div>
                      </div>
                      <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#c49a2e] to-[#d4a843] rounded-full transition-all"
                          style={{
                            width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-[#c49a2e] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#c49a2e]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c49a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        ? "border-[#c49a2e] bg-[#c49a2e]/10 text-[#c49a2e] font-medium"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/30 focus:border-[#c49a2e] transition-shadow placeholder-gray-300"
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
                  className="px-5 py-2.5 bg-[#c49a2e] text-white rounded-xl text-sm font-medium hover:bg-[#d4a843] transition-colors disabled:opacity-50 shadow-sm"
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

function StatCard({
  label,
  breakdown,
  icon,
  color,
  href,
  subLinks,
}: {
  label: string;
  breakdown: StatusBreakdown;
  icon: string;
  color: string;
  href?: string;
  subLinks?: { label: string; href: string }[];
}) {
  const colorMap: Record<string, { text: string; iconBg: string }> = {
    blue: { text: "text-blue-300", iconBg: "bg-blue-400/20" },
    amber: { text: "text-[#d4a843]", iconBg: "bg-[#c49a2e]/20" },
    green: { text: "text-emerald-400", iconBg: "bg-emerald-400/20" },
    purple: { text: "text-purple-400", iconBg: "bg-purple-400/20" },
    rose: { text: "text-rose-400", iconBg: "bg-rose-400/20" },
  };

  const c = colorMap[color] || colorMap.blue;

  const icons: Record<string, React.ReactNode> = {
    folder: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    lightbulb: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    document: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    clipboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-5 hover:bg-white/15 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 sm:[&_svg]:w-5 sm:[&_svg]:h-5 mb-2 sm:mb-3`}>
            {icons[icon]}
          </div>
          <div className="text-xl sm:text-3xl font-bold text-white tracking-tight">{breakdown.total}</div>
          <span className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5 sm:mt-1 block">{label}</span>
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 text-right">
          <span className="text-[10px] sm:text-xs text-gray-400 flex items-center justify-end gap-1.5">
            접수 <span className="font-bold text-white/90 text-xs sm:text-sm min-w-[16px]">{breakdown.pending}</span>
            <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
          </span>
          <span className="text-[10px] sm:text-xs text-blue-400 flex items-center justify-end gap-1.5">
            진행 <span className="font-bold text-white/90 text-xs sm:text-sm min-w-[16px]">{breakdown.in_progress}</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          </span>
          <span className="text-[10px] sm:text-xs text-green-400 flex items-center justify-end gap-1.5">
            완료 <span className="font-bold text-white/90 text-xs sm:text-sm min-w-[16px]">{breakdown.completed}</span>
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          </span>
        </div>
      </div>
      {subLinks && subLinks.length > 0 && (
        <div className="flex gap-1.5 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/10">
          {subLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="flex-1 text-center text-[9px] sm:text-[11px] text-white/50 hover:text-white hover:bg-white/10 rounded-md py-1 sm:py-1.5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
