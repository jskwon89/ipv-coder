"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

interface NewsResult {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

type SearchType = "keyword" | "sentence";

export default function NewsSearchPage() {
  const [searchType, setSearchType] = useState<SearchType>("keyword");
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const addKeyword = () => {
    const parts = keywordInput.split(",").map((s) => s.trim()).filter(Boolean);
    const newKeywords = parts.filter((p) => !keywords.includes(p));
    if (newKeywords.length > 0) {
      setKeywords([...keywords, ...newKeywords]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSearch = async () => {
    const searchQuery =
      searchType === "keyword" ? keywords.join(` ${operator} `) : query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/news-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          type: searchType,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      console.error("검색 실패");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyCitation = (article: NewsResult) => {
    const citation = `${article.title}. ${article.source}. ${article.date}. ${article.url}`;
    navigator.clipboard.writeText(citation);
  };

  const exportSelected = () => {
    const selectedArticles = results.filter((r) => selected.has(r.id));
    const text = selectedArticles
      .map(
        (a, i) =>
          `[${i + 1}] ${a.title}\n    출처: ${a.source} | 날짜: ${a.date}\n    URL: ${a.url}\n    요약: ${a.summary}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    alert(`${selectedArticles.length}건의 기사가 클립보드에 복사되었습니다.`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        대시보드로 돌아가기
      </Link>
      <PageHeader
        title="기사 검색"
        subtitle="뉴스 기사 검색 및 수집"
        breadcrumbs={[
          { label: "문서 코딩" },
          { label: "기사 검색" },
        ]}
        iconBgClass="bg-blue-50"
        iconTextClass="text-blue-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        }
      />

      {/* Search type toggle */}
      <div className="bg-card rounded-xl border border-blue-200 p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType("keyword")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === "keyword"
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-secondary-foreground hover:bg-border"
            }`}
          >
            키워드 조합
          </button>
          <button
            onClick={() => setSearchType("sentence")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === "sentence"
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-secondary-foreground hover:bg-border"
            }`}
          >
            문장 검색
          </button>
        </div>

        {searchType === "keyword" ? (
          <div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="키워드를 하나씩 입력 후 Enter (쉼표로 여러 개 동시 입력 가능)"
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {keywords.map((kw, i) => (
                  <span key={kw} className="flex items-center">
                    {i > 0 && (
                      <button
                        onClick={() =>
                          setOperator(operator === "AND" ? "OR" : "AND")
                        }
                        className="mx-1 px-2 py-0.5 rounded text-xs font-bold bg-gray-50 text-muted-foreground hover:bg-border transition-colors"
                      >
                        {operator}
                      </button>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {kw}
                      <button
                        onClick={() => removeKeyword(kw)}
                        className="hover:text-blue-800"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="필요로 하는 사건 내용을 입력하세요 (예: 가정폭력 가해자에 대한 법원의 양형 기준 변화)"
            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4 mt-4 pt-4 border-t border-border">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              시작일
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              종료일
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={
              loading ||
              (searchType === "keyword"
                ? keywords.length === 0
                : !query.trim())
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 ml-auto"
          >
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
      </div>

      {/* Selected export bar */}
      {selected.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selected.size}건 선택됨
          </span>
          <button
            onClick={exportSelected}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            선택한 기사 내보내기
          </button>
        </div>
      )}

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="space-y-4">
        {results.map((article) => (
          <div
            key={article.id}
            className={`bg-card rounded-xl border p-5 transition-colors ${
              selected.has(article.id)
                ? "border-blue-500/50"
                : "border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selected.has(article.id)}
                onChange={() => toggleSelect(article.id)}
                className="mt-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline line-clamp-1"
                >
                  {article.title}
                </a>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span>{article.source}</span>
                  <span>{article.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => copyCitation(article)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-secondary-foreground rounded-lg hover:bg-border transition-colors"
                  >
                    논문에 인용
                  </button>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-secondary-foreground rounded-lg hover:bg-border transition-colors"
                  >
                    전문 보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
