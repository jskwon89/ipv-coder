/**
 * 도메인 기반 사이트 모드 판별.
 * - primer*.vercel.app → PRIMER (대학원 무료 지원)
 * - researchon* → ResearchOn (상업용 전문 기관)
 */

export type SiteMode = 'primer' | 'researchon';

export function getSiteMode(): SiteMode {
  if (typeof window === 'undefined') return 'primer';
  const host = window.location.hostname;
  if (host.includes('researchon')) return 'researchon';
  return 'primer'; // 기본값 — PRIMER 우선 운영
}

interface ServiceItem {
  key: string;
  title: string;
  description: string;
  href: string;
  image: string;
  /** PRIMER에서 이 서비스가 고급(ResearchOn 연동)인지 */
  advanced?: boolean;
}

export const allServices: ServiceItem[] = [
  { key: 'research-design', title: '연구 설계 상담', description: '연구 주제 설계부터 방법론 안내까지', href: '/data-generation', image: '/images/landing-연구설계.png' },
  { key: 'stats-design', title: '통계분석 설계', description: '분석 방법 선정 및 설계 지원', href: '/stats-design', image: '/images/landing-계량통계.png' },
  { key: 'survey', title: '설문조사', description: '설문 설계부터 데이터 수집까지', href: '/survey-request', image: '/images/landing-설문조사.png' },
  { key: 'judgment', title: '판결문 분석', description: '판결문 수집부터 변수 코딩까지', href: '/judgment', image: '/images/landing-판결문.png', advanced: true },
  { key: 'news', title: '뉴스/언론 보도', description: '키워드 기반 뉴스 수집 및 분석', href: '/news-search', image: '/images/landing-기사검색.png' },
  { key: 'quant', title: '계량분석', description: '기초통계부터 고급 계량분석까지', href: '/quant-analysis', image: '/images/landing-계량통계.png', advanced: true },
  { key: 'text', title: '텍스트 분석', description: '토픽모델링, 감성분석, 워드클라우드', href: '/text-analysis', image: '/images/landing-텍스트분석.png', advanced: true },
  { key: 'qual', title: '질적분석', description: '인터뷰, 주제분석, 근거이론 등', href: '/qual-analysis', image: '/images/landing-텍스트분석.png', advanced: true },
  { key: 'data-transform', title: '데이터 전처리', description: '리코딩, 결측치 처리, 병합 등', href: '/data-transform', image: '/images/landing-계량통계.png' },
];

/** PRIMER에서 직접 제공하는 서비스 */
export const primerServices = allServices.filter(s => !s.advanced);
/** PRIMER에서 ResearchOn으로 연동하는 고급 서비스 */
export const primerAdvancedServices = allServices.filter(s => s.advanced);
/** ResearchOn 전체 서비스 */
export const researchonServices = allServices;

export function getServices(mode: SiteMode) {
  return mode === 'primer' ? primerServices : researchonServices;
}

export function getAdvancedServices(mode: SiteMode) {
  return mode === 'primer' ? primerAdvancedServices : [];
}

export type SiteConfig = typeof siteConfig[SiteMode];

export const siteConfig = {
  primer: {
    name: 'PRIMER',
    subtitle: '아산학파 연구지원',
    heroTitle: '연구의 첫 걸음,\n함께 시작합니다',
    heroDesc: '연구설계, 자료수집방법, 통계방법, 논문작성 시 주의사항까지\nPRIMER가 여러분과 함께합니다',
    ctaText: '지원 요청하기',
    requestLabel: '지원 요청',
    requestVerb: '요청',
    resultLabel: '최종의견 제시',
    partnerName: 'ResearchOn',
    partnerUrl: 'https://researchon.vercel.app',
  },
  researchon: {
    name: 'ResearchOn',
    subtitle: '전문 연구지원 기관',
    heroTitle: '연구의 시작부터\n완성까지, 한 곳에서',
    heroDesc: '연구설계, 자료 생성, 데이터 변환, 통계분석, 문서 작성까지\n하나의 플랫폼에서 쉽고 정확하게 진행하세요',
    ctaText: '무료로 시작하기',
    requestLabel: '의뢰',
    requestVerb: '의뢰',
    resultLabel: '보고서 완성',
    partnerName: 'PRIMER',
    partnerUrl: 'https://primer.vercel.app',
  },
} as const;

export function getConfig() {
  return siteConfig[getSiteMode()];
}
