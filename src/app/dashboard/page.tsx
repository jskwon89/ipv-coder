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
    title: "연구설계",
    desc: "연구 주제 설계, 방법론 안내",
    href: "/data-generation",
    image: "/images/서비스_연구설계지원.png",
  },
  {
    title: "자료 수집",
    desc: "설문조사, 판결문, 뉴스 수집",
    href: "/survey-request",
    image: "/images/서비스_설문조사.png",
  },
  {
    title: "통계분석",
    desc: "기초통계부터 고급 계량분석까지",
    href: "/quant-analysis",
    image: "/images/서비스_계량통계분석.png",
  },
];

interface StatusBreakdown {
  total: number;
  pending: number;
  received: number;
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
  const emptyBreakdown: StatusBreakdown = { total: 0, pending: 0, received: 0, in_progress: 0, completed: 0 };
  const [stats, setStats] = useState<ServiceStats>({ researchDesign: { ...emptyBreakdown }, judgment: { ...emptyBreakdown }, survey: { ...emptyBreakdown }, dataAnalysis: { ...emptyBreakdown } });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    // 로그인하지 않은 경우 의뢰 데이터를 가져오지 않음
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const emailParam = user.email ? `?email=${encodeURIComponent(user.email)}` : "";
      const [projRes, researchRes, statsDesignRes, surveyRes, dtRes, quantRes, textRes, qualRes, jcRes, jcodingRes, newsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch(`/api/research-design${emailParam}`),
        fetch(`/api/stats-design${emailParam}`),
        fetch(`/api/survey${emailParam}`),
        fetch(`/api/data-transform${emailParam}`),
        fetch(`/api/quant-analysis${emailParam}`),
        fetch(`/api/text-analysis-request${emailParam}`),
        fetch(`/api/qual-analysis${emailParam}`),
        fetch(`/api/judgment-collection${emailParam}`),
        fetch(`/api/judgment-coding${emailParam}`),
        fetch(`/api/news-collection${emailParam}`),
      ]);
      const projData = await projRes.json();
      const researchData = await researchRes.json();
      const statsDesignData = await statsDesignRes.json();
      const surveyData = await surveyRes.json();
      const dtData = await dtRes.json();
      const quantData = await quantRes.json();
      const textData = await textRes.json();
      const qualData = await qualRes.json();
      const jcData = await jcRes.json();
      const jcodingData = await jcodingRes.json();
      const newsData = await newsRes.json();
      const prjs = projData.projects || [];
      setProjects(prjs);

      const countByStatus = (...lists: { status?: string }[][]) => {
        const all = lists.flat();
        return {
          total: all.length,
          pending: all.filter(r => r.status === "pending" || r.status === "received").length,
          received: all.filter(r => r.status === "received").length,
          in_progress: all.filter(r => r.status === "in_progress").length,
          completed: all.filter(r => r.status === "completed").length,
        };
      };

      const rdReqs = [...(researchData.requests || []), ...(statsDesignData.requests || [])];
      const surveyReqs = surveyData.requests || [];
      const judgmentReqs = [...(jcData.requests || []), ...(jcodingData.requests || [])];
      const daReqs = [...(dtData.requests || []), ...(quantData.requests || []), ...(textData.requests || []), ...(qualData.requests || []), ...(newsData.requests || [])];

      setStats({
        researchDesign: countByStatus(rdReqs),
        judgment: countByStatus(judgmentReqs),
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

  const totalStats: StatusBreakdown = {
    total: stats.researchDesign.total + stats.judgment.total + stats.survey.total + stats.dataAnalysis.total,
    pending: stats.researchDesign.pending + stats.judgment.pending + stats.survey.pending + stats.dataAnalysis.pending,
    received: stats.researchDesign.received + stats.judgment.received + stats.survey.received + stats.dataAnalysis.received,
    in_progress: stats.researchDesign.in_progress + stats.judgment.in_progress + stats.survey.in_progress + stats.dataAnalysis.in_progress,
    completed: stats.researchDesign.completed + stats.judgment.completed + stats.survey.completed + stats.dataAnalysis.completed,
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/images/dashboard-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-[#faf9f6]/80 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 환영 */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {user ? "안녕하세요 :)" : "환영합니다"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">PRIMER에서 연구를 시작하세요</p>
        </div>

        {/* 요청 현황 — 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
          <MiniStatCard label="전체 요청" count={totalStats.total} pending={totalStats.pending} inProgress={totalStats.in_progress} completed={totalStats.completed} color="teal" />
          <MiniStatCard label="연구설계" count={stats.researchDesign.total} pending={stats.researchDesign.pending} inProgress={stats.researchDesign.in_progress} completed={stats.researchDesign.completed} color="sky" href="/data-generation" />
          <MiniStatCard label="자료수집" count={stats.survey.total} pending={stats.survey.pending} inProgress={stats.survey.in_progress} completed={stats.survey.completed} color="violet" href="/survey-results" />
          <MiniStatCard label="통계분석" count={stats.dataAnalysis.total} pending={stats.dataAnalysis.pending} inProgress={stats.dataAnalysis.in_progress} completed={stats.dataAnalysis.completed} color="amber" href="/quant-results" />
        </div>

        {/* Service Cards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">서비스</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {serviceCards.map((card) => (
              <Link key={card.title} href={card.href} className="group block">
                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-teal-500/40 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
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
                    <span className="hidden sm:inline-block text-sm text-teal-500 font-medium group-hover:underline underline-offset-4 mt-2">시작하기 &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function MiniStatCard({ label, count, pending, inProgress, completed, href }: {
  label: string; count: number; pending: number; inProgress: number; completed: number; color?: string; href?: string;
}) {
  const card = (
    <div className={`bg-gray-50 border border-gray-300 rounded-2xl p-6 sm:p-7 ${href ? "hover:shadow-lg hover:border-teal-300 cursor-pointer" : ""} transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
          <p className="text-4xl sm:text-5xl font-bold text-gray-800">{count}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-right">
          <span className="flex items-center justify-end gap-1.5"><span className="text-gray-500">접수</span><span className="font-bold text-gray-700 min-w-[20px]">{pending}</span><span className="w-2.5 h-2.5 rounded-full bg-amber-300" /></span>
          <span className="flex items-center justify-end gap-1.5"><span className="text-gray-500">진행</span><span className="font-bold text-gray-700 min-w-[20px]">{inProgress}</span><span className="w-2.5 h-2.5 rounded-full bg-sky-300" /></span>
          <span className="flex items-center justify-end gap-1.5"><span className="text-gray-500">완료</span><span className="font-bold text-gray-700 min-w-[20px]">{completed}</span><span className="w-2.5 h-2.5 rounded-full bg-emerald-300" /></span>
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{card}</Link> : card;
}
