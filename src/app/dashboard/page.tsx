"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
interface Project {
  id: string;
  name: string;
  createdAt: string;
  caseCount: number;
  codedCount: number;
}

/* ---------- Service Cards Data ---------- */

const serviceCards = [
  {
    title: "판결문 코딩",
    desc: "AI 기반 판결문 자동 코딩",
    href: "/judgment",
    image: "/images/판결문1.png",
  },
  {
    title: "계량통계분석",
    desc: "기초통계부터 고급분석까지",
    href: "/stats-analysis",
    image: "/images/계량통계분석1.png",
    badge: "준비 중",
  },
  {
    title: "텍스트 분석",
    desc: "토픽모델링, 감성분석, 워드클라우드",
    href: "/text-analysis",
    image: "/images/텍스트분석1.png",
  },
  {
    title: "설문조사",
    desc: "설문 설계부터 데이터 수집까지",
    href: "/survey-request",
    image: "/images/설문조사1.png",
  },
  {
    title: "기사 검색",
    desc: "키워드 기반 뉴스 검색 및 요약",
    href: "/news-search",
    image: "/images/기사검색1.png",
  },
  {
    title: "연구 설계 지원",
    desc: "검정력 분석, 시뮬레이션",
    href: "/data-generation",
    image: "/images/연구설계지원1.png",
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111111] to-[#1a1a1a] p-8 lg:p-10 mb-8 shadow-lg border border-[#2a2a2a]">
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
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#c49a2e] text-[#0f1a2e] rounded-lg text-sm font-semibold hover:bg-[#d4a843] transition-colors shadow-sm"
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
          <h2 className="text-lg font-bold text-white">서비스</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCards.map((card) => (
            <Link key={card.title} href={card.href} className="group block">
              <div className="rounded-2xl border-2 border-[#c49a2e]/40 hover:border-[#d4a843] bg-[#111111] overflow-hidden hover:shadow-2xl hover:shadow-[#c49a2e]/10 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="relative h-40 bg-[#0a0a0a] flex items-center justify-center p-3">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={280}
                    height={160}
                    className="object-contain max-h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {card.badge && (
                    <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold bg-[#c49a2e] text-black px-2.5 py-1 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 border-t border-[#c49a2e]/20">
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{card.desc}</p>
                  <span className="inline-block text-sm text-[#d4a843] font-medium group-hover:underline underline-offset-4 mt-2">시작하기 &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Projects list */}
      <div className="bg-[#111111] rounded-xl border border-[#2a2a2a] shadow-md shadow-black/20">
        <div className="px-6 py-5 border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">프로젝트 목록</h2>
            <p className="text-xs text-gray-400 mt-0.5">생성된 프로젝트를 관리합니다</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#c49a2e] border border-[#c49a2e]/20 rounded-lg hover:bg-[#c49a2e]/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            추가
          </button>
        </div>
        <div className="divide-y divide-[#2a2a2a]">
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
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm font-medium mb-1">프로젝트가 없습니다</p>
              <p className="text-gray-500 text-xs">새 프로젝트를 만들어 연구를 시작하세요</p>
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
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#c49a2e]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[#d4a843] transition-colors">{project.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {project.caseCount}건 중 {project.codedCount}건 완료 &middot; {project.createdAt.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-white">{pct}%</div>
                    </div>
                    <div className="w-24 h-2 bg-[#1a1a1a] rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-gradient-to-r from-[#c49a2e] to-[#d4a843] rounded-full transition-all"
                        style={{
                          width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-[#111111] rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#c49a2e]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#c49a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">새 프로젝트 만들기</h2>
                <p className="text-xs text-gray-400">프로젝트 정보를 입력하세요</p>
              </div>
            </div>

            {/* Template selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-200 mb-2">템플릿 선택</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTemplate("judgment")}
                  className={`px-3 py-2.5 rounded-xl text-sm border-2 transition-all ${
                    selectedTemplate === "judgment"
                      ? "border-[#c49a2e] bg-[#c49a2e]/10 text-[#d4a843] font-medium"
                      : "border-[#2a2a2a] hover:bg-[#1a1a1a] text-gray-300"
                  }`}
                >
                  판결문
                </button>
                <button
                  disabled
                  className="px-3 py-2.5 rounded-xl text-sm border-2 border-[#2a2a2a] opacity-40 cursor-not-allowed text-gray-500"
                >
                  학술논문 (준비 중)
                </button>
                <button
                  disabled
                  className="px-3 py-2.5 rounded-xl text-sm border-2 border-[#2a2a2a] opacity-40 cursor-not-allowed text-gray-500"
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
              className="w-full px-4 py-3 border border-[#2a2a2a] rounded-xl text-sm bg-[#0f1a2e] text-white focus:outline-none focus:ring-2 focus:ring-[#c49a2e]/30 focus:border-[#c49a2e] transition-shadow"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setNewName(""); setSelectedTemplate("judgment"); }}
                className="px-5 py-2.5 border border-[#2a2a2a] text-gray-300 rounded-xl text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="px-5 py-2.5 bg-[#c49a2e] text-[#0f1a2e] rounded-xl text-sm font-medium hover:bg-[#d4a843] transition-colors disabled:opacity-50 shadow-sm"
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
    blue: { bg: "bg-[#111111]", text: "text-[#5ba0e8]", iconBg: "bg-[#1a1a1a]" },
    amber: { bg: "bg-[#111111]", text: "text-[#d4a843]", iconBg: "bg-[#1a1a1a]" },
    green: { bg: "bg-[#111111]", text: "text-emerald-400", iconBg: "bg-[#1a1a1a]" },
    purple: { bg: "bg-[#111111]", text: "text-purple-400", iconBg: "bg-[#1a1a1a]" },
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
    <div className="bg-[#111111] rounded-xl border border-[#2a2a2a] shadow-md shadow-black/20 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center`}>
          {icons[icon]}
        </div>
      </div>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      <span className="text-xs text-gray-400 font-medium mt-1 block">{label}</span>
    </div>
  );
}
