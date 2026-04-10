/**
 * 도메인 기반 사이트 모드 판별.
 * - primer*.vercel.app → PrimeR (대학원 무료 지원)
 * - 그 외 → ResearchOn (상업용)
 */

export type SiteMode = 'primer' | 'researchon';

export function getSiteMode(): SiteMode {
  if (typeof window === 'undefined') return 'primer'; // SSR 기본값
  const host = window.location.hostname;
  if (host.includes('primer')) return 'primer';
  if (host.includes('researchon')) return 'researchon';
  return 'primer'; // 개발환경(localhost) 기본값 — 현재 PrimeR 우선 운영
}

export type SiteConfig = typeof siteConfig[SiteMode];

export const siteConfig = {
  primer: {
    name: 'PrimeR',
    subtitle: '아산학파 연구지원',
    heroTitle: '연구의 첫 걸음,\n함께 시작합니다',
    heroDesc: '연구설계, 통계분석, 자료수집까지\n아산학파가 여러분의 연구를 지원합니다',
    ctaText: '지원 요청하기',
    requestLabel: '지원 요청',
    requestVerb: '요청',
    resultLabel: '최종의견 제시',
  },
  researchon: {
    name: 'ResearchOn',
    subtitle: '연구 및 데이터 플랫폼',
    heroTitle: '연구의 시작부터\n완성까지, 한 곳에서',
    heroDesc: '연구설계, 자료 생성, 데이터 변환, 통계분석, 문서 작성까지\n하나의 플랫폼에서 쉽고 정확하게 진행하세요',
    ctaText: '무료로 시작하기',
    requestLabel: '의뢰',
    requestVerb: '의뢰',
    resultLabel: '보고서 완성',
  },
} as const;

export function getConfig() {
  return siteConfig[getSiteMode()];
}
