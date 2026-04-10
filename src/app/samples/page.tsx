"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SampleFile {
  name: string;
  type: "image" | "pdf";
  path: string;
  description?: string;
}

interface ServiceSample {
  key: string;
  label: string;
  description: string;
  files: SampleFile[];
}

// 서비스별 샘플 데이터 — 파일 추가 시 여기에 항목 추가
const serviceSamples: ServiceSample[] = [
  {
    key: "research-design",
    label: "연구 설계",
    description: "연구 주제 선정부터 연구 설계, 분석 방법 제안까지의 결과물 예시입니다.",
    files: [],
  },
  {
    key: "survey",
    label: "설문조사",
    description: "설문지 설계, 데이터 수집, 분석 보고서 등 설문조사 결과물 예시입니다.",
    files: [],
  },
  {
    key: "judgment",
    label: "판결문 분석",
    description: "판결문 수집, 변수 코딩, 코딩 결과 데이터 등 판결문 분석 결과물 예시입니다.",
    files: [],
  },
  {
    key: "news",
    label: "뉴스/언론 보도",
    description: "키워드 기반 뉴스 수집 및 분석 결과물 예시입니다.",
    files: [],
  },
  {
    key: "quant",
    label: "계량분석",
    description: "기초통계, 회귀분석, 구조방정식 등 계량분석 결과물 예시입니다.",
    files: [],
  },
  {
    key: "text",
    label: "텍스트 분석",
    description: "토픽모델링, 감성분석, 워드클라우드 등 텍스트 분석 결과물 예시입니다.",
    files: [],
  },
];

export default function SamplesPage() {
  const [activeService, setActiveService] = useState(serviceSamples[0].key);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const current = serviceSamples.find((s) => s.key === activeService) ?? serviceSamples[0];

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
            각 서비스별로 이런 결과물을 받게 됩니다
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Service tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {serviceSamples.map((svc) => (
            <button
              key={svc.key}
              onClick={() => setActiveService(svc.key)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeService === svc.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-teal-600/50"
              }`}
            >
              {svc.label}
            </button>
          ))}
        </div>

        {/* Current service */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{current.label}</h2>
          <p className="text-sm text-gray-500 mb-8">{current.description}</p>

          {current.files.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">샘플 준비 중입니다</p>
              <p className="text-gray-300 text-xs mt-1">곧 결과물 예시가 추가됩니다</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 이미지 파일들 — 바로 보기 */}
              {current.files.filter((f) => f.type === "image").length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">미리보기</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {current.files
                      .filter((f) => f.type === "image")
                      .map((f) => (
                        <div key={f.path} className="group">
                          <button
                            onClick={() => setLightboxImg(f.path)}
                            className="w-full relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 hover:border-teal-600/50 transition-colors cursor-zoom-in"
                          >
                            <Image
                              src={f.path}
                              alt={f.name}
                              fill
                              className="object-contain bg-gray-50 group-hover:scale-[1.02] transition-transform"
                            />
                          </button>
                          <p className="text-xs text-gray-500 mt-2">{f.description || f.name}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* PDF 파일들 — 다운로드 */}
              {current.files.filter((f) => f.type === "pdf").length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">다운로드</h3>
                  <div className="space-y-2">
                    {current.files
                      .filter((f) => f.type === "pdf")
                      .map((f) => (
                        <a
                          key={f.path}
                          href={f.path}
                          download
                          className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-teal-600/50 hover:bg-primary/5 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                            {f.description && <p className="text-xs text-gray-400 mt-0.5">{f.description}</p>}
                          </div>
                          <div className="shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-teal-600/30 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              PDF 다운로드
                            </span>
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">원하시는 서비스가 있으신가요?</p>
          <Link
            href="/dashboard"
            className="inline-flex px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#b08a28] transition-colors shadow-sm"
          >
            의뢰하러 가기
          </Link>
        </div>
      </div>

      {/* Lightbox — 이미지 확대 보기 */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <Image
              src={lightboxImg}
              alt="확대 보기"
              width={1920}
              height={1080}
              className="object-contain w-full h-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
