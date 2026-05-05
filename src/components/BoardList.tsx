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
  });
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
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <Link key={post.id} href={`/board/${post.id}`} className="block px-5 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-gray-900">{post.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{post.content}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span>{post.author_name || post.author_email}</span>
                      <span>|</span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-gray-400">
                    <div>조회</div>
                    <div className="mt-1 text-sm font-semibold text-gray-700">{post.view_count ?? 0}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
