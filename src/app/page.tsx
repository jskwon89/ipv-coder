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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className={`text-xl font-bold tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
            DocCoder
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-gray-700" : "text-white/90"}`}>
            <a href="#services" className="hover:opacity-70 transition-opacity">서비스</a>
            <a href="#pricing" className="hover:opacity-70 transition-opacity">가격</a>
            <a href="#how-it-works" className="hover:opacity-70 transition-opacity">이용절차</a>
            <a href="#contact" className="hover:opacity-70 transition-opacity">문의</a>
          </div>
          <div className="flex items-center gap-3">
            <button className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}>
              로그인
            </button>
            <Link
              href="/dashboard"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                scrolled
                  ? "bg-[#1e3a5f] text-white hover:bg-[#162d4a]"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
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
            src="/images/charles-forerunner-3fPXt37X6UQ-unsplash.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            연구를 위한
            <br />
            올인원 플랫폼
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
            판결문 코딩, 통계분석, 설문조사, 텍스트 분석까지
            <br />
            하나의 플랫폼에서 해결하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              무료로 시작하기
            </Link>
            <a
              href="#services"
              className="px-8 py-4 border-2 border-white text-white rounded-xl text-base font-semibold hover:bg-white/10 transition-colors"
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
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">제공 서비스</h2>
            <div className="w-16 h-1 bg-[#1e3a5f] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              image="/images/판결문코딩.jpg"
              title="판결문 코딩"
              description="AI 기반 판결문 자동 코딩으로 연구 시간을 절약하세요"
            />
            <ServiceCard
              image="/images/headway-5QgIuuBxKwM-unsplash.jpg"
              title="계량통계분석"
              description="기초통계부터 고급분석까지, 전문가가 직접 분석합니다"
            />
            <ServiceCard
              image="/images/텍스트분석_2.png"
              imageClassName="scale-125 object-center"
              title="텍스트 분석"
              description="토픽모델링, 감성분석, 워드클라우드 등 텍스트 분석"
            />
            <ServiceCard
              image="/images/설문조사.png"
              title="설문조사"
              description="설문 설계부터 데이터 수집까지 원스톱 서비스"
            />
            <ServiceCard
              image="/images/john-FlPc9_VocJ4-unsplash.jpg"
              title="기사 검색"
              description="키워드 기반 뉴스 검색 및 요약 수집"
            />
            <ServiceCard
              image="/images/mediensturmer-aWf7mjwwJJo-unsplash.jpg"
              title="연구 설계 지원"
              description="검정력 분석, 시뮬레이션 데이터 생성"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">이용 절차</h2>
            <div className="w-16 h-1 bg-[#1e3a5f] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StepCard step={1} title="회원가입" description="무료 가입 후 크레딧 충전" />
              <StepCard step={2} title="서비스 선택" description="필요한 분석/코딩 서비스 선택" />
              <StepCard step={3} title="자료 업로드" description="판결문, 설문지, 데이터 업로드" />
              <StepCard step={4} title="결과 확인" description="분석 결과 및 보고서 완성" />
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">합리적인 가격</h2>
            <p className="text-lg text-gray-500 mb-2">1 크레딧 = 10원</p>
            <div className="w-16 h-1 bg-[#1e3a5f] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <PricingCard
              tier="Basic"
              credits="500 크레딧"
              price="5,000원"
              features={["기초통계 분석", "데이터 시각화", "PDF 텍스트 추출"]}
            />
            <PricingCard
              tier="Standard"
              credits="2,000 크레딧"
              price="20,000원"
              features={["판결문 자동 코딩", "텍스트 분석", "중급 통계분석"]}
              popular
            />
            <PricingCard
              tier="Premium"
              credits="5,000 크레딧"
              price="50,000원"
              features={["고급 통계분석", "설문조사 설계/배포", "맞춤 컨설팅 지원"]}
            />
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="contact" className="py-24 px-6 bg-[#1a2332] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">연구의 새로운 시작</h2>
          <p className="text-lg text-white/70 mb-10">
            DocCoder와 함께 효율적인 연구를 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button className="shrink-0 px-6 py-3 bg-white text-[#1a2332] rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
              문의하기
            </button>
          </div>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 bg-[#1e3a5f] text-white rounded-xl text-base font-semibold hover:bg-[#162d4a] transition-colors shadow-lg border border-white/10"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">DocCoder</h3>
            <p className="text-sm">연구자를 위한 올인원 문서 코딩 플랫폼</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-white transition-colors">서비스</a>
            <a href="#pricing" className="hover:text-white transition-colors">가격</a>
            <span className="hover:text-white transition-colors cursor-pointer">이용약관</span>
            <span className="hover:text-white transition-colors cursor-pointer">개인정보처리방침</span>
          </div>
          <p className="text-xs text-white/40">&copy; 2026 DocCoder. All rights reserved.</p>
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
  imageClassName,
}: {
  image: string;
  title: string;
  description: string;
  imageClassName?: string;
}) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${imageClassName || ""}`}
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
        <span className="text-sm font-medium text-[#1e3a5f] group-hover:underline">
          자세히 보기 &rarr;
        </span>
      </div>
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold mb-4">
        {step}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function PricingCard({
  tier,
  credits,
  price,
  features,
  popular,
}: {
  tier: string;
  credits: string;
  price: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 border ${
        popular
          ? "border-[#1e3a5f] shadow-xl ring-2 ring-[#1e3a5f]/20 relative"
          : "border-gray-200 shadow-sm"
      } bg-white`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1e3a5f] text-white text-xs font-semibold px-4 py-1 rounded-full">
          인기
        </span>
      )}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{tier}</h3>
      <p className="text-sm text-gray-500 mb-4">{credits}</p>
      <div className="text-3xl font-bold text-gray-900 mb-6">{price}</div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/credits"
        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
          popular
            ? "bg-[#1e3a5f] text-white hover:bg-[#162d4a]"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        크레딧 충전하기
      </Link>
    </div>
  );
}
