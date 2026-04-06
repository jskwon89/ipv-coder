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

/* ---------- Service SVG Icons ---------- */

function IconJudgment() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
      <rect x="18" y="30" width="44" height="36" rx="3" fill="#0f1a2e" stroke="#c49a2e" strokeWidth="2"/>
      <line x1="26" y1="42" x2="54" y2="42" stroke="#5ba0e8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="50" x2="48" y2="50" stroke="#5ba0e8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="58" x2="42" y2="58" stroke="#5ba0e8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="52" cy="22" r="12" fill="#c49a2e"/>
      <path d="M48 22h8M52 18v8" stroke="#0f1a2e" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="46" y="14" width="12" height="4" rx="1" fill="#d4a843"/>
    </svg>
  );
}

function IconStats() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
      <rect x="14" y="50" width="12" height="20" rx="2" fill="#5ba0e8"/>
      <rect x="34" y="35" width="12" height="35" rx="2" fill="#c49a2e"/>
      <rect x="54" y="20" width="12" height="50" rx="2" fill="#d4a843"/>
      <path d="M18 48L40 30L60 18" stroke="#5ba0e8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3"/>
      <circle cx="60" cy="18" r="4" fill="#5ba0e8" stroke="#0f1a2e" strokeWidth="2"/>
      <line x1="10" y1="72" x2="70" y2="72" stroke="white" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  );
}

function IconTextAnalysis() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
      <rect x="12" y="16" width="40" height="50" rx="4" fill="#0f1a2e" stroke="#5ba0e8" strokeWidth="1.5"/>
      <line x1="20" y1="28" x2="44" y2="28" stroke="#5ba0e8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="36" x2="40" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="20" y1="44" x2="36" y2="44" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="20" y1="52" x2="38" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <circle cx="56" cy="50" r="14" stroke="#c49a2e" strokeWidth="2.5" fill="none"/>
      <line x1="66" y1="60" x2="72" y2="66" stroke="#c49a2e" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="56" cy="50" r="6" fill="#c49a2e" opacity="0.2"/>
    </svg>
  );
}

