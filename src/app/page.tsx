"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/main.png" alt="ResearchOn" width={28} height={28} className="rounded-lg sm:w-8 sm:h-8" />
            <span className={`text-lg sm:text-xl font-bold tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
              ResearchOn
            </span>
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-gray-600" : "text-white/90"}`}>
            <a href="#services" className="hover:opacity-70 transition-opacity">서비스</a>
            <a href="#how-it-works" className="hover:opacity-70 transition-opacity">이용절차</a>
            <a href="#contact" className="hover:opacity-70 transition-opacity">문의</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className={`hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}>
              로그인
            </button>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors bg-[#c49a2e] text-white hover:bg-[#d4a843]"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-5 sm:px-6 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6">
            연구를 위한
            <br />
            올인원 플랫폼
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-10 leading-relaxed">
            판결문 코딩, 통계분석, 설문조사, 텍스트 분석까지
            <br />
            하나의 플랫폼에서 해결하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#c49a2e] text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-[#d4a843] transition-colors shadow-lg text-center"
            >
              무료로 시작하기
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors text-center"
            >
              서비스 둘러보기
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">제공 서비스</h2>
            <div className="w-12 sm:w-16 h-1 bg-[#c49a2e] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            <ServiceCard
              image="/images/landing-연구설계.png"
              title="연구 설계 지원"
              description="연구 주제 설계부터 통계분석 설계까지"
              href="/data-generation"
            />
            <ServiceCard
              image="/images/landing-설문조사.png"
              title="설문조사"
              description="설문 설계부터 데이터 수집까지 원스톱 서비스"
              href="/survey-request"
            />
            <ServiceCard
              image="/images/landing-판결문.png"
              title="판결문 분석"
              description="AI 기반 판결문 코딩 및 수집으로 연구 시간 절약"
              href="/judgment"
            />
            <ServiceCard
              image="/images/landing-기사검색.png"
              title="뉴스/언론 보도"
              description="키워드 기반 뉴스 수집 및 분석"
              href="/news-search"
            />
            <ServiceCard
              image="/images/landing-계량통계.png"
              title="계량분석"
              description="기초통계부터 고급 계량분석까지, 전문가가 직접 분석"
              href="/quant-analysis"
            />
            <ServiceCard
              image="/images/landing-텍스트분석.png"
              title="텍스트 분석"
              description="토픽모델링, 감성분석, 워드클라우드 등 텍스트 분석"
              href="/text-analysis"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-12 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">이용 절차</h2>
            <div className="w-12 sm:w-16 h-1 bg-[#c49a2e] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6">
              <StepCard step={1} title="회원가입" description="간편 가입 후 바로 시작" />
              <StepCard step={2} title="서비스 선택" description="필요한 분석/코딩 서비스 선택" />
              <StepCard step={3} title="자료 업로드" description="판결문, 설문지, 데이터 업로드" />
              <StepCard step={4} title="결과 확인" description="분석 결과 및 보고서 완성" />
            </div>
            <div className="relative h-48 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/dylan-gillis-KdeqA3aTnBY-unsplash.jpg"
                alt="이용 절차"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="contact" className="py-12 sm:py-24 px-4 sm:px-6 bg-[#0f1a2e] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">연구의 새로운 시작</h2>
          <p className="text-sm sm:text-lg text-white/70 mb-6 sm:mb-10">
            ResearchOn과 함께 효율적인 연구를 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button className="shrink-0 px-6 py-3 bg-[#c49a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#d4a843] transition-colors">
              문의하기
            </button>
          </div>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 bg-[#c49a2e] text-white rounded-xl text-base font-semibold hover:bg-[#d4a843] transition-colors shadow-lg"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white/60 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">ResearchOn</h3>
            <p className="text-sm">연구자를 위한 올인원 연구 지원 플랫폼</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-white transition-colors">서비스</a>
            <span className="hover:text-white transition-colors cursor-pointer">이용약관</span>
            <span className="hover:text-white transition-colors cursor-pointer">개인정보처리방침</span>
          </div>
          <p className="text-xs text-white/40">&copy; 2026 ResearchOn. All rights reserved.</p>
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

function ServiceCard({
  image,
  title,
  description,
  href,
}: {
  image: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow overflow-hidden block">
      <div className="relative h-32 sm:h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-3 sm:p-6">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{title}</h3>
        <p className="text-[11px] sm:text-sm text-gray-500 leading-relaxed mb-2 sm:mb-4 line-clamp-2">{description}</p>
        <span className="hidden sm:inline text-sm font-medium text-[#c49a2e] group-hover:underline">
          자세히 보기 &rarr;
        </span>
      </div>
    </Link>
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
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center flex flex-col items-center">
      <div className="text-3xl sm:text-5xl font-extrabold text-[#c49a2e] mb-2 sm:mb-4 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
        {step}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500">{description}</p>
    </div>
  );
}
