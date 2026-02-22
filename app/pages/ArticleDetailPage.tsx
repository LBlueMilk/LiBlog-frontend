"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useBlog } from "@/app/context/BlogContext";
import { useAuth } from "@/app/context/AuthContext";
import type { Comment } from "@/app/data/mockData";

import {
  CalendarDays,
  Clock,
  ArrowLeft,
  Send,
  Edit2,
  Trash2,
  Flag,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  EyeOff,
} from "lucide-react";

function renderContent(text: string) {
  return text
    .split("\n\n")
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("**") &&
        trimmed.endsWith("**") &&
        !trimmed.slice(2, -2).includes("**")
      ) {
        return `<h3 class="text-lg text-amber-400 mt-6 mb-2">${trimmed.slice(2, -2)}</h3>`;
      }
      const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const withBreaks = withBold.replace(/\n/g, "<br>");
      return `<p class="mb-4 text-slate-300 leading-relaxed">${withBreaks}</p>`;
    })
    .join("");
}

interface CommentItemProps {
  comment: Comment;
  currentUserId: string | undefined;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReport: (id: string, reason: string) => void;
}

function CommentItem({ comment, currentUserId, onEdit, onDelete, onReport }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isOwn = currentUserId === comment.userId;

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText.trim());
      setEditing(false);
    }
  };

  const handleSubmitReport = () => {
    if (reportReason.trim()) {
      onReport(comment.id, reportReason.trim());
      setReporting(false);
      setReportReason("");
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm flex-shrink-0 text-slate-200">
          {comment.username.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-200">{comment.username}</span>
            <span className="text-xs text-slate-500">{comment.date}</span>
            {comment.reported && comment.approved === null && (
              <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">
                審查中
              </span>
            )}
          </div>

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm resize-none focus:outline-none focus:border-amber-500/60 min-h-[80px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white text-xs rounded-lg transition-colors"
                >
                  <Check size={12} /> 儲存
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditText(comment.content);
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  <X size={12} /> 取消
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">{comment.content}</p>
          )}

          {reporting && (
            <div className="mt-2 space-y-2">
              <input
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="請描述檢舉原因..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm focus:outline-none focus:border-orange-500/60"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReport}
                  className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-400 text-white text-xs rounded-lg transition-colors"
                >
                  <Flag size={12} /> 提交檢舉
                </button>
                <button
                  onClick={() => {
                    setReporting(false);
                    setReportReason("");
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  <X size={12} /> 取消
                </button>
              </div>
            </div>
          )}
        </div>

        {!editing && !reporting && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {isOwn ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="修改留言"
                >
                  <Edit2 size={13} />
                </button>

                {deleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-red-400">確定刪除?</span>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                      title="確認刪除"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="p-1 rounded text-slate-400 hover:bg-slate-700 transition-colors"
                      title="取消"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors"
                    title="刪除留言"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </>
            ) : (
              currentUserId && (
                <button
                  onClick={() => setReporting(true)}
                  disabled={comment.reported}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={comment.reported ? "已檢舉" : "檢舉留言"}
                >
                  <Flag size={13} />
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { articles, getCommentsForArticle, addComment, editComment, deleteComment, reportComment } = useBlog();
  const { currentUser, isOwner } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [hideConfirm, setHideConfirm] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [loginWarning, setLoginWarning] = useState(false);

  const article = useMemo(() => articles.find((a) => a.id === id), [articles, id]);
  const comments = useMemo(() => getCommentsForArticle(id ?? ""), [getCommentsForArticle, id]);

  if (!id) return null;

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400">找不到此文章</p>
        <Link href="/articles" className="text-amber-400 hover:underline mt-2 inline-block">
          回到文章列表
        </Link>
      </div>
    );
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    if (!currentUser) {
      setLoginWarning(true);
      const returnTo = `/articles/${id}`;
      setTimeout(() => {
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      }, 1800);
      return;
    }

    addComment(article.id, currentUser.id, currentUser.username, newComment.trim());
    setNewComment("");
  };

  const handleEditArticle = () => {
    router.push(`/edit/${article.id}`);
  };

  const handleDeleteArticle = () => {
    // TODO: 你之後在 BlogContext 實作 deleteArticle(articleId)
    // deleteArticle(article.id);

    // 先用最保守的做法：導回列表（避免停在不存在頁）
    router.push("/articles");
  };

  const handleHideArticle = () => {
    // TODO: 你之後在 BlogContext 實作 setArticleVisibility(articleId, false) 或 updateArticle(...)
    // hideArticle(article.id);

    // 先做 UI 行為：隱藏完導回列表
    router.push("/articles");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header bar：左返回 + 右操作 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/articles")}
          className="flex items-center gap-2 text-slate-500 hover:text-amber-400 text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          返回文章列表
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            {/* 修改 */}
            <button
              onClick={handleEditArticle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs transition"
              title="修改文章"
            >
              <Edit2 size={13} />
              修改
            </button>

            {/* 隱藏（含二次確認） */}
            {hideConfirm ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-orange-300">確定隱藏?</span>
                <button
                  onClick={handleHideArticle}
                  className="p-1.5 rounded-full text-orange-300 hover:bg-orange-500/20 transition"
                  title="確認隱藏"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => setHideConfirm(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 transition"
                  title="取消"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setHideConfirm(true);
                  setDeleteConfirm(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-xs transition"
                title="隱藏文章"
              >
                <EyeOff size={13} />
                隱藏
              </button>
            )}

            {/* 刪除（含二次確認） */}
            {deleteConfirm ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-300">確定刪除?</span>
                <button
                  onClick={handleDeleteArticle}
                  className="p-1.5 rounded-full text-red-300 hover:bg-red-500/20 transition"
                  title="確認刪除"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 transition"
                  title="取消"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDeleteConfirm(true);
                  setHideConfirm(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs transition"
                title="刪除文章"
              >
                <Trash2 size={13} />
                刪除
              </button>
            )}
          </div>
        )}
      </div>

      {/* 文章內容 */}
      <article className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} />
            {article.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            {article.readTime} 分鐘閱讀
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl text-slate-50 mb-4">{article.title}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="prose-custom" dangerouslySetInnerHTML={{ __html: renderContent(article.content) }} />
      </article>

      <section>
        <h2 className="flex items-center gap-2 text-slate-300 mb-5">
          <MessageSquare size={16} />
          留言 ({comments.length})
        </h2>

        <div className="space-y-3 mb-6">
          {comments.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">還沒有留言，來留下第一則吧！</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUser?.id}
                onEdit={editComment}
                onDelete={deleteComment}
                onReport={reportComment}
              />
            ))
          )}
        </div>

        {loginWarning && (
          <div className="flex items-center gap-3 bg-orange-500/15 border border-orange-500/30 rounded-xl px-4 py-3 mb-4 text-orange-300 text-sm">
            <AlertTriangle size={15} />
            要留言需要登入會員，即將跳轉到登入頁面...
          </div>
        )}

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-3">
            {currentUser ? `以 ${currentUser.username} 的身份留言` : "留下您的想法"}
          </h3>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="輸入留言..."
            rows={3}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-amber-500/60 transition-colors mb-3"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm rounded-lg transition-colors"
            >
              <Send size={13} />
              送出留言
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}