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
      const serviceApis = [
        "/api/research-design", "/api/stats-design", "/api/survey",
        "/api/judgment-collection", "/api/judgment-coding", "/api/news-collection",
        "/api/data-transform", "/api/quant-analysis", "/api/qual-analysis",
        "/api/text-analysis-request", "/api/consultation", "/api/journal-submission",
        "/api/contest",
      ];
      const [projRes, ...svcResList] = await Promise.all([
        fetch("/api/projects"),
        ...serviceApis.map((api) => fetch(`${api}${emailParam}`)),
      ]);
      const projData = await projRes.json();
      const svcDataList = await Promise.all(svcResList.map((r) => r.json().catch(() => ({}))));
      setProjects(projData.projects || []);

      const allReqs = svcDataList.flatMap((d) => d.requests || []);
      const prjs = projData.projects || [];
      setTotalStats({
        total: allReqs.length,
        pending: allReqs.filter((r: { status?: string }) => r.status === "pending" || r.status === "received").length,
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
      <section className="relative overflow-hidden bg-[#0f172a] min-h-[60vh] sm:min-h-[85vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-teal-900/30" />

          {/* Academic visualization background */}
          <svg className="absolute inset-0 w-full h-full hidden sm:block" viewBox="0 0 1400 800" fill="none" preserveAspectRatio="xMaxYMid slice">
            {/* ===== 1. WORD CLOUD (center-right, large, 논문 워드클라우드 형태) ===== */}
            <g opacity="0.22" transform="translate(980, 240)">
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

            {/* ===== 3. SMOOTH SURVIVAL CURVES (bottom left) ===== */}
            <g opacity="0.14">
              {/* Axes */}
              <line x1="80" y1="480" x2="80" y2="650" stroke="#64748b" strokeWidth="1" />
              <line x1="80" y1="650" x2="400" y2="650" stroke="#64748b" strokeWidth="1" />
              {/* Tick marks */}
              {[0,1,2,3,4].map(i=>(<g key={`yt${i}`}><line x1="75" y1={490+i*40} x2="80" y2={490+i*40} stroke="#64748b" strokeWidth="0.8"/><text x="70" y={493+i*40} textAnchor="end" fill="#64748b" fontSize="7">{(1-i*0.25).toFixed(1)}</text></g>))}
              {[0,1,2,3,4,5,6].map(i=>(<g key={`xt${i}`}><line x1={80+i*50} y1="650" x2={80+i*50} y2="655" stroke="#64748b" strokeWidth="0.8"/><text x={80+i*50} y="665" textAnchor="middle" fill="#64748b" fontSize="7">{i*10}</text></g>))}
              {/* Smooth curve 1 (treatment — gentle S-curve) */}
              <path d="M80,490 C120,492 140,500 160,515 C180,530 200,548 230,565 C260,582 290,600 330,618 C355,628 375,635 395,638" stroke="#94a3b8" strokeWidth="2" fill="none" />
              {/* Confidence band */}
              <path d="M80,487 C120,488 140,494 160,506 C180,518 200,534 230,550 C260,566 290,585 330,605 C355,616 375,624 395,628 L395,648 C375,646 355,640 330,632 C290,616 260,598 230,580 C200,562 180,542 160,524 C140,506 120,496 80,493 Z" fill="#94a3b8" opacity="0.08" />
              {/* Smooth curve 2 (control, dashed) */}
              <path d="M80,490 C110,494 130,510 150,530 C170,550 190,572 220,592 C250,612 280,628 320,638 C345,643 365,646 390,647" stroke="#64748b" strokeWidth="1.5" fill="none" strokeDasharray="5,3" />
              {/* Censored marks */}
              {[[120,495],[170,525],[220,558],[275,590],[145,535],[205,578],[260,610]].map(([x,y],i)=>(<text key={`cm${i}`} x={Number(x)} y={Number(y)} fill="#78909c" fontSize="10" textAnchor="middle">+</text>))}
              {/* Axis labels */}
              <text x="230" y="680" textAnchor="middle" fill="#64748b" fontSize="8">Time (months)</text>
              <text x="55" y="575" textAnchor="middle" fill="#64748b" fontSize="8" transform="rotate(-90,55,575)">Survival Probability</text>
            </g>

            {/* ===== 4. AMOS-style SEM / 조절된 매개효과 (center bottom) ===== */}
            <g opacity="0.16" transform="translate(750, 500)">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight animate-fade-in">
              연구의 설계부터
              <br />
              <span className="text-teal-400">완성까지</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
              자료 수집, 통계분석, 결과 해석까지
              <br className="hidden sm:block" />
              전문가가 직접 수행하는 연구 지원 플랫폼
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
        <section id="my-research" className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">연구현황</h2>
                <p className="text-sm sm:text-base text-gray-500 mt-1">{user.email}님의 의뢰 현황 — 카드 클릭 시 상세 보기</p>
              </div>
              <Link href="/my" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                전체 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Stats cards (clickable) */}
            {!statsLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Link href="/my" className="bg-slate-50 rounded-xl p-5 border border-gray-100 hover:shadow-sm hover:border-gray-200 transition-all group">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">{totalStats.total}</div>
                  <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-700">전체 의뢰</div>
                </Link>
                <Link href="/my?status=pending" className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-sm hover:border-gray-200 transition-all group">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-400">{totalStats.pending}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 group-hover:text-gray-700"><span className="w-2 h-2 rounded-full bg-gray-400" />접수</div>
                </Link>
                <Link href="/my?status=in_progress" className="bg-blue-50 rounded-xl p-5 border border-blue-100 hover:shadow-sm hover:border-blue-200 transition-all group">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">{totalStats.in_progress}</div>
                  <div className="text-sm text-blue-600 mt-1 flex items-center gap-1.5 group-hover:text-blue-700"><span className="w-2 h-2 rounded-full bg-blue-500" />진행중</div>
                </Link>
                <Link href="/my?status=completed" className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 hover:shadow-sm hover:border-emerald-200 transition-all group">
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-600">{totalStats.completed}</div>
                  <div className="text-sm text-emerald-600 mt-1 flex items-center gap-1.5 group-hover:text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500" />완료</div>
                </Link>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 간편 의뢰 절차 — 이미지 배경 + 카드 디자인 */}
      {sections.how_it_works && (
        <section id="how-it-works" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/images/scott-graham-5fNmWej4tAA-unsplash.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-white/95" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Process</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">간편 의뢰 절차</h2>
              <p className="text-lg text-gray-500">복잡한 절차 없이, 빠르게 시작하세요</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              <ProcessCard step={1} title="회원가입" description="간편 가입 후 바로 시작하세요" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />} />
              <ProcessCard step={2} title="서비스 선택" description="필요한 연구 지원 서비스를 선택합니다" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />} />
              <ProcessCard step={3} title="업로드 & 요청" description="연구 자료와 요구사항을 전달합니다" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />} />
              <ProcessCard step={4} title="결과 확인" description="전문가가 수행한 분석 결과를 받아보세요" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {sections.services && (
        <section id="services" className="relative py-16 sm:py-28 px-4 sm:px-6 bg-white">
          <div className="relative z-10 max-w-7xl mx-auto">
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
                number="01"
                image="/images/service-1.webp"
                title="연구설계"
                tagline="연구 주제 설계부터 방법론 안내까지"
                features={["연구 주제 및 방향 설계", "통계분석 설계", "변수 및 모형 설정"]}
                href="/data-generation"
              />
              <MainServiceCard
                number="02"
                image="/images/service-2.webp"
                title="자료 생성 & 수집"
                tagline="설문, 판결문, 뉴스 등 연구 자료 수집"
                features={["설문조사 설계 및 수집", "판결문 수집 및 코딩", "뉴스/언론 보도 수집"]}
                href="/survey-request"
              />
              <MainServiceCard
                number="03"
                image="/images/service-3.webp"
                title="데이터 분석"
                tagline="기초통계부터 통계·텍스트·질적분석까지"
                features={["데이터 전처리 및 변환", "통계분석 및 텍스트 분석", "결과 해석 및 보고서"]}
                href="/quant-analysis"
              />
            </div>
          </div>
        </section>
      )}

      {/* Why PRIMER */}
      {sections.value_proposition && (
        <section id="why-primer" className="relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/images/headway-5QgIuuBxKwM-unsplash.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#0f172a]/93" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto">
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

      {/* CTA + Footer — 통합 */}
      <footer id="contact" className="relative text-white px-4 sm:px-6 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/dylan-gillis-KdeqA3aTnBY-unsplash.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0f172a]/95" />
        </div>
        {/* CTA */}
        <div className="relative z-10 max-w-3xl mx-auto text-center py-20 sm:py-28">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">함께하는 연구의 시작</h2>
          <p className="text-lg text-gray-400 mb-10">PRIMER와 함께 효율적인 연구를 시작하세요</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
            <Link href={user ? "#services" : "/login"} className="px-10 py-4 bg-teal-600 text-white rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg">
              {user ? "서비스 이용하기" : "무료로 시작하기"}
            </Link>
            <Link href="/contact" className="px-10 py-4 border border-white/20 text-white/80 rounded-xl text-lg font-semibold hover:bg-white/5 transition-all">
              문의하기
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 max-w-[1600px] mx-auto pb-12 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white/80">PRIMER</span>
              <span className="text-xs text-white/30">&copy; 2026 PRIMER. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <span className="hover:text-white/70 transition-colors cursor-pointer">이용약관</span>
              <span className="hover:text-white/70 transition-colors cursor-pointer">개인정보처리방침</span>
            </div>
          </div>
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

function MainServiceCard({ number, image, title, tagline, features, href }: { number: string; image: string; title: string; tagline: string; features: string[]; href: string }) {
  return (
    <Link href={href} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-bold text-teal-600 tracking-widest">{number}</span>
        </div>
      </div>
      {/* Body */}
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">{tagline}</p>
        <ul className="space-y-2 mb-6 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {f}
            </li>
          ))}
        </ul>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 group-hover:gap-3 transition-all">
          지원 요청
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </span>
      </div>
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

function ProcessCard({ step, title, description, icon }: { step: number; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md hover:border-teal-100 transition-all group">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
        </div>
        <span className="text-sm font-bold text-teal-600">STEP {step}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
