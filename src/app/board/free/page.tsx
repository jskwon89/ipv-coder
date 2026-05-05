"use client";

import Link from "next/link";

export default function FreeBoardPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">자유게시판</h1>
        <p className="text-sm text-gray-500 mt-1">연구·통계·논문 작성에 관한 자유로운 의견 교환 공간입니다.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm text-gray-400 mb-4">게시판이 곧 오픈됩니다</p>
        <Link href="/" className="text-sm text-teal-600 hover:text-teal-700 font-medium">홈으로 돌아가기 →</Link>
      </div>
    </div>
  );
}
