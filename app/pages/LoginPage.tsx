"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import { User, Lock, AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, currentUser } = useAuth();

  const returnTo = useMemo(() => {
    const raw = searchParams.get("returnTo");
    return raw && raw.startsWith("/") ? raw : "/articles";
  }, [searchParams]);

  // ✅ 已登入：自動導回（避免在 render 階段 push/replace）
  useEffect(() => {
    if (currentUser) {
      router.replace(returnTo);
    }
  }, [currentUser, router, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("請輸入帳號和密碼");
      return;
    }

    setLoading(true);
    setError("");

    // demo latency
    await new Promise((r) => setTimeout(r, 400));

    const success = login(username.trim(), password.trim());

    setLoading(false);

    if (success) {
      router.replace(returnTo);
    } else {
      setError("帳號或密碼錯誤，請再試一次");
    }
  };

  const demoAccounts = [
    { username: "owner", password: "owner123", label: "owner（管理員）" },
    { username: "小明", password: "user123", label: "小明（一般會員）" },
    { username: "小花", password: "user456", label: "小花（一般會員）" },
  ];

  // 若已登入，畫面可選擇不顯示（避免閃一下）
  if (currentUser) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} className="text-amber-400" />
          </div>
          <h1 className="text-2xl text-slate-100 mb-1">登入會員</h1>
          <p className="text-slate-500 text-sm">歡迎回來！</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 mb-4"
        >
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">帳號</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="輸入帳號"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">密碼</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="輸入密碼"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-9 pr-10 py-2.5 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPw ? "隱藏密碼" : "顯示密碼"}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {loading ? "登入中..." : "登入"}
          </button>
        </form>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
            <AlertCircle size={12} />
            示範帳號（點擊快速填入）
          </p>
          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => {
                  setUsername(acc.username);
                  setPassword(acc.password);
                  setError("");
                }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span className="text-amber-400">{acc.label}</span>
                <span className="text-slate-600 ml-2">密碼: {acc.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}