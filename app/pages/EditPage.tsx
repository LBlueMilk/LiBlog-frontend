"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useBlog } from "@/app/context/BlogContext";
import { useAuth } from "@/app/context/AuthContext";
import type { Article } from "@/app/data/mockData";

import { ArrowLeft, Save, X, AlertTriangle } from "lucide-react";

function normalizeTags(input: string) {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { articles, /*updateArticle*/ } = useBlog();
  const { currentUser, isOwner } = useAuth();

  // 權限控管：未登入 -> login；非 owner -> articles
  useEffect(() => {
    if (!currentUser) {
      router.replace(`/login?returnTo=${encodeURIComponent(`/edit/${id ?? ""}`)}`);
      return;
    }
    if (!isOwner) {
      router.replace("/articles");
      return;
    }
  }, [currentUser, isOwner, router, id]);

  const article = useMemo(() => {
    if (!id) return null;
    return articles.find((a) => a.id === id) ?? null;
  }, [articles, id]);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [readTime, setReadTime] = useState<number>(5);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // 初始化表單（只在 article ready 時灌一次）
  useEffect(() => {
    if (!article) return;

    setTitle(article.title ?? "");
    setContent(article.content ?? "");
    setExcerpt(article.excerpt ?? "");
    setTagsInput((article.tags ?? []).join(", "));
    setDate(article.date ?? new Date().toISOString().split("T")[0]);
    setReadTime(typeof article.readTime === "number" ? article.readTime : 5);
    setIsPublic((article as any).isPublic ?? true);
  }, [article]);

  if (!id) return null;

  // 權限尚未確認前，不渲染（避免閃畫面）
  if (!currentUser || !isOwner) return null;

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-orange-300 mb-2">
            <AlertTriangle size={16} />
            找不到此文章
          </div>
          <Link href="/articles" className="text-amber-400 hover:underline text-sm">
            回到文章列表
          </Link>
        </div>
      </div>
    );
  }

  const returnToDetail = () => router.push(`/articles/${id}`);

  const handleSave = async () => {
    setError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("標題不可為空");
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("內容不可為空");
      return;
    }

    const tags = normalizeTags(tagsInput);
    if (tags.length === 0) {
      setError("至少需要 1 個標籤（用逗號分隔）");
      return;
    }

    const safeDate = (date || new Date().toISOString().split("T")[0]).trim();
    const safeReadTime = Number.isFinite(readTime) && readTime > 0 ? Math.floor(readTime) : 5;

    // excerpt：若沒填就自動從 content 擷取
    const safeExcerpt =
      excerpt.trim() ||
      trimmedContent
        .replace(/\s+/g, " ")
        .slice(0, 80)
        .trim();

    const updates: Partial<Article> & { isPublic?: boolean } = {
      title: trimmedTitle,
      content: trimmedContent,
      excerpt: safeExcerpt,
      tags,
      date: safeDate,
      readTime: safeReadTime,
      // 你的 Article 型別若已加 isPublic 就不用 any
      ...( { isPublic } as any ),
    };

    try {
      setSaving(true);
      //updateArticle(id, updates as Partial<Article>);
      // 儲存後回文章頁
      router.replace(`/articles/${id}`);
    } catch (e) {
      setError("儲存失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={returnToDetail}
          className="flex items-center gap-2 text-slate-500 hover:text-amber-400 text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          返回文章
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={returnToDetail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs transition"
          >
            <X size={13} />
            取消
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={13} />
            {saving ? "儲存中..." : "儲存"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-xl px-4 py-3 text-orange-300 text-sm">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="text-sm text-slate-300">標題</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
            placeholder="輸入標題"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-300">日期（YYYY-MM-DD）</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
              placeholder="2025-12-28"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">閱讀時間（分鐘）</label>
            <input
              value={String(readTime)}
              onChange={(e) => setReadTime(parseInt(e.target.value || "0", 10))}
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              公開（取消勾選 = 隱藏）
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300">標籤（逗號分隔）</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
            placeholder="技術, 程式設計, 生活"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">摘要 excerpt（可留空自動產生）</label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
            placeholder="文章摘要..."
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">內容（支援你現有的 **標題** 格式）</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full min-h-[320px] rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
            placeholder="輸入文章內容..."
          />
        </div>
      </div>
    </div>
  );
}