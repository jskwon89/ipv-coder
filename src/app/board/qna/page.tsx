"use client";

import Link from "next/link";
import { useState } from "react";

interface SeedQA {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const seedQAs: SeedQA[] = [
  {
    id: "qa-1",
    category: "이용 안내",
    question: "PRIMER는 누구나 이용할 수 있나요?",
    answer:
      "네, 학부생·대학원생·연구자·실무자 누구나 이용하실 수 있습니다. 별도의 자격 요건은 없으며, 회원가입 후 원하시는 서비스에 의뢰를 신청하시면 됩니다.",
  },
  {
    id: "qa-2",
    category: "이용 안내",
    question: "비용은 어떻게 책정되나요?",
    answer:
      "서비스 종류, 작업 범위, 자료의 양에 따라 달라집니다. 의뢰 또는 간편 상담을 통해 견적을 안내해 드리며, 이후 협의된 금액으로 진행됩니다. 견적 단계에서는 비용이 발생하지 않습니다.",
  },
  {
    id: "qa-3",
    category: "이용 안내",
    question: "작업 기간은 보통 얼마나 걸리나요?",
    answer:
      "단순 분석은 3~5일, 종합적인 연구 지원은 1~3주 정도 소요됩니다. 자료 분량과 작업 복잡도에 따라 더 소요될 수 있으며, 의뢰 시 예상 일정을 함께 안내해 드립니다.",
  },
  {
    id: "qa-4",
    category: "통계분석",
    question: "어떤 통계 프로그램을 사용하나요?",
    answer:
      "SPSS, Stata, R, Mplus, AMOS 등 분석 목적과 연구자가 선호하는 환경에 맞춰 선택합니다. 결과는 표·그래프와 해석을 함께 제공합니다.",
  },
  {
    id: "qa-5",
    category: "통계분석",
    question: "결과를 받은 후 수정 요청도 가능한가요?",
    answer:
      "네, 만족하실 때까지 수정·보완을 보장합니다. 작업 결과에 대한 추가 질문이나 보완이 필요하시면 의뢰 상세 페이지의 채팅으로 언제든 요청하실 수 있습니다.",
  },
  {
    id: "qa-6",
    category: "자료 보안",
    question: "제공한 자료의 보안은 어떻게 관리되나요?",
    answer:
      "모든 자료는 암호화되어 저장되며, 의뢰 종료 후 요청 시 즉시 폐기합니다. 외부 공유는 절대 이루어지지 않으며, 담당자만 접근할 수 있도록 권한이 제한되어 있습니다.",
  },
  {
    id: "qa-7",
    category: "결과물",
    question: "결과물은 어떤 형식으로 받나요?",
    answer:
      "분석 결과는 Word/PDF 보고서, Excel 표, 분석 코드(R/SPSS syntax 등) 형태로 제공됩니다. 학술논문/학위논문 양식에 맞춘 표 정리도 지원합니다.",
  },
  {
    id: "qa-8",
    category: "결과물",
    question: "결과 파일은 어디서 받을 수 있나요?",
    answer:
      "로그인 후 '내 의뢰' 메뉴 → 해당 의뢰 클릭 → 결과 파일 영역에서 다운로드하실 수 있습니다. 새 결과가 등록되면 이메일로도 안내됩니다.",
  },
];

export default function QnaBoardPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const categories = Array.from(new Set(seedQAs.map((q) => q.category)));

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">질문 / 답변</h1>
        <p className="text-sm text-gray-500 mt-1">자주 묻는 질문과 답변을 모았습니다. 추가 문의는 간편 상담을 이용해 주세요.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="px-6 py-3 bg-slate-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-teal-700 tracking-wide uppercase">{cat}</span>
            </div>
            {seedQAs.filter((q) => q.category === cat).map((qa) => {
              const open = openId === qa.id;
              return (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => setOpenId(open ? null : qa.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="text-teal-600 font-bold text-sm shrink-0">Q.</span>
                      <span className="text-sm font-medium text-gray-900 break-keep">{qa.question}</span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {open && (
                    <div className="mt-3 ml-6 pl-3 border-l-2 border-teal-100 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      <span className="text-teal-600 font-bold mr-1">A.</span>
                      {qa.answer}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-3">원하시는 답변이 없나요?</p>
        <Link href="/consultation" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
          간편 상담 신청
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
