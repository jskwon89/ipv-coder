"use client";

import Link from "next/link";
import { useState } from "react";

interface ServiceSample {
  key: string;
  label: string;
  description: string;
  steps: { label: string; bg: string; text: string }[];
}

const serviceSamples: ServiceSample[] = [
  {
    key: "research-design",
    label: "연구 설계",
    description: "연구 주제 선정부터 분석 방법 제안까지 체계적인 연구 설계를 제공합니다.",
    steps: [
      { label: "문헌 탐색", bg: "bg-sky-50", text: "text-sky-700" },
      { label: "연구 방법 설계", bg: "bg-emerald-50", text: "text-emerald-700" },
      { label: "통계분석 설계", bg: "bg-violet-50", text: "text-violet-700" },
      { label: "결과 제시 가이드", bg: "bg-rose-50", text: "text-rose-700" },
    ],
  },
  {
    key: "judgment",
    label: "판결문 분석",
    description: "판결문 수집부터 변수 코딩, 데이터 납품까지 전 과정을 수행합니다.",
    steps: [
      { label: "판결문 수집", bg: "bg-amber-50", text: "text-amber-700" },
      { label: "변수 정의/매뉴얼", bg: "bg-sky-50", text: "text-sky-700" },
      { label: "코딩 수행", bg: "bg-orange-50", text: "text-orange-700" },
      { label: "데이터 납품", bg: "bg-emerald-50", text: "text-emerald-700" },
    ],
  },
  {
    key: "survey",
    label: "설문조사",
    description: "설문 설계, 배포, 데이터 수집 및 정리를 지원합니다.",
    steps: [
      { label: "설문 설계", bg: "bg-violet-50", text: "text-violet-700" },
      { label: "배포/수집", bg: "bg-sky-50", text: "text-sky-700" },
      { label: "데이터 정리", bg: "bg-emerald-50", text: "text-emerald-700" },
      { label: "분석 보고서", bg: "bg-rose-50", text: "text-rose-700" },
    ],
  },
  {
    key: "news",
    label: "뉴스/언론 보도",
    description: "키워드 기반 뉴스 수집, 분류, 분석을 수행합니다.",
    steps: [
      { label: "키워드 설정", bg: "bg-sky-50", text: "text-sky-700" },
      { label: "기사 수집", bg: "bg-amber-50", text: "text-amber-700" },
      { label: "분류/코딩", bg: "bg-violet-50", text: "text-violet-700" },
      { label: "데이터 납품", bg: "bg-emerald-50", text: "text-emerald-700" },
    ],
  },
  {
    key: "quant",
    label: "계량분석",
    description: "기초통계부터 고급 계량분석까지 맞춤 통계 서비스를 제공합니다.",
    steps: [
      { label: "데이터 검토", bg: "bg-sky-50", text: "text-sky-700" },
      { label: "분석 설계", bg: "bg-violet-50", text: "text-violet-700" },
      { label: "분석 수행", bg: "bg-orange-50", text: "text-orange-700" },
      { label: "결과 보고서", bg: "bg-emerald-50", text: "text-emerald-700" },
    ],
  },
  {
    key: "text",
    label: "텍스트 분석",
    description: "토픽모델링, 감성분석, 워드클라우드 등을 수행합니다.",
    steps: [
      { label: "텍스트 수집", bg: "bg-sky-50", text: "text-sky-700" },
      { label: "전처리", bg: "bg-amber-50", text: "text-amber-700" },
      { label: "분석 수행", bg: "bg-violet-50", text: "text-violet-700" },
      { label: "시각화/보고서", bg: "bg-emerald-50", text: "text-emerald-700" },
    ],
  },
];

export default function SamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f1a2e] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition-colors mb-4 inline-block">
            &larr; 메인으로
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">서비스별 결과물 안내</h1>
          <p className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto">
            각 서비스의 작업 흐름과 납품 결과물을 확인하세요
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {serviceSamples.map((svc) => (
            <div
              key={svc.key}
              className="bg-[#edeef1] rounded-2xl border border-gray-200/60 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-1">{svc.label}</h2>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">{svc.description}</p>

              {/* 플로우 다이어그램 — 2행 가능 */}
              <div className="grid grid-cols-4 gap-2">
                {svc.steps.map((step, i) => (
                  <div key={i} className="relative">
                    <div className={`${step.bg} ${step.text} border border-current/10 text-xs font-medium px-3 py-3 rounded-lg text-center`}>
                      <span className="opacity-40 text-[9px] font-bold block leading-none mb-1">{i + 1}</span>
                      {step.label}
                    </div>
                    {i < svc.steps.length - 1 && (
                      <svg className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">원하시는 서비스가 있으신가요?</p>
          <Link href="/dashboard" className="inline-flex px-6 py-3 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors shadow-sm">
            의뢰하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
