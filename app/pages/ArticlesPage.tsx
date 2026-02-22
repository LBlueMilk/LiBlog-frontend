"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useBlog } from "@/app/context/BlogContext";
import { useAuth } from "@/app/context/AuthContext";
import type { Article } from "@/app/data/mockData";

import {
  Search, Tag, Clock, ChevronDown, ChevronRight, CalendarDays, X,
  Home, ExternalLink, Plus
} from "lucide-react";

function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/articles/${article.id}`)}
      className="bg-slate-800 border border-slate-700 rounded-xl p-5 cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/80 transition-all group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(`/articles/${article.id}`);
      }}
    >
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <CalendarDays size={12} />
        <span>{article.date}</span>
        <span>·</span>
        <Clock size={12} />
        <span>{article.readTime} 分鐘閱讀</span>
      </div>

      <h2 className="text-slate-100 group-hover:text-amber-400 transition-colors mb-2">
        {article.title}
      </h2>

      <p className="text-slate-400 text-sm line-clamp-2 mb-3">{article.excerpt}</p>

      <div className="flex flex-wrap gap-1.5">
        {article.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function Timeline({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const byMonth = useMemo(() => {
    const map = new Map<string, { label: string; articles: Article[] }>();
    const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
    for (const article of sorted) {
      const [year, month] = article.date.split("-");
      const key = `${year}-${month}`;
      if (!map.has(key)) {
        map.set(key, { label: `${year}年${parseInt(month, 10)}月`, articles: [] });
      }
      map.get(key)!.articles.push(article);
    }
    return Array.from(map.entries());
  }, [articles]);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 上半部：可滾動的時間軸 */}
      <div className="flex-1 overflow-auto pr-1">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <CalendarDays size={12} />
          文章時間軸
        </h3>

        {byMonth.map(([key, data]) => (
          <div key={key}>
            <button
              onClick={() => toggle(key)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-left group transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-sm text-slate-300 group-hover:text-amber-400 transition-colors">
                  {data.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded-full">
                  {data.articles.length}
                </span>
                {expanded.has(key) ? (
                  <ChevronDown size={12} className="text-slate-500" />
                ) : (
                  <ChevronRight size={12} className="text-slate-500" />
                )}
              </div>
            </button>

            {expanded.has(key) && (
              <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-700 pl-3">
                {data.articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => router.push(`/articles/${article.id}`)}
                    className="block w-full text-left text-xs text-slate-400 hover:text-amber-400 py-1 truncate transition-colors"
                    title={article.title}
                  >
                    {article.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Projects：放在滾動區的底部 */}
        <div className="mt-6 space-y-3 border-t border-slate-700 pt-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ExternalLink size={12} />
              隨意搞搞的專案連結
            </div>

            <a
              href="https://story-building-site-fe.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/60 border border-slate-700 text-sm text-slate-300 transition-colors"
            >
              <span>小說故事記錄網</span>
              <ExternalLink size={14} className="text-slate-500" />
            </a>

            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/60 border border-slate-700 text-sm text-slate-300 transition-colors"
            >
              <span>我的專案 2</span>
              <ExternalLink size={14} className="text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* 最底：回到山丘（固定貼底，不跟著滾動） */}
      <div className="mt-auto pt-4">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/60 border border-slate-700 text-sm text-slate-300 transition-colors"
        >
          <Home size={14} className="text-slate-500" />
          回到山丘
        </Link>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const { articles } = useBlog();
  const { isOwner } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = [...articles].sort((a, b) => b.date.localeCompare(a.date));

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    }

    if (selectedTags.size > 0) {
      result = result.filter((a) => a.tags.some((t) => selectedTags.has(t)));
    }

    return result;
  }, [articles, search, selectedTags]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-6 space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋文章..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label="清除搜尋"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Tag size={13} className="text-slate-500 flex-shrink-0" />
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedTags.has(tag)
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-slate-800 border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-slate-200"
                    }`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 ml-1 transition-colors"
                >
                  <X size={11} />
                  清除篩選
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-slate-500">
              共 {filtered.length} 篇文章
              {(search || selectedTags.size > 0) && " (已篩選)"}
            </div>

            {isOwner && (
              <Link
                href="/write"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 hover:text-orange-300 text-xs transition-all border border-orange-500/30"
              >
                <Plus size={13} />
                新增文章
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {filtered.length > 0 ? (
              filtered.map((article) => <ArticleCard key={article.id} article={article} />)
            ) : (
              <div className="text-center py-16 text-slate-500">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p>找不到符合條件的文章</p>
              </div>
            )}
          </div>
        </div>

        <aside className="w-56 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col min-h-0">
            <Timeline articles={articles} />
          </div>
        </aside>
      </div>
    </div>
  );
}