"use client";

import Link from "next/link";
import { useState } from "react";
import { SampleModal, JudgmentCodingDetail, ResearchDesignDetail } from "@/components/SampleModal";

interface ServiceSample {
  key: string;
  label: string;
  description: string;
  steps: string[];
  hasDetail: boolean;
}

const serviceSamples: ServiceSample[] = [
  {
    key: "research-design",
    label: "연구 설계",
    description: "연구 주제 선정부터 분석 방법 제안까지 체계적인 연구 설계를 제공합니다.",
    steps: ["문헌 탐색", "연구 방법 설계", "통계분석 설계", "결과 제시 가이드"],
    hasDetail: true,
  },
  {
    key: "judgment",
    label: "판결문 분석",
    description: "판결문 수집부터 변수 코딩, 데이터 납품까지 전 과정을 수행합니다.",
    steps: ["판결문 수집", "변수 정의/매뉴얼", "코딩 수행", "데이터 납품"],
    hasDetail: true,
  },
  {
    key: "survey",
    label: "설문조사",
    description: "설문 설계, 배포, 데이터 수집 및 정리를 지원합니다.",
    steps: ["설문 설계", "배포/수집", "데이터 정리", "분석 보고서"],
    hasDetail: false,
  },
  {
    key: "news",
    label: "뉴스/언론 보도",
    description: "키워드 기반 뉴스 수집, 분류, 분석을 수행합니다.",
    steps: ["키워드 설정", "기사 수집", "분류/코딩", "데이터 납품"],
    hasDetail: false,
  },
  {
    key: "quant",
    label: "계량분석",
    description: "기초통계부터 고급 계량분석까지 맞춤 통계 서비스를 제공합니다.",
    steps: ["데이터 검토", "분석 설계", "분석 수행", "결과 보고서"],
    hasDetail: false,
  },
  {
    key: "text",
    label: "텍스트 분석",
    description: "토픽모델링, 감성분석, 워드클라우드 등을 수행합니다.",
    steps: ["텍스트 수집", "전처리", "분석 수행", "시각화/보고서"],
    hasDetail: false,
  },
];

export default function SamplesPage() {
  const [detailModal, setDetailModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1a2e] via-[#162240] to-[#0b1422]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
        <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">
          &larr; 메인으로
        </Link>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">결과물 샘플</h1>
        <p className="text-sm sm:text-lg text-white/50 max-w-2xl mx-auto">
          각 서비스의 작업 흐름과 결과물을 확인하세요
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {serviceSamples.map((svc) => (
            <div
              key={svc.key}
              className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/[0.09] hover:border-white/15 transition-all duration-300"
            >
              <h2 className="text-lg font-bold text-white mb-1">{svc.label}</h2>
              <p className="text-sm text-white/45 mb-5 leading-relaxed">{svc.description}</p>

              {/* 플로우 다이어그램 — 뮤트 골드 톤 */}
              <div className="flex items-center gap-1.5 mb-6">
                {svc.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5 flex-1 min-w-0">
                    <div className="flex-1 min-w-0 relative">
                      <div className="bg-[#c49a2e]/15 border border-[#c49a2e]/25 text-[#d4a843] text-[10px] sm:text-xs font-medium px-2 py-2.5 rounded-lg text-center truncate">
                        <span className="text-[#c49a2e]/50 text-[9px] font-bold block leading-none mb-0.5">{String(i + 1).padStart(2, "0")}</span>
                        {step}
                      </div>
                    </div>
                    {i < svc.steps.length - 1 && (
                      <svg className="w-3.5 h-3.5 text-[#c49a2e]/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {svc.hasDetail ? (
                <button
                  onClick={() => setDetailModal(svc.key)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#c49a2e] border border-[#c49a2e]/30 rounded-lg hover:bg-[#c49a2e] hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  상세 샘플 보기
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/25 border border-white/10 rounded-lg">
                  준비 중
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-sm text-white/40 mb-4">원하시는 서비스가 있으신가요?</p>
          <Link href="/dashboard" className="inline-flex px-6 py-3 bg-[#c49a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#d4a843] transition-colors shadow-lg shadow-[#c49a2e]/20">
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
