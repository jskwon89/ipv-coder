"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

const serviceCards = [
  {
    title: "판결문 코딩",
    desc: "AI 기반 판결문 자동 코딩",
    href: "/judgment",
    image: "/images/서비스_판결문 코딩.png",
  },
  {
    title: "계량통계분석",
    desc: "기초통계부터 고급분석까지",
    href: "/stats-analysis",
    image: "/images/서비스_계량통계분석.png",
    badge: "준비 중",
  },
  {
    title: "텍스트 분석",
    desc: "토픽모델링, 감성분석, 워드클라우드",
    href: "/text-analysis",
    image: "/images/서비스_텍스트분석.png",
  },
  {
    title: "설문조사",
    desc: "설문 설계부터 데이터 수집까지",
    href: "/survey-request",
    image: "/images/서비스_설문조사.png",
  },
  {
    title: "기사 검색",
    desc: "키워드 기반 뉴스 검색 및 요약",
    href: "/news-search",
    image: "/images/서비스_기사분석.png",
  },
  {
    title: "연구 설계 지원",
    desc: "검정력 분석, 시뮬레이션",
    href: "/data-generation",
    image: "/images/서비스_연구설계지원.png",
    badge: "준비 중",
  },
];

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
            </div>

            {/* Stats inside banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <StatCard label="총 프로젝트" value={totalProjects} icon="folder" color="blue" />
              <StatCard label="총 사건 수" value={totalCases} icon="document" color="amber" />
              <StatCard label="코딩 완료" value={totalCoded} icon="check" color="green" />
              <StatCard label="완료율" value={`${completionRate}%`} icon="chart" color="purple" />
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
                    {card.badge && (
                      <span className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 text-[8px] sm:text-[10px] font-semibold bg-[#c49a2e] text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        {card.badge}
                      </span>
                    )}
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
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  const colorMap: Record<string, { text: string; iconBg: string }> = {
    blue: { text: "text-blue-300", iconBg: "bg-blue-400/20" },
    amber: { text: "text-[#d4a843]", iconBg: "bg-[#c49a2e]/20" },
    green: { text: "text-emerald-400", iconBg: "bg-emerald-400/20" },
    purple: { text: "text-purple-400", iconBg: "bg-purple-400/20" },
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
    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-5 hover:bg-white/15 transition-all">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 sm:[&_svg]:w-5 sm:[&_svg]:h-5`}>
          {icons[icon]}
        </div>
      </div>
      <div className="text-xl sm:text-3xl font-bold text-white tracking-tight">{value}</div>
      <span className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5 sm:mt-1 block">{label}</span>
    </div>
  );
}
