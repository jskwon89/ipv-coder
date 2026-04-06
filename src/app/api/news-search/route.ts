export async function POST(request: Request) {
  const body = await request.json();
  const { query, type, dateFrom, dateTo } = body as {
    query: string;
    type: "keyword" | "sentence";
    dateFrom?: string;
    dateTo?: string;
  };

  // Mock data - will be replaced with Naver News API or web search
  const mockResults = [
    {
      id: "1",
      title: "가정폭력 피해자 보호 강화 법안 국회 통과",
      source: "한겨레",
      date: "2026-03-28",
      summary:
        "가정폭력 피해자에 대한 보호 조치를 강화하는 법안이 국회 본회의를 통과했다. 이번 법안은 접근금지명령 위반 시 처벌을 강화하고, 피해자 지원 예산을 확대하는 내용을 담고 있다.",
      url: "https://example.com/news/1",
    },
    {
      id: "2",
      title: "친밀한 파트너 폭력(IPV) 재범률 분석 연구 발표",
      source: "연합뉴스",
      date: "2026-03-25",
      summary:
        "한국형사정책연구원이 친밀한 파트너 폭력(IPV) 재범률에 관한 대규모 종단 연구 결과를 발표했다. 연구에 따르면 초범 대비 재범자의 폭력 심각도가 유의미하게 증가하는 것으로 나타났다.",
      url: "https://example.com/news/2",
    },
    {
      id: "3",
      title: "데이트 폭력 신고 건수 5년간 40% 증가",
      source: "경향신문",
      date: "2026-03-20",
      summary:
        "경찰청 통계에 따르면 데이트 폭력 관련 신고 건수가 최근 5년간 약 40% 증가한 것으로 나타났다. 전문가들은 인식 변화와 함께 신고 접근성 개선이 주요 원인이라고 분석했다.",
      url: "https://example.com/news/3",
    },
    {
      id: "4",
      title: "스토킹처벌법 시행 3년, 성과와 과제",
      source: "조선일보",
      date: "2026-03-15",
      summary:
        "스토킹처벌법 시행 3주년을 맞아 법 적용 현황과 한계점을 분석한다. 접근금지명령 실효성 문제와 피해자 보호 사각지대 해소가 주요 과제로 지적되었다.",
      url: "https://example.com/news/4",
    },
    {
      id: "5",
      title: "가정폭력 가해자 교정프로그램 효과성 검증 결과",
      source: "SBS 뉴스",
      date: "2026-03-10",
      summary:
        "법무부가 가정폭력 가해자 대상 교정프로그램의 효과성을 검증한 결과를 공개했다. 프로그램 이수자의 재범률이 미이수자 대비 약 25% 낮은 것으로 확인되었다.",
      url: "https://example.com/news/5",
    },
    {
      id: "6",
      title: "여성 긴급전화 1366 상담 건수 역대 최고치",
      source: "MBC 뉴스",
      date: "2026-03-05",
      summary:
        "여성긴급전화 1366의 올해 1분기 상담 건수가 역대 최고치를 기록했다. 가정폭력 관련 상담이 전체의 45%를 차지하며, 디지털 성폭력 관련 상담도 급증한 것으로 나타났다.",
      url: "https://example.com/news/6",
    },
  ];

  // Simple filtering by date if provided
  let filtered = mockResults;
  if (dateFrom) {
    filtered = filtered.filter((r) => r.date >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter((r) => r.date <= dateTo);
  }

  // Simple keyword filtering on mock data
  if (query) {
    const lowerQuery = query.toLowerCase();
    const terms = lowerQuery.split(/\s+(and|or)\s+/i).filter((t) => t !== "and" && t !== "or");
    if (type === "keyword" && terms.length > 0) {
      filtered = filtered.filter((r) => {
        const text = `${r.title} ${r.summary}`.toLowerCase();
        return terms.some((term) => text.includes(term));
      });
    }
  }

  return Response.json({ results: filtered });
}
