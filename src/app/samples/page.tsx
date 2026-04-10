"use client";

import Link from "next/link";
import { useState } from "react";
import { SampleModal, JudgmentCodingDetail, ResearchDesignDetail } from "@/components/SampleModal";

interface ServiceSample {
  key: string;
  label: string;
  description: string;
  steps: { label: string; color: string }[];
  hasDetail: boolean;
}

const serviceSamples: ServiceSample[] = [
  {
    key: "research-design",
    label: "연구 설계",
    description: "연구 주제 선정부터 분석 방법 제안까지 체계적인 연구 설계를 제공합니다.",
    steps: [
      { label: "문헌 탐색", color: "bg-blue-500" },
      { label: "연구 방법 설계", color: "bg-green-500" },
      { label: "통계분석 설계", color: "bg-purple-500" },
      { label: "결과 제시 가이드", color: "bg-rose-500" },
    ],
    hasDetail: true,
  },
  {
    key: "judgment",
    label: "판결문 분석",
    description: "판결문 수집부터 변수 코딩, 데이터 납품까지 전 과정을 수행합니다.",
    steps: [
      { label: "판결문 수집", color: "bg-amber-500" },
      { label: "변수 정의/매뉴얼", color: "bg-blue-500" },
      { label: "코딩 수행", color: "bg-red-500" },
      { label: "데이터 납품", color: "bg-green-500" },
    ],
    hasDetail: true,
  },
  {
    key: "survey",
    label: "설문조사",
    description: "설문 설계, 배포, 데이터 수집 및 정리를 지원합니다.",
    steps: [
      { label: "설문 설계", color: "bg-purple-500" },
      { label: "배포/수집", color: "bg-blue-500" },
      { label: "데이터 정리", color: "bg-green-500" },
      { label: "분석 보고서", color: "bg-rose-500" },
    ],
    hasDetail: false,
  },
  {
    key: "news",
    label: "뉴스/언론 보도",
    description: "키워드 기반 뉴스 수집, 분류, 분석을 수행합니다.",
    steps: [
      { label: "키워드 설정", color: "bg-blue-500" },
      { label: "기사 수집", color: "bg-amber-500" },
      { label: "분류/코딩", color: "bg-purple-500" },
      { label: "데이터 납품", color: "bg-green-500" },
    ],
    hasDetail: false,
  },
  {
    key: "quant",
    label: "계량분석",
    description: "기초통계부터 고급 계량분석까지 맞춤 통계 서비스를 제공합니다.",
    steps: [
      { label: "데이터 검토", color: "bg-blue-500" },
      { label: "분석 설계", color: "bg-purple-500" },
      { label: "분석 수행", color: "bg-red-500" },
      { label: "결과 보고서", color: "bg-green-500" },
    ],
    hasDetail: false,
  },
  {
    key: "text",
    label: "텍스트 분석",
    description: "토픽모델링, 감성분석, 워드클라우드 등을 수행합니다.",
    steps: [
      { label: "텍스트 수집", color: "bg-blue-500" },
      { label: "전처리", color: "bg-amber-500" },
      { label: "분석 수행", color: "bg-purple-500" },
      { label: "시각화/보고서", color: "bg-green-500" },
    ],
    hasDetail: false,
  },
];

export default function SamplesPage() {
  const [detailModal, setDetailModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f1a2e] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition-colors mb-4 inline-block">
            &larr; 메인으로
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">결과물 샘플</h1>
          <p className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto">
            각 서비스의 작업 흐름과 결과물을 확인하세요
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceSamples.map((svc) => (
            <div key={svc.key} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{svc.label}</h2>
              <p className="text-sm text-gray-500 mb-5">{svc.description}</p>

              {/* 플로우 다이어그램 */}
              <div className="flex items-center gap-1 mb-5">
                {svc.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className={`${step.color} text-white text-[10px] sm:text-xs font-medium px-2 py-2 rounded-lg text-center truncate`}>
                        {step.label}
                      </div>
                    </div>
                    {i < svc.steps.length - 1 && (
                      <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {svc.hasDetail ? (
                <button
                  onClick={() => setDetailModal(svc.key)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#c49a2e] border border-[#c49a2e]/30 rounded-lg hover:bg-[#c49a2e] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  상세 샘플 보기
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-400 border border-gray-200 rounded-lg">
                  준비 중
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">원하시는 서비스가 있으신가요?</p>
          <Link href="/dashboard" className="inline-flex px-6 py-3 bg-[#c49a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#b08a28] transition-colors shadow-sm">
            의뢰하러 가기
          </Link>
        </div>
      </div>

      {/* 상세 샘플 모달 */}
      <SampleModal open={detailModal === "research-design"} onClose={() => setDetailModal(null)} title="연구 설계 결과물 샘플">
        <ResearchDesignDetail />
      </SampleModal>
      <SampleModal open={detailModal === "judgment"} onClose={() => setDetailModal(null)} title="판결문 코딩 결과물 샘플">
        <JudgmentCodingDetail />
      </SampleModal>
    </div>
  );
}
