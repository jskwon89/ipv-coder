"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/UserAuthContext";

interface BoardPost {
  id: string;
  category: "free" | "qna";
  title: string;
  content: string;
  author_email: string;
  author_name: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface BoardListProps {
  category: "free" | "qna";
  title: string;
  description: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\.\s?$/, "");
}

const COMMON_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "nate.com",
  "yahoo.com",
  "yahoo.co.kr",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "proton.me",
  "protonmail.com",
]);

function maskEmail(email: string) {
  if (!email || !email.includes("@")) return email || "익명";
  const [local, domain] = email.split("@");
  if (!local) return `***@${domain}`;
  const head = local.charAt(0);
  const safeDomain = COMMON_EMAIL_DOMAINS.has(domain.toLowerCase()) ? domain : "***";
  return `${head}***@${safeDomain}`;
}

export default function BoardList({ category, title, description }: BoardListProps) {
  const router = useRouter();
  const { user, session } = useUser();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/board/posts?category=${category}&limit=20&offset=0`);
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const submitPost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.access_token || !form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/board/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          category,
          title: form.title,
          content: form.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "게시글 등록에 실패했습니다.");
      router.push(`/board/${data.post.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게시글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
          >
            글쓰기
          </button>
        ) : (
          <Link
            href={`/login?redirect=${encodeURIComponent(`/board/${category}`)}`}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            로그인하면 글을 쓸 수 있습니다
          </Link>
        )}
      </div>

      {showForm && user && (
        <form onSubmit={submitPost} className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="제목"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40"
              maxLength={120}
            />
            <textarea
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="내용을 입력하세요"
              rows={6}
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting || !form.title.trim() || !form.content.trim()}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {submitting ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">아직 게시글이 없습니다.</div>
        ) : (
          <>
            {/* Desktop: 표 형식 */}
            <table className="hidden sm:table w-full text-sm">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr className="text-gray-600 text-xs font-semibold">
                  <th className="px-3 py-3 w-16 text-center">번호</th>
                  <th className="px-3 py-3 text-left">제목</th>
                  <th className="px-3 py-3 w-40 text-center">작성자</th>
                  <th className="px-3 py-3 w-28 text-center">작성일</th>
                  <th className="px-3 py-3 w-16 text-center">조회</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post, idx) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-center text-gray-400">{posts.length - idx}</td>
                    <td className="px-3 py-3">
                      <Link href={`/board/${post.id}`} className="block truncate font-medium text-gray-900 hover:text-teal-700">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-500 font-mono">
                      {maskEmail(post.author_email)}
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-500">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-500">
                      {post.view_count ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile: 카드 형식 */}
            <div className="sm:hidden divide-y divide-gray-100">
              {posts.map((post, idx) => (
                <Link key={post.id} href={`/board/${post.id}`} className="block px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span>#{posts.length - idx}</span>
                  </div>
                  <h2 className="truncate text-sm font-semibold text-gray-900">{post.title}</h2>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="font-mono">{maskEmail(post.author_email)}</span>
                    <span className="text-gray-300">|</span>
                    <span>{formatDate(post.created_at)}</span>
                    <span className="text-gray-300">|</span>
                    <span>조회 {post.view_count ?? 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
