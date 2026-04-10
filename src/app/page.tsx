"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>({
    services: true,
    value_proposition: true,
    how_it_works: true,
    contact: true,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((d) => { if (d.settings) setSections(d.settings); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
          <Link href="/" className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${scrolled ? "bg-teal-600" : "bg-white/15 backdrop-blur-sm"}`}>
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
              PRIMER
            </span>
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-gray-600" : "text-white/80"}`}>
            <a href="#services" className="hover:text-teal-500 transition-colors">서비스</a>
            <a href="#why-primer" className="hover:text-teal-500 transition-colors">왜 PRIMER?</a>
            <a href="#how-it-works" className="hover:text-teal-500 transition-colors">이용절차</a>
            <Link href="/samples" className="hover:text-teal-500 transition-colors">결과물 샘플</Link>
            <a href="#contact" className="hover:text-teal-500 transition-colors">문의</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={`hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"}`}>
              로그인
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0f172a]">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-teal-900/40" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-medium text-teal-300">연구 지원 전문 플랫폼</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight animate-fade-in">
              연구의 시작부터
              <br />
              <span className="text-teal-400">완성까지</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
              연구설계부터 자료 수집, 통계분석까지.
              <br className="hidden sm:block" />
              전문가가 직접 수행하는 연구 지원 서비스를 경험하세요.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/30"
              >
                무료로 시작하기
              </Link>
              <a
                href="#services"
                className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl text-base font-semibold hover:bg-white/5 hover:border-slate-500 transition-all"
              >
                서비스 둘러보기
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-20 pt-10 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <StatItem number="500+" label="완료된 프로젝트" />
              <StatItem number="98%" label="고객 만족도" />
              <StatItem number="50+" label="전문 분석가" />
              <StatItem number="24h" label="평균 응답 시간" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section - 3 main services */}
      {sections.services && (
        <section id="services" className="py-20 sm:py-32 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-16">
              <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Services</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                핵심 서비스
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                연구의 모든 단계를 전문가가 직접 수행합니다.
                필요한 서비스를 선택하고, 결과물을 받아보세요.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <MainServiceCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                title="연구설계"
                description="연구 주제 선정, 연구 방향 설계, 통계분석 설계까지. 체계적인 연구의 첫 단추를 채워드립니다."
                features={["연구 주제 및 방향 설계", "통계분석 설계", "변수 및 모형 설정"]}
                href="/data-generation"
              />
              <MainServiceCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                }
                title="자료 생성 & 수집"
                description="설문조사, 판결문, 뉴스/언론 보도까지. 연구에 필요한 데이터를 수집하고 정리합니다."
                features={["설문조사 설계 및 수집", "판결문 수집 및 코딩", "뉴스/언론 보도 수집"]}
                href="/survey-request"
              />
              <MainServiceCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                }
                title="통계분석"
                description="기초통계부터 계량분석, 텍스트 분석, 질적분석까지. 전문가가 직접 분석하고 해석합니다."
                features={["데이터 전처리 및 변환", "계량분석 및 텍스트 분석", "결과 해석 및 보고서"]}
                href="/quant-analysis"
              />
            </div>
          </div>
        </section>
      )}

      {/* Why PRIMER */}
      {sections.value_proposition && (
        <section id="why-primer" className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Why PRIMER</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                왜 PRIMER인가요?
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                합리적인 가격, 검증된 품질, 끝까지 책임지는 서비스
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ValueCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="합리적인 가격"
                description="불필요한 중간 과정 없이, 연구에 꼭 필요한 서비스를 합리적인 비용으로 제공합니다."
              />
              <ValueCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                title="검증된 품질"
                description="각 분야 전문가가 직접 분석하며, 모든 결과물에 구체적인 해석과 설명을 함께 제공합니다."
              />
              <ValueCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
                title="수정/보완 보장"
                description="결과물 납품 후에도 요청에 따라 수정과 보완을 진행합니다. 만족하실 때까지 책임집니다."
              />
              <ValueCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title="1:1 맞춤 소통"
                description="의뢰 접수부터 완료까지 담당자와 직접 소통합니다. 궁금한 점은 언제든 물어보세요."
              />
              <ValueCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                title="데이터 보안"
                description="모든 자료는 암호화 저장되며, 작업 완료 후 요청 시 즉시 삭제합니다."
              />
              <ValueCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="빠른 처리"
                description="체계적인 프로세스로 신속하게 결과를 제공합니다. 급한 일정도 최대한 맞춰드립니다."
              />
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      {sections.how_it_works && (
        <section id="how-it-works" className="py-20 sm:py-32 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Process</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                간단한 4단계
              </h2>
              <p className="text-lg text-gray-500">
                복잡한 절차 없이, 빠르게 시작하세요
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard step={1} title="회원가입" description="간편 가입 후 바로 시작하세요" />
              <StepCard step={2} title="서비스 선택" description="필요한 연구 지원 서비스를 선택합니다" />
              <StepCard step={3} title="자료 업로드" description="연구 자료와 요구사항을 전달합니다" />
              <StepCard step={4} title="결과 확인" description="전문가가 수행한 분석 결과를 받아보세요" />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {sections.contact && (
        <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6 bg-[#0f172a]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              연구의 새로운 시작
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              PRIMER와 함께 효율적인 연구를 시작하세요
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-10 py-4 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/30"
              >
                무료로 시작하기
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 border border-slate-600 text-slate-300 rounded-xl text-base font-semibold hover:bg-white/5 transition-all"
              >
                문의하기
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0b1120] text-slate-500 py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="text-base font-bold text-white">PRIMER</span>
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
          <div className="mt-8 pt-8 border-t border-white/5 text-xs text-slate-600">
            &copy; 2026 PRIMER. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CSS animations */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{number}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function MainServiceCard({
  icon,
  title,
  description,
  features,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-50 transition-all duration-300 block"
    >
      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
            <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 group-hover:gap-3 transition-all">
        자세히 보기
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </Link>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-teal-100 hover:shadow-md transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-5">
        <span className="text-xl font-bold">{step}</span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