function IconSurvey() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
      <rect x="16" y="10" width="48" height="60" rx="4" fill="#0f1a2e" stroke="#c49a2e" strokeWidth="1.5"/>
      <rect x="14" y="6" width="24" height="10" rx="3" fill="#c49a2e"/>
      <rect x="26" y="26" width="12" height="12" rx="2" stroke="#5ba0e8" strokeWidth="2" fill="none"/>
      <path d="M29 32l3 3 5-5" stroke="#5ba0e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="44" y1="32" x2="56" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <rect x="26" y="46" width="12" height="12" rx="2" stroke="#d4a843" strokeWidth="2" fill="none"/>
      <path d="M29 52l3 3 5-5" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="44" y1="52" x2="56" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function IconNewsSearch() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
      <rect x="10" y="14" width="48" height="52" rx="4" fill="#0f1a2e" stroke="#5ba0e8" strokeWidth="1.5"/>
      <rect x="18" y="22" width="20" height="14" rx="2" fill="#5ba0e8" opacity="0.3"/>
      <line x1="18" y1="42" x2="50" y2="42" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="18" y1="48" x2="44" y2="48" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <line x1="18" y1="54" x2="40" y2="54" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <line x1="42" y1="22" x2="50" y2="22" stroke="#c49a2e" strokeWidth="2" strokeLinecap="round"/>
      <line x1="42" y1="28" x2="50" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <circle cx="58" cy="52" r="12" stroke="#c49a2e" strokeWidth="2.5" fill="none"/>
      <line x1="67" y1="61" x2="72" y2="66" stroke="#c49a2e" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function IconResearchDesign() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
      <path d="M40 10C32 10 28 16 28 22c0 6 4 10 8 12v4h8v-4c4-2 8-6 8-12 0-6-4-12-12-12z" fill="#c49a2e"/>
      <rect x="34" y="38" width="12" height="4" rx="1" fill="#d4a843"/>
      <rect x="36" y="42" width="8" height="3" rx="1" fill="#d4a843"/>
      <circle cx="24" cy="58" r="8" fill="#0f1a2e" stroke="#5ba0e8" strokeWidth="2"/>
      <circle cx="56" cy="58" r="8" fill="#0f1a2e" stroke="#5ba0e8" strokeWidth="2"/>
      <circle cx="40" cy="68" r="6" fill="#0f1a2e" stroke="#c49a2e" strokeWidth="2"/>
      <line x1="32" y1="54" x2="36" y2="64" stroke="#5ba0e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="54" x2="44" y2="64" stroke="#5ba0e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="40" y1="45" x2="40" y2="50" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
      <line x1="40" y1="50" x2="24" y2="50" stroke="#5ba0e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="40" y1="50" x2="56" y2="50" stroke="#5ba0e8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const serviceCards = [
  {
    title: "판결문 코딩",
    desc: "AI 기반 판결문 자동 코딩",
    href: "/judgment",
    icon: <IconJudgment />,
  },
  {
    title: "계량통계분석",
    desc: "기초통계부터 고급분석까지",
    href: "/stats-analysis",
    icon: <IconStats />,
    badge: "준비 중",
  },
  {
    title: "텍스트 분석",
    desc: "토픽모델링, 감성분석, 워드클라우드",
    href: "/text-analysis",
    icon: <IconTextAnalysis />,
  },
  {
    title: "설문조사",
    desc: "설문 설계부터 데이터 수집까지",
    href: "/survey-request",
    icon: <IconSurvey />,
  },
  {
    title: "기사 검색",
    desc: "키워드 기반 뉴스 검색 및 요약",
    href: "/news-search",
    icon: <IconNewsSearch />,
  },
  {
    title: "연구 설계 지원",
    desc: "검정력 분석, 시뮬레이션",
    href: "/data-generation",
    icon: <IconResearchDesign />,
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
      className="relative min-h-screen"
      style={{
        backgroundImage: "url('/images/dashboard-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl p-8 lg:p-10 mb-8 border border-white/20 shadow-lg">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                환영합니다
              </h1>
              <p className="text-[#d4a843] mt-2 text-sm lg:text-base leading-relaxed">
                ResearchOn에서 연구를 시작하세요
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#c49a2e] text-white rounded-lg text-sm font-semibold hover:bg-[#d4a843] transition-colors shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 프로젝트 만들기
              </button>
            </div>
            <div className="hidden lg:flex items-center justify-center w-32 h-32 rounded-full bg-white/5 border border-white/10">
              <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c49a2e]/5" />
          <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-[#5ba0e8]/5" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="총 프로젝트" value={totalProjects} icon="folder" color="blue" />
          <StatCard label="총 사건 수" value={totalCases} icon="document" color="amber" />
          <StatCard label="코딩 완료" value={totalCoded} icon="check" color="green" />
          <StatCard label="완료율" value={`${completionRate}%`} icon="chart" color="purple" />
        </div>

        {/* Service Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white/90">서비스</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCards.map((card) => (
              <Link key={card.title} href={card.href} className="group block">
                <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl overflow-hidden hover:bg-white/15 hover:border-[#c49a2e]/30 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-center justify-center py-8 relative">
                    {card.icon}
                    {card.badge && (
                      <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold bg-[#c49a2e] text-white px-2.5 py-1 rounded-full">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-base font-bold text-white">{card.title}</h3>
                    <p className="text-sm text-white/50 mt-1">{card.desc}</p>
                    <span className="inline-block text-sm text-[#d4a843] font-medium group-hover:underline underline-offset-4 mt-2">시작하기 &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Projects list */}
        <div className="bg-white/8 backdrop-blur-xl rounded-xl border border-white/15 shadow-lg">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">프로젝트 목록</h2>
              <p className="text-xs text-white/40 mt-0.5">생성된 프로젝트를 관리합니다</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#d4a843] border border-[#c49a2e]/30 rounded-lg hover:bg-[#c49a2e]/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              추가
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="px-6 py-16 text-center">
                <div className="inline-flex items-center gap-2 text-white/50 text-sm">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  로딩 중...
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <p className="text-white/70 text-sm font-medium mb-1">프로젝트가 없습니다</p>
                <p className="text-white/30 text-xs">새 프로젝트를 만들어 연구를 시작하세요</p>
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
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#c49a2e]/10 border border-[#c49a2e]/20 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-[#d4a843] transition-colors">{project.name}</h3>
                        <p className="text-xs text-white/40 mt-0.5">
                          {project.caseCount}건 중 {project.codedCount}건 완료 &middot; {project.createdAt.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-white">{pct}%</div>
                      </div>
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-gradient-to-r from-[#c49a2e] to-[#d4a843] rounded-full transition-all"
                          style={{
                            width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <svg className="w-5 h-5 text-white/30 group-hover:text-[#d4a843] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#0f1a2e]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#c49a2e]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c49a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">새 프로젝트 만들기</h2>
                  <p className="text-xs text-white/40">프로젝트 정보를 입력하세요</p>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-white/70 mb-2">템플릿 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTemplate("judgment")}
                    className={`px-3 py-2.5 rounded-xl text-sm border-2 transition-all ${
                      selectedTemplate === "judgment"
                        ? "border-[#c49a2e] bg-[#c49a2e]/10 text-[#d4a843] font-medium"
                        : "border-white/10 hover:bg-white/5 text-white/50"
                    }`}
                  >
                    판결문
                  </button>
                  <button disabled className="px-3 py-2.5 rounded-xl text-sm border-2 border-white/5 opacity-40 cursor-not-allowed text-white/30">
                    학술논문 (준비 중)
                  </button>
                  <button disabled className="px-3 py-2.5 rounded-xl text-sm border-2 border-white/5 opacity-40 cursor-not-allowed text-white/30">
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
                className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/30 focus:border-[#c49a2e] transition-shadow placeholder-white/25"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { setShowModal(false); setNewName(""); setSelectedTemplate("judgment"); }}
                  className="px-5 py-2.5 border border-white/10 text-white/50 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
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
    blue: { text: "text-[#5ba0e8]", iconBg: "bg-[#5ba0e8]/15" },
    amber: { text: "text-[#d4a843]", iconBg: "bg-[#d4a843]/15" },
    green: { text: "text-emerald-400", iconBg: "bg-emerald-400/15" },
    purple: { text: "text-purple-400", iconBg: "bg-purple-400/15" },
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
    <div className="bg-white/8 backdrop-blur-xl rounded-xl border border-white/15 p-5 hover:bg-white/12 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center border border-white/5`}>
          {icons[icon]}
        </div>
      </div>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      <span className="text-xs text-white/40 font-medium mt-1 block">{label}</span>
    </div>
  );
}
