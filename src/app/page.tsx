import Link from "next/link";

const mockProjects = [
  { id: "1", name: "2024년 IPV 판결문 연구", totalCases: 407, codedCases: 330, lastActivity: "2026-04-05" },
  { id: "2", name: "2023년 스토킹 판결문", totalCases: 120, codedCases: 45, lastActivity: "2026-04-03" },
];

export default function DashboardPage() {
  const totalProjects = mockProjects.length;
  const totalCases = mockProjects.reduce((sum, p) => sum + p.totalCases, 0);
  const totalCoded = mockProjects.reduce((sum, p) => sum + p.codedCases, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground text-sm mt-1">IPV 판결문 코딩 프로젝트 관리</p>
        </div>
        <Link
          href="/project/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트 만들기
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="총 프로젝트 수" value={totalProjects} icon="folder" />
        <StatCard label="총 사건 수" value={totalCases} icon="document" />
        <StatCard label="코딩 완료 수" value={totalCoded} icon="check" />
        <StatCard
          label="완료율"
          value={`${((totalCoded / totalCases) * 100).toFixed(1)}%`}
          icon="chart"
        />
      </div>

      {/* Projects list */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">프로젝트 목록</h2>
        </div>
        <div className="divide-y divide-border">
          {mockProjects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {project.totalCases}건 중 {project.codedCases}건 완료
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {((project.codedCases / project.totalCases) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    최근 활동: {project.lastActivity}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(project.codedCases / project.totalCases) * 100}%`,
                    }}
                  />
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">최근 활동</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { text: "2024년 IPV 판결문 연구 - 순번 330 코딩 완료", time: "1시간 전" },
            { text: "2024년 IPV 판결문 연구 - 순번 329 코딩 완료", time: "2시간 전" },
            { text: "2023년 스토킹 판결문 - 전문 15건 확보", time: "3시간 전" },
            { text: "2024년 IPV 판결문 연구 - GBTM 분석 실행", time: "1일 전" },
          ].map((activity, i) => (
            <div key={i} className="px-6 py-3 flex items-center justify-between">
              <span className="text-sm">{activity.text}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
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
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-3 text-muted-foreground mb-3">
        {icons[icon]}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
