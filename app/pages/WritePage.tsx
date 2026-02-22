"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

type PostStatus = "Draft" | "Published";

export default function WritePage() {
  const router = useRouter();
  const { currentUser, isOwner } = useAuth();

  // 權限控管：未登入 -> 去 login；非 Owner -> 回 articles
  useEffect(() => {
    if (!currentUser) {
      router.replace("/login?returnTo=/write");
      return;
    }
    if (!isOwner) {
      router.replace("/articles");
      return;
    }
  }, [currentUser, isOwner, router]);

  // DB 對齊欄位（前端只負責可輸入的）
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<PostStatus>("Draft");
  const [isPublic, setIsPublic] = useState(false);
  const [slug, setSlug] = useState("");

  const publishedAt = useMemo(() => {
    return status === "Published" ? new Date().toISOString() : null;
  }, [status]);

  if (!currentUser || !isOwner) return null;

  async function onSubmit() {
    const payload = {
      title,
      content,
      status,
      published_at: publishedAt,            // Published 才給值
      is_public: status === "Published" ? isPublic : false,
      slug,
      // author_id 建議後端從 JWT 取，不要前端傳
    };

    console.log("create post payload:", payload);

    // TODO: 你接上 API 後，把這段換成 fetch POST
    // await fetch("/api/posts", { method:"POST", headers:{...}, body: JSON.stringify(payload) })

    router.replace("/articles");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-slate-100">新增文章</h1>
        <button
          onClick={() => router.replace("/articles")}
          className="text-sm px-3 py-1.5 rounded-full border border-slate-700 hover:bg-slate-800 transition text-slate-300"
        >
          返回
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-300">標題 title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">固定網址 slug（唯一）</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">內容 content（HTML/富文字）</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full min-h-[260px] rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">狀態 status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>

          <label className="ml-4 flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={status !== "Published"}
            />
            is_public
          </label>
        </div>

        <div className="pt-2">
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  );
}