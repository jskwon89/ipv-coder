"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
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

export default function LandingPage() {
  const { user } = useUser();
  const [sections, setSections] = useState<Record<string, boolean>>({
    services: true,
    value_proposition: true,
    how_it_works: true,
    contact: true,
  });

  // Dashboard data
  const emptyBreakdown: StatusBreakdown = { total: 0, pending: 0, in_progress: 0, completed: 0 };
  const [totalStats, setTotalStats] = useState<StatusBreakdown>(emptyBreakdown);
  const [projects, setProjects] = useState<Project[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((d) => { if (d.settings) setSections(d.settings); })
      .catch(() => {});
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!user) { setStatsLoading(false); return; }
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
      const [projData, researchData, statsDesignData, surveyData, dtData, quantData, textData, qualData] = await Promise.all([
        projRes.json(), researchRes.json(), statsDesignRes.json(), surveyRes.json(),
        dtRes.json(), quantRes.json(), textRes.json(), qualRes.json(),
      ]);
      setProjects(projData.projects || []);

      const allReqs = [
        ...(researchData.requests || []), ...(statsDesignData.requests || []),
        ...(surveyData.requests || []), ...(dtData.requests || []),
        ...(quantData.requests || []), ...(textData.requests || []),
        ...(qualData.requests || []),
      ];
      const prjs = projData.projects || [];
      setTotalStats({
        total: allReqs.length + prjs.length,
        pending: allReqs.filter((r: { status?: string }) => r.status === "pending").length,
        in_progress: allReqs.filter((r: { status?: string }) => r.status === "in_progress").length + prjs.filter((p: Project) => p.codedCount < p.caseCount).length,
        completed: allReqs.filter((r: { status?: string }) => r.status === "completed").length + prjs.filter((p: Project) => p.caseCount > 0 && p.codedCount >= p.caseCount).length,
      });
    } catch { /* ignore */ }
    finally { setStatsLoading(false); }
  }, [user]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0f172a] min-h-[85vh]">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-teal-900/30" />

          {/* Academic visualization background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1400 800" fill="none" preserveAspectRatio="xMaxYMid slice">
            {/* ===== 1. WORD CLOUD (center-right, large, 논문 워드클라우드 형태) ===== */}
            <g opacity="0.22" transform="translate(980, 140)">
              {/* 핵심 키워드 — 크기=빈도, 빽빽하게 모여있는 형태 */}
              <text x="0" y="0" textAnchor="middle" fill="#b0bec5" fontSize="58" fontWeight="900" fontFamily="sans-serif">연구</text>
              <text x="120" y="-30" textAnchor="middle" fill="#90a4ae" fontSize="42" fontWeight="800" fontFamily="sans-serif">정책</text>
              <text x="-110" y="15" textAnchor="middle" fill="#94a3b8" fontSize="44" fontWeight="800" fontFamily="sans-serif">분석</text>
              <text x="60" y="50" textAnchor="middle" fill="#78909c" fontSize="38" fontWeight="700" fontFamily="sans-serif">데이터</text>
              <text x="-60" y="60" textAnchor="middle" fill="#a0aec0" fontSize="34" fontWeight="700" fontFamily="sans-serif">통계</text>
              <text x="180" y="25" textAnchor="middle" fill="#64748b" fontSize="30" fontWeight="700" fontFamily="sans-serif">교육</text>
              <text x="-160" y="-20" textAnchor="middle" fill="#90a4ae" fontSize="32" fontWeight="700" fontFamily="sans-serif">사회</text>
              <text x="-30" y="-55" textAnchor="middle" fill="#78909c" fontSize="28" fontWeight="600" fontFamily="sans-serif">설문</text>
              <text x="200" y="-10" textAnchor="middle" fill="#b0bec5" fontSize="24" fontWeight="600" fontFamily="sans-serif">변수</text>
              <text x="-180" y="55" textAnchor="middle" fill="#64748b" fontSize="26" fontWeight="600" fontFamily="sans-serif">법률</text>
              <text x="140" y="70" textAnchor="middle" fill="#94a3b8" fontSize="22" fontWeight="600" fontFamily="sans-serif">모형</text>
              <text x="-140" y="-50" textAnchor="middle" fill="#a0aec0" fontSize="22" fontWeight="600" fontFamily="sans-serif">제도</text>
              <text x="80" y="-55" textAnchor="middle" fill="#78909c" fontSize="20" fontWeight="600" fontFamily="sans-serif">키워드</text>
              <text x="-50" y="90" textAnchor="middle" fill="#90a4ae" fontSize="20" fontWeight="600" fontFamily="sans-serif">네트워크</text>
              <text x="230" y="55" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="600" fontFamily="sans-serif">토픽</text>
              <text x="-200" y="25" textAnchor="middle" fill="#b0bec5" fontSize="18" fontWeight="600" fontFamily="sans-serif">빈도</text>
              <text x="50" y="90" textAnchor="middle" fill="#78909c" fontSize="16" fontWeight="500" fontFamily="sans-serif">감성</text>
              <text x="-100" y="85" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="500" fontFamily="sans-serif">판결문</text>
              <text x="170" y="-50" textAnchor="middle" fill="#a0aec0" fontSize="16" fontWeight="500" fontFamily="sans-serif">회귀</text>
              <text x="-220" y="-5" textAnchor="middle" fill="#64748b" fontSize="15" fontWeight="500" fontFamily="sans-serif">생존</text>
              <text x="260" y="30" textAnchor="middle" fill="#90a4ae" fontSize="14" fontWeight="500" fontFamily="sans-serif">매칭</text>
              <text x="-80" y="-65" textAnchor="middle" fill="#78909c" fontSize="14" fontWeight="500" fontFamily="sans-serif">패널</text>
              <text x="100" y="100" textAnchor="middle" fill="#b0bec5" fontSize="14" fontWeight="500" fontFamily="sans-serif">인과</text>
              <text x="-160" y="80" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="500" fontFamily="sans-serif">평가</text>
              <text x="240" y="-30" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="500" fontFamily="sans-serif">예측</text>
            </g>

            {/* ===== 2. KEYWORD NETWORK (left, 노드+엣지 밀도 있게) ===== */}
            <g opacity="0.16">
              {/* Edges — dense connections */}
              {[[160,300,260,250],[160,300,100,360],[160,300,220,370],[160,300,80,250],[160,300,200,200],[160,300,120,240],[260,250,340,290],[260,250,300,200],[260,250,220,370],[260,250,200,200],[260,250,340,200],[100,360,60,420],[100,360,160,420],[100,360,50,300],[100,360,140,440],[80,250,40,200],[80,250,160,300],[80,250,50,300],[80,250,120,240],[340,290,380,240],[340,290,300,360],[340,290,400,340],[340,290,340,200],[300,200,380,240],[300,200,240,160],[300,200,200,200],[300,200,340,200],[220,370,300,360],[220,370,160,420],[220,370,280,420],[60,420,120,460],[60,420,50,300],[160,420,120,460],[160,420,140,440],[160,420,280,420],[380,240,420,300],[380,240,400,340],[380,240,450,260],[300,360,380,340],[300,360,280,420],[300,360,400,340],[240,160,300,200],[240,160,160,300],[240,160,340,200],[40,200,80,250],[40,200,50,300],[420,300,380,340],[420,300,450,260],[420,300,400,340],[200,200,120,240],[200,200,240,160],[340,200,380,240],[50,300,100,360],[450,260,420,300],[140,440,120,460],[280,420,300,360]].map(([x1,y1,x2,y2],i)=>(<line key={`kne${i}`} x1={Number(x1)} y1={Number(y1)} x2={Number(x2)} y2={Number(y2)} stroke="#64748b" strokeWidth={1.2-(i%4)*0.2} opacity={0.2+((55-i)%5)*0.03}/>))}
              {/* Nodes — more, with size variation */}
              {[[160,300,16],[260,250,13],[100,360,11],[220,370,10],[80,250,9],[340,290,12],[300,200,10],[380,240,8],[60,420,7],[160,420,8],[300,360,9],[240,160,7],[40,200,6],[120,460,6],[420,300,7],[380,340,6],[200,200,8],[120,240,6],[50,300,5],[340,200,7],[400,340,6],[450,260,5],[140,440,5],[280,420,6]].map(([cx,cy,r],i)=>(<circle key={`knn${i}`} cx={Number(cx)} cy={Number(cy)} r={Number(r)} fill="#78909c" opacity={0.35+Number(r)/35}/>))}
              {/* Labels */}
              {[[160,304,"정책",11],[260,254,"제도",10],[100,364,"법률",9],[220,374,"사회",8],[80,254,"의료",7],[340,294,"교육",10],[300,204,"경제",8],[380,244,"환경",7],[60,424,"복지",6],[160,424,"안전",6],[300,364,"인식",7],[240,164,"변화",6],[200,204,"개선",7],[120,244,"지원",6],[340,204,"성과",6],[400,344,"참여",5],[450,264,"혁신",5],[280,424,"권리",5]].map(([x,y,t,s],i)=>(<text key={`knl${i}`} x={Number(x)} y={Number(y)} textAnchor="middle" fill="#94a3b8" fontSize={Number(s)} fontWeight="600" opacity="0.55">{t}</text>))}
            </g>

            {/* ===== 3. KAPLAN-MEIER SURVIVAL CURVE (bottom left, with axes) ===== */}
            <g opacity="0.14">
              {/* Axes */}
              <line x1="80" y1="480" x2="80" y2="650" stroke="#64748b" strokeWidth="1" />
              <line x1="80" y1="650" x2="400" y2="650" stroke="#64748b" strokeWidth="1" />
              {/* Tick marks */}
              {[0,1,2,3,4].map(i=>(<g key={`yt${i}`}><line x1="75" y1={490+i*40} x2="80" y2={490+i*40} stroke="#64748b" strokeWidth="0.8"/><text x="70" y={493+i*40} textAnchor="end" fill="#64748b" fontSize="7">{(1-i*0.25).toFixed(1)}</text></g>))}
              {[0,1,2,3,4,5,6].map(i=>(<g key={`xt${i}`}><line x1={80+i*50} y1="650" x2={80+i*50} y2="655" stroke="#64748b" strokeWidth="0.8"/><text x={80+i*50} y="665" textAnchor="middle" fill="#64748b" fontSize="7">{i*10}</text></g>))}
              {/* Curve 1 (treatment) */}
              <path d="M80,490 L120,490 L120,510 L160,510 L160,530 L195,530 L195,555 L230,555 L230,575 L270,575 L270,595 L310,595 L310,615 L350,615 L350,630 L390,630" stroke="#94a3b8" strokeWidth="2" fill="none" />
              {/* Curve 2 (control, dashed) */}
              <path d="M80,490 L110,490 L110,520 L140,520 L140,550 L175,550 L175,580 L210,580 L210,605 L250,605 L250,625 L290,625 L290,640 L340,640" stroke="#64748b" strokeWidth="1.5" fill="none" strokeDasharray="5,3" />
              {/* Censored marks */}
              {[[135,510],[185,530],[250,555],[280,575],[155,550],[225,580],[265,605]].map(([x,y],i)=>(<text key={`cm${i}`} x={Number(x)} y={Number(y)} fill="#78909c" fontSize="10" textAnchor="middle">+</text>))}
              {/* Axis labels */}
              <text x="230" y="680" textAnchor="middle" fill="#64748b" fontSize="8">Time (months)</text>
              <text x="55" y="575" textAnchor="middle" fill="#64748b" fontSize="8" transform="rotate(-90,55,575)">Survival</text>
            </g>

            {/* ===== 4. AMOS-style SEM / 조절된 매개효과 (center bottom) ===== */}
            <g opacity="0.16" transform="translate(750, 430)">
              <defs>
                <marker id="amosArr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><path d="M0,0 L10,3.5 L0,7 Z" fill="#94a3b8" /></marker>
                <marker id="amosArrD" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><path d="M0,0 L10,3.5 L0,7 Z" fill="#64748b" /></marker>
              </defs>

              {/* Latent variables (ellipses) — AMOS style */}
              <ellipse cx="0" cy="50" rx="55" ry="28" fill="none" stroke="#90a4ae" strokeWidth="1.5" />
              <text x="0" y="47" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700">직무스트레스</text>
              <text x="0" y="60" textAnchor="middle" fill="#78909c" fontSize="8">(X)</text>

              <ellipse cx="240" cy="-30" rx="50" ry="28" fill="none" stroke="#90a4ae" strokeWidth="1.5" />
              <text x="240" y="-33" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700">직무소진</text>
              <text x="240" y="-20" textAnchor="middle" fill="#78909c" fontSize="8">(M)</text>

              <ellipse cx="480" cy="50" rx="55" ry="28" fill="none" stroke="#90a4ae" strokeWidth="1.5" />
              <text x="480" y="47" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700">이직의도</text>
              <text x="480" y="60" textAnchor="middle" fill="#78909c" fontSize="8">(Y)</text>

              {/* Moderator (rectangle — observed variable, AMOS style) */}
              <rect x="195" y="95" width="90" height="35" rx="0" fill="none" stroke="#78909c" strokeWidth="1.2" />
              <text x="240" y="112" textAnchor="middle" fill="#90a4ae" fontSize="10" fontWeight="700">사회적지지</text>
              <text x="240" y="124" textAnchor="middle" fill="#64748b" fontSize="8">(W)</text>

              {/* Error terms (small circles) — AMOS style */}
              <circle cx="240" cy="-75" r="12" fill="none" stroke="#64748b" strokeWidth="0.8" />
              <text x="240" y="-72" textAnchor="middle" fill="#64748b" fontSize="8">e1</text>
              <circle cx="480" cy="-5" r="12" fill="none" stroke="#64748b" strokeWidth="0.8" />
              <text x="480" y="-2" textAnchor="middle" fill="#64748b" fontSize="8">e2</text>

              {/* Error arrows */}
              <line x1="240" y1="-63" x2="240" y2="-58" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#amosArrD)" />
              <line x1="480" y1="7" x2="480" y2="22" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#amosArrD)" />

              {/* Path arrows — AMOS style single-headed */}
              {/* X → M */}
              <line x1="48" y1="35" x2="195" y2="-15" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#amosArr)" />
              <text x="105" y="2" fill="#b0bec5" fontSize="9" fontWeight="600">.45***</text>

              {/* M → Y */}
              <line x1="285" y1="-15" x2="430" y2="35" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#amosArr)" />
              <text x="370" y="2" fill="#b0bec5" fontSize="9" fontWeight="600">.38**</text>

              {/* X → Y (direct effect, thinner) */}
              <line x1="55" y1="55" x2="425" y2="55" stroke="#78909c" strokeWidth="1" markerEnd="url(#amosArr)" />
              <text x="240" y="70" textAnchor="middle" fill="#78909c" fontSize="8">.12 (n.s.)</text>

              {/* W moderating X→M path (interaction arrow to path midpoint) */}
              <line x1="240" y1="95" x2="130" y2="18" stroke="#64748b" strokeWidth="1" strokeDasharray="4,2" />
              <circle cx="130" cy="18" r="3" fill="none" stroke="#64748b" strokeWidth="1" />

              {/* Observed indicators (small rectangles hanging from latent) */}
              {[-30,-10,10,30].map((offset,i)=>(<g key={`xi${i}`}><rect x={offset-15} y="85" width="24" height="14" fill="none" stroke="#64748b" strokeWidth="0.7" rx="0"/><text x={offset-3} y="95" textAnchor="middle" fill="#64748b" fontSize="6">{`x${i+1}`}</text><line x1={offset-3} y1="78" x2={offset-3} y2="85" stroke="#64748b" strokeWidth="0.6" markerEnd="url(#amosArrD)"/></g>))}
              {[-20,0,20].map((offset,i)=>(<g key={`yi${i}`}><rect x={460+offset-12} y="85" width="24" height="14" fill="none" stroke="#64748b" strokeWidth="0.7" rx="0"/><text x={460+offset} y="95" textAnchor="middle" fill="#64748b" fontSize="6">{`y${i+1}`}</text><line x1={460+offset} y1="78" x2={460+offset} y2="85" stroke="#64748b" strokeWidth="0.6" markerEnd="url(#amosArrD)"/></g>))}
              {[-15,5,25].map((offset,i)=>(<g key={`mi${i}`}><rect x={225+offset-12} y="-105" width="24" height="14" fill="none" stroke="#64748b" strokeWidth="0.7" rx="0"/><text x={225+offset} y="-95" textAnchor="middle" fill="#64748b" fontSize="6">{`m${i+1}`}</text><line x1={225+offset} y1="-88" x2={225+offset} y2="-58" stroke="#64748b" strokeWidth="0.6"/></g>))}
            </g>

          </svg>

          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal-500/[0.07] rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-600/[0.05] rounded-full blur-[100px] translate-y-1/3" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[80px]" />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-medium text-teal-300">연구 지원 전문 플랫폼</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight animate-fade-in">
              연구의 시작부터
              <br />
              <span className="text-teal-400">완성까지</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
              연구설계부터 자료 수집, 통계분석까지.
              <br className="hidden sm:block" />
              전문가가 직접 수행하는 연구 지원 서비스.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {user ? (
                <a href="#my-research" className="px-8 py-4 bg-teal-600 text-white rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/30">
                  내 연구현황 보기
                </a>
              ) : (
                <Link href="/login" className="px-8 py-4 bg-teal-600 text-white rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/30">
                  무료로 시작하기
                </Link>
              )}
              <a href="#services" className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl text-lg font-semibold hover:bg-white/5 hover:border-slate-500 transition-all">
                서비스 둘러보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 연구현황 (My Research) - only when logged in */}
      {user && (
        <section id="my-research" className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">연구현황</h2>
                <p className="text-sm sm:text-base text-gray-500 mt-1">{user.email}님의 의뢰 현황</p>
              </div>
            </div>

            {/* Stats cards */}
            {!statsLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">{totalStats.total}</div>
                  <div className="text-sm text-gray-500 mt-1">전체 의뢰</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-400">{totalStats.pending}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400" />접수</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">{totalStats.in_progress}</div>
                  <div className="text-sm text-blue-600 mt-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />진행중</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-600">{totalStats.completed}</div>
                  <div className="text-sm text-emerald-600 mt-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />완료</div>
                </div>
              </div>
            )}

            {/* My Projects */}
            {projects.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">내 프로젝트</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {projects.slice(0, 5).map((project) => {
                    const pct = project.caseCount > 0 ? ((project.codedCount / project.caseCount) * 100).toFixed(1) : "0.0";
                    return (
                      <Link key={project.id} href={`/project/${project.id}`} className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors truncate">{project.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{project.caseCount}건 중 {project.codedCount}건 완료 &middot; {project.createdAt.slice(0, 10)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-sm font-bold text-gray-900 hidden sm:block">{pct}%</span>
                          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: `${project.caseCount > 0 ? (project.codedCount / project.caseCount) * 100 : 0}%` }} />
                          </div>
                          <svg className="w-4 h-4 text-gray-300 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Services Section */}
      {sections.services && (
        <section id="services" className="py-16 sm:py-28 px-4 sm:px-6 bg-gray-50/80">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Services</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
                핵심 서비스
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
                연구의 모든 단계를 전문가가 직접 수행합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <MainServiceCard
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                title="연구설계" description="연구 주제 선정, 연구 방향 설계, 통계분석 설계까지."
                features={["연구 주제 및 방향 설계", "통계분석 설계", "변수 및 모형 설정"]}
                href="/data-generation" color="emerald"
              />
              <MainServiceCard
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                title="자료 생성 & 수집" description="설문조사, 판결문, 뉴스/언론 보도 수집 및 정리."
                features={["설문조사 설계 및 수집", "판결문 수집 및 코딩", "뉴스/언론 보도 수집"]}
                href="/survey-request" color="blue"
              />
              <MainServiceCard
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
                title="통계분석" description="기초통계부터 계량분석, 텍스트 분석, 질적분석까지."
                features={["데이터 전처리 및 변환", "계량분석 및 텍스트 분석", "결과 해석 및 보고서"]}
                href="/quant-analysis" color="violet"
              />
            </div>
          </div>
        </section>
      )}

      {/* Why PRIMER */}
      {sections.value_proposition && (
        <section id="why-primer" className="py-16 sm:py-28 px-4 sm:px-6 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-teal-400 tracking-wide uppercase">Why PRIMER</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">왜 PRIMER인가요?</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">합리적인 가격, 검증된 품질, 끝까지 책임지는 서비스</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ValueCard icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="합리적인 가격" description="불필요한 중간 과정 없이, 합리적인 비용으로 제공합니다." color="emerald" />
              <ValueCard icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} title="검증된 품질" description="전문가가 직접 분석하며, 구체적인 해석을 함께 제공합니다." color="blue" />
              <ValueCard icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} title="수정/보완 보장" description="만족하실 때까지 수정과 보완을 진행합니다." color="violet" />
              <ValueCard icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} title="1:1 맞춤 소통" description="담당자와 직접 소통합니다." color="amber" />
              <ValueCard icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} title="데이터 보안" description="모든 자료는 암호화 저장, 요청 시 즉시 삭제." color="rose" />
              <ValueCard icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title="빠른 처리" description="체계적인 프로세스로 신속하게 결과를 제공합니다." color="cyan" />
            </div>
          </div>
        </section>
      )}

      {/* How it Works + CTA (combined, with background image) */}
      {(sections.how_it_works || sections.contact) && (
        <section id="how-it-works" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image src="/images/scott-graham-5fNmWej4tAA-unsplash.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-white/90" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* 4 Steps */}
            {sections.how_it_works && (
              <div className="mb-20">
                <div className="text-center mb-14">
                  <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Process</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">간단한 4단계</h2>
                  <p className="text-lg text-gray-500">복잡한 절차 없이, 빠르게 시작하세요</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StepCard step={1} title="회원가입" description="간편 가입 후 바로 시작하세요" />
                  <StepCard step={2} title="서비스 선택" description="필요한 연구 지원 서비스를 선택합니다" />
                  <StepCard step={3} title="업로드 & 요청" description="연구 자료와 요구사항을 전달합니다" />
                  <StepCard step={4} title="결과 확인" description="전문가가 수행한 분석 결과를 받아보세요" />
                </div>
              </div>
            )}

            {/* CTA */}
            {sections.contact && (
              <div id="contact" className="text-center pt-10 border-t border-gray-200">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">연구의 새로운 시작</h2>
                <p className="text-lg text-gray-500 mb-10">PRIMER와 함께 효율적인 연구를 시작하세요</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href={user ? "#services" : "/login"} className="px-10 py-4 bg-teal-600 text-white rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg">
                    {user ? "서비스 이용하기" : "무료로 시작하기"}
                  </Link>
                  <Link href="/contact" className="px-10 py-4 border border-gray-300 text-gray-600 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all">
                    문의하기
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0b1120] text-slate-500 py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="mb-2">
                <Image src="/logo-primer.png" alt="PRIMER" width={160} height={30} className="h-7 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm text-slate-500">연구자를 위한 전문 연구 지원 플랫폼</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a href="#services" className="hover:text-slate-300 transition-colors">서비스</a>
              <Link href="/samples" className="hover:text-slate-300 transition-colors">결과물 샘플</Link>
              <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">이용약관</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">개인정보처리방침</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-xs text-slate-600">&copy; 2026 PRIMER. All rights reserved.</div>
        </div>
      </footer>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function MainServiceCard({ icon, title, description, features, href, color = "teal" }: { icon: React.ReactNode; title: string; description: string; features: string[]; href: string; color?: string }) {
  const colorMap: Record<string, { bg: string; bgHover: string; text: string; border: string; shadow: string; check: string }> = {
    emerald: { bg: "bg-emerald-50", bgHover: "group-hover:bg-emerald-100", text: "text-emerald-600", border: "hover:border-emerald-200", shadow: "hover:shadow-emerald-50", check: "text-emerald-500" },
    blue: { bg: "bg-blue-50", bgHover: "group-hover:bg-blue-100", text: "text-blue-600", border: "hover:border-blue-200", shadow: "hover:shadow-blue-50", check: "text-blue-500" },
    violet: { bg: "bg-violet-50", bgHover: "group-hover:bg-violet-100", text: "text-violet-600", border: "hover:border-violet-200", shadow: "hover:shadow-violet-50", check: "text-violet-500" },
    teal: { bg: "bg-teal-50", bgHover: "group-hover:bg-teal-100", text: "text-teal-600", border: "hover:border-teal-200", shadow: "hover:shadow-teal-50", check: "text-teal-500" },
  };
  const c = colorMap[color] || colorMap.teal;
  return (
    <Link href={href} className={`group relative bg-white rounded-2xl border border-gray-200 p-8 ${c.border} hover:shadow-lg ${c.shadow} transition-all duration-300 block`}>
      <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-6 ${c.bgHover} transition-colors`}>{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => (<li key={i} className="flex items-center gap-2.5 text-sm text-gray-600"><svg className={`w-4 h-4 ${c.check} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>))}
      </ul>
      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} group-hover:gap-3 transition-all`}>자세히 보기 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
    </Link>
  );
}

function ValueCard({ icon, title, description, color = "teal" }: { icon: React.ReactNode; title: string; description: string; color?: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400" }, blue: { bg: "bg-blue-500/15", text: "text-blue-400" },
    violet: { bg: "bg-violet-500/15", text: "text-violet-400" }, amber: { bg: "bg-amber-500/15", text: "text-amber-400" },
    rose: { bg: "bg-rose-500/15", text: "text-rose-400" }, cyan: { bg: "bg-cyan-500/15", text: "text-cyan-400" },
    teal: { bg: "bg-teal-500/15", text: "text-teal-400" },
  };
  const c = colorMap[color] || colorMap.teal;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center mb-4`}>{icon}</div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="relative text-center">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-5"><span className="text-xl font-bold">{step}</span></div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
