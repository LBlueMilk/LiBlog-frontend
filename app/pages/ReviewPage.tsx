"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useBlog } from "@/app/context/BlogContext";
import { useAuth } from "@/app/context/AuthContext";
import { Shield, Check, X, Flag, ExternalLink, AlertTriangle } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();

  const { isOwner, currentUser } = useAuth();
  const { getReportedComments, approveReport, rejectReport, articles } = useBlog();

  // 非管理員：導回文章列表（避免 render 階段直接導頁）
  useEffect(() => {
    // 你如果定義「未登入也一定不是 owner」，這段可更簡化
    if (!currentUser || !isOwner) {
      router.replace("/articles");
    }
  }, [currentUser, isOwner, router]);

  // 避免閃畫面
  if (!currentUser || !isOwner) return null;

  const reported = getReportedComments();

  const articleMap = useMemo(() => {
    const map = new Map<string, (typeof articles)[number]>();
    for (const a of articles) map.set(a.id, a);
    return map;
  }, [articles]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
          <Shield size={18} className="text-orange-400" />
        </div>

        <div>
          <h1 className="text-xl text-slate-100">留言審查</h1>
          <p className="text-sm text-slate-500">審查被檢舉的留言</p>
        </div>

        <div className="ml-auto bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm">
          {reported.length} 則待審
        </div>
      </div>

      {reported.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
          <Check size={40} className="mx-auto mb-3 text-green-400 opacity-60" />
          <p className="text-slate-400">目前沒有待審查的留言</p>
          <p className="text-slate-600 text-sm mt-1">所有留言都已審查完畢</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reported.map((comment) => {
            const article = articleMap.get(comment.articleId);

            return (
              <div key={comment.id} className="bg-slate-800 border border-orange-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                  <ExternalLink size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-500">來自文章：</span>

                  {article ? (
                    <Link href={`/articles/${article.id}`} className="text-xs text-amber-400 hover:underline">
                      {article.title}
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-500">（文章已刪除）</span>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm text-slate-200 flex-shrink-0">
                    {comment.username.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-200">{comment.username}</span>
                      <span className="text-xs text-slate-500">{comment.date}</span>
                    </div>

                    <p className="text-slate-300 text-sm bg-slate-700/40 rounded-lg p-3">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {comment.reportReason && (
                  <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2.5 mb-4">
                    <Flag size={13} className="text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-orange-400 mb-0.5">檢舉原因</p>
                      <p className="text-sm text-slate-300">{comment.reportReason}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => approveReport(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm transition-colors"
                  >
                    <Check size={14} />
                    同意（移除留言）
                  </button>

                  <button
                    onClick={() => rejectReport(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
                  >
                    <X size={14} />
                    駁回（保留留言）
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-3">
                  <AlertTriangle size={10} className="inline mr-1" />
                  點擊「同意」將使此留言在文章頁面消失；「駁回」將取消檢舉狀態
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}