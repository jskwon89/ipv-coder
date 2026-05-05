"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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

interface BoardComment {
  id: string;
  post_id: string;
  content: string;
  author_email: string;
  author_name: string;
  created_at: string;
}

function normalizeEmail(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BoardDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, session } = useUser();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [commentText, setCommentText] = useState("");

  const currentEmail = normalizeEmail(user?.email);
  const canManagePost = !!post && (isAdmin || (!!currentEmail && currentEmail === post.author_email));

  const authHeaders = useMemo<Record<string, string>>(() => {
    if (!session?.access_token) return {} as Record<string, string>;
    return { Authorization: `Bearer ${session.access_token}` };
  }, [session?.access_token]);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/board/posts/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "게시글을 불러오지 못했습니다.");
      setPost(data.post);
      setEditForm({ title: data.post.title, content: data.post.content });
      setComments(data.comments ?? []);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const savePost = async () => {
    if (!post || !canManagePost || !editForm.title.trim() || !editForm.content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/board/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "게시글 수정에 실패했습니다.");
      setPost(data.post);
      setEditing(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게시글 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!post || !canManagePost) return;
    if (!confirm("게시글을 삭제할까요?")) return;
    const res = await fetch(`/api/board/posts/${post.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "게시글 삭제에 실패했습니다.");
      return;
    }
    router.push(`/board/${post.category}`);
  };

  const addComment = async () => {
    if (!post || !session?.access_token || !commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await fetch(`/api/board/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "댓글 등록에 실패했습니다.");
      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 등록에 실패했습니다.");
    } finally {
      setCommenting(false);
    }
  };

  const deleteComment = async (comment: BoardComment) => {
    if (!post) return;
    if (!confirm("댓글을 삭제할까요?")) return;
    const res = await fetch(`/api/board/posts/${post.id}/comments/${comment.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "댓글 삭제에 실패했습니다.");
      return;
    }
    setComments((prev) => prev.filter((item) => item.id !== comment.id));
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-sm text-gray-400">불러오는 중...</div>;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
          게시글을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const backHref = `/board/${post.category}`;
  const backLabel = post.category === "qna" ? "질문/답변" : "자유게시판";

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">
      <Link href={backHref} className="mb-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800">
        {backLabel}으로 돌아가기
      </Link>

      <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          {editing ? (
            <div className="space-y-3">
              <input
                value={editForm.title}
                onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600/40"
              />
              <textarea
                value={editForm.content}
                onChange={(event) => setEditForm((prev) => ({ ...prev, content: event.target.value }))}
                rows={10}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  취소
                </button>
                <button type="button" onClick={savePost} disabled={saving} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 break-keep">{post.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>{post.author_name || post.author_email}</span>
                    <span>|</span>
                    <span>{formatDate(post.created_at)}</span>
                    <span>|</span>
                    <span>조회 {post.view_count ?? 0}</span>
                  </div>
                </div>
                {canManagePost && (
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                      수정
                    </button>
                    <button type="button" onClick={deletePost} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-gray-700">{post.content}</div>
            </>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-900">댓글 {comments.length}</h2>
          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">아직 댓글이 없습니다.</p>
            ) : (
              comments.map((comment) => {
                const canDelete = isAdmin || (!!currentEmail && currentEmail === comment.author_email);
                return (
                  <div key={comment.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-gray-400">
                          {comment.author_name || comment.author_email} · {formatDate(comment.created_at)}
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{comment.content}</p>
                      </div>
                      {canDelete && (
                        <button type="button" onClick={() => deleteComment(comment)} className="shrink-0 text-xs text-red-500 hover:text-red-600">
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {user ? (
            <div className="mt-4 flex gap-2">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                rows={3}
                placeholder="댓글을 입력하세요"
                className="min-w-0 flex-1 resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40"
              />
              <button
                type="button"
                onClick={addComment}
                disabled={commenting || !commentText.trim()}
                className="self-stretch rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                등록
              </button>
            </div>
          ) : (
            <Link href={`/login?redirect=${encodeURIComponent(`/board/${post.id}`)}`} className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800">
              로그인하면 댓글을 쓸 수 있습니다
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
