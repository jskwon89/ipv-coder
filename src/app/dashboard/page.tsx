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

/* ---------- SVG Pictograms ---------- */

const ScalesOfJustice = ({ size = 120, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <line x1="60" y1="16" x2="60" y2="100" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="30" y1="36" x2="90" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="60" cy="16" r="4" stroke="white" strokeWidth="1.5" />
    <path d="M30 36 L18 70 L42 70 Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    <path d="M18 70 Q18 82 30 82 Q42 82 42 70" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M90 36 L78 70 L102 70 Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    <path d="M78 70 Q78 82 90 82 Q102 82 102 70" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="50" y="96" width="20" height="6" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
);

const BarChartTrend = ({ size = 120, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <rect x="14" y="70" width="14" height="34" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="34" y="50" width="14" height="54" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="54" y="58" width="14" height="46" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="74" y="36" width="14" height="68" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="94" y="22" width="14" height="82" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M18 66 L40 46 L60 52 L80 30 L100 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="100" cy="18" r="3" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
);

const TextDocument = ({ size = 120, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <rect x="22" y="12" width="56" height="76" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
    <line x1="32" y1="28" x2="68" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="38" x2="62" y2="38" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="48" x2="66" y2="48" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="58" x2="56" y2="58" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="68" x2="60" y2="68" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="72" y="32" width="30" height="20" rx="10" stroke="white" strokeWidth="1.5" fill="none" />
    <text x="87" y="46" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Aa</text>
    <rect x="68" y="62" width="34" height="20" rx="10" stroke="white" strokeWidth="1.5" fill="none" />
    <text x="85" y="76" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">NLP</text>
    <rect x="76" y="90" width="26" height="18" rx="9" stroke="white" strokeWidth="1.5" fill="none" />
    <text x="89" y="103" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">W</text>
  </svg>
);

const ClipboardCheck = ({ size = 120, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <rect x="28" y="20" width="64" height="88" rx="6" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="44" y="12" width="32" height="16" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="60" cy="20" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M42 48 L50 56 L66 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="72" y1="48" x2="82" y2="48" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M42 68 L50 76 L66 60" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="72" y1="68" x2="82" y2="68" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="42" y="84" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <line x1="72" y1="90" x2="82" y2="90" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NewspaperSearch = ({ size = 120, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <rect x="16" y="16" width="68" height="88" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
    <line x1="26" y1="30" x2="74" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="40" x2="60" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="26" y1="50" x2="56" y2="50" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="26" y1="60" x2="50" y2="60" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="26" y="70" width="24" height="20" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
    <line x1="56" y1="74" x2="74" y2="74" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="56" y1="82" x2="70" y2="82" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="90" cy="78" r="18" stroke="white" strokeWidth="1.5" fill="none" />
    <line x1="103" y1="91" x2="112" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FlaskGear = ({ size = 120, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <path d="M44 16 L44 48 L20 96 Q18 102 24 106 L76 106 Q82 102 80 96 L56 48 L56 16" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    <line x1="38" y1="16" x2="62" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="72" x2="66" y2="72" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
    <circle cx="42" cy="84" r="3" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="54" cy="90" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="92" cy="44" r="16" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="92" cy="44" r="5" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M92 24 L92 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M92 60 L92 64" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M72 44 L76 44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M108 44 L112 44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M78 30 L80.8 32.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M103.2 55.2 L106 58" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M106 30 L103.2 32.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M80.8 55.2 L78 58" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ---------- Small Icons for frosted circles ---------- */

const IconGavel = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 3.5L20.5 9.5M4 20L10.5 13.5M14 10L17 7M7 17L10 14" />
    <rect x="12" y="2" width="8" height="4" rx="1" transform="rotate(45 16 4)" />
  </svg>
);

const IconChart = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="7" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

const IconTextDoc = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

const IconChecklist = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10l2 2 4-4" />
    <line x1="8" y1="16" x2="16" y2="16" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const IconLightbulb = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z" />
  </svg>
);

/* ---------- Service Cards Data ---------- */

const serviceCards = [
  {
    title: "판결문 코딩",
    desc: "AI 기반 판결문 자동 코딩",
    href: "/dashboard?type=judgment",
    gradient: "from-slate-700 to-slate-900",
    LargeSvg: ScalesOfJustice,
    SmallIcon: IconGavel,
  },
  {
    title: "계량통계분석",
    desc: "기초통계부터 고급분석까지",
    href: "/stats-analysis",
    gradient: "from-blue-600 to-indigo-700",
    badge: "준비 중",
    LargeSvg: BarChartTrend,
    SmallIcon: IconChart,
  },
  {
    title: "텍스트 분석",
    desc: "토픽모델링, 감성분석, 워드클라우드",
    href: "/text-analysis",
    gradient: "from-violet-600 to-purple-800",
    LargeSvg: TextDocument,
    SmallIcon: IconTextDoc,
  },
  {
    title: "설문조사",
    desc: "설문 설계부터 데이터 수집까지",
    href: "/survey-request",
    gradient: "from-indigo-500 to-blue-700",
    LargeSvg: ClipboardCheck,
    SmallIcon: IconChecklist,
  },
  {
    title: "기사 검색",
    desc: "키워드 기반 뉴스 검색 및 요약",
    href: "/news-search",
    gradient: "from-emerald-600 to-teal-700",
    LargeSvg: NewspaperSearch,
    SmallIcon: IconSearch,
  },
  {
    title: "연구 설계 지원",
    desc: "검정력 분석, 시뮬레이션",
    href: "/data-generation",
    gradient: "from-cyan-600 to-blue-800",
    badge: "준비 중",
    LargeSvg: FlaskGear,
    SmallIcon: IconLightbulb,
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a5f] via-[#264d7a] to-[#2d6cb4] p-8 lg:p-10 mb-8 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              환영합니다
            </h1>
            <p className="text-blue-100 mt-2 text-sm lg:text-base leading-relaxed">
              DocCoder에서 연구를 시작하세요
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1e3a5f] rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 프로젝트 만들기
            </button>
          </div>
          <div className="hidden lg:flex items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm">
            <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="총 프로젝트" value={totalProjects} icon="folder" color="blue" />
        <StatCard label="총 사건 수" value={totalCases} icon="document" color="amber" />
        <StatCard label="코딩 완료" value={totalCoded} icon="check" color="green" />
        <StatCard label="완료율" value={`${completionRate}%`} icon="chart" color="purple" />
      </div>

      {/* Quick Action Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">서비스</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCards.map((card) => (
            <Link key={card.title} href={card.href} className="group block">
              <div className={`relative h-44 rounded-2xl bg-gradient-to-br ${card.gradient} overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}>
                {/* Large decorative SVG - right side, subtle */}
                <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">
                  <card.LargeSvg size={120} />
                </div>
                {/* Badge */}
                {card.badge && (
                  <span className="absolute top-4 right-4 z-10 text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/20">
                    {card.badge}
                  </span>
                )}
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                      <card.SmallIcon />
                    </div>
                    <h3 className="text-lg font-bold text-white">{card.title}</h3>
                    <p className="text-sm text-white/70 mt-1">{card.desc}</p>
                  </div>
                  <span className="text-sm text-white/80 font-medium group-hover:underline underline-offset-4">시작하기 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Projects list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">프로젝트 목록</h2>
            <p className="text-xs text-gray-400 mt-0.5">생성된 프로젝트를 관리합니다</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-lg hover:bg-[#1e3a5f]/5 transition-colors"
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
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">프로젝트가 없습니다</p>
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
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/5 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#1e3a5f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">{project.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {project.caseCount}건 중 {project.codedCount}건 완료 &middot; {project.createdAt.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-gray-900">{pct}%</div>
                    </div>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#2d6cb4] rounded-full transition-all"
                        style={{
                          width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">새 프로젝트 만들기</h2>
                <p className="text-xs text-gray-400">프로젝트 정보를 입력하세요</p>
              </div>
            </div>

            {/* Template selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">템플릿 선택</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTemplate("judgment")}
                  className={`px-3 py-2.5 rounded-xl text-sm border-2 transition-all ${
                    selectedTemplate === "judgment"
                      ? "border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f] font-medium"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  판결문
                </button>
                <button
                  disabled
                  className="px-3 py-2.5 rounded-xl text-sm border-2 border-gray-100 opacity-40 cursor-not-allowed text-gray-500"
                >
                  학술논문 (준비 중)
                </button>
                <button
                  disabled
                  className="px-3 py-2.5 rounded-xl text-sm border-2 border-gray-100 opacity-40 cursor-not-allowed text-gray-500"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-shadow"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setNewName(""); setSelectedTemplate("judgment"); }}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors disabled:opacity-50 shadow-sm"
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
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: "bg-blue-50/50", text: "text-blue-600", iconBg: "bg-blue-100" },
    amber: { bg: "bg-amber-50/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    green: { bg: "bg-emerald-50/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
    purple: { bg: "bg-purple-50/50", text: "text-purple-600", iconBg: "bg-purple-100" },
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center`}>
          {icons[icon]}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
      <span className="text-xs text-gray-400 font-medium mt-1 block">{label}</span>
    </div>
  );
}
