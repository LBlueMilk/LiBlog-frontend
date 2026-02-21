"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Github,
  Globe,
  Check,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, updateUser, isOwner } = useAuth();

  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [oauthStatus, setOauthStatus] = useState<{ google: boolean; github: boolean }>(
    currentUser?.oauth ?? { google: false, github: false }
  );
  const [oauthLoading, setOauthLoading] = useState<{ google: boolean; github: boolean }>({
    google: false,
    github: false,
  });
  const [savedMsg, setSavedMsg] = useState("");

  // ✅ 未登入：導回 login（Next 沒有 <Navigate/>）
  useEffect(() => {
    if (!currentUser) {
      router.replace("/login?returnTo=/profile");
    }
  }, [currentUser, router]);

  // ✅ currentUser 變動時，讓本地 state 對齊（避免刷新/切換帳號後仍顯示舊值）
  useEffect(() => {
    if (!currentUser) return;
    setBio(currentUser.bio ?? "");
    setOauthStatus(currentUser.oauth ?? { google: false, github: false });
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSaveBio = () => {
    updateUser({ bio });
    setEditingBio(false);
    setSavedMsg("已儲存");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const toggleOAuth = async (provider: "google" | "github") => {
    setOauthLoading((prev) => ({ ...prev, [provider]: true }));
    await new Promise((r) => setTimeout(r, 900));

    const next = !oauthStatus[provider];
    const nextOauth = { ...oauthStatus, [provider]: next };

    setOauthStatus(nextOauth);
    updateUser({ oauth: nextOauth });

    setOauthLoading((prev) => ({ ...prev, [provider]: false }));
    setSavedMsg(`${provider === "google" ? "Google" : "GitHub"} 已${next ? "綁定" : "解除綁定"}`);
    setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl text-slate-100 mb-8 flex items-center gap-2">
        <User size={20} className="text-amber-400" />
        會員資料
      </h1>

      {savedMsg && (
        <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-lg px-4 py-2.5 text-green-400 text-sm mb-4">
          <Check size={14} />
          {savedMsg}
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl text-white">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl text-slate-100">{currentUser.username}</h2>
              {isOwner && (
                <span className="flex items-center gap-1 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                  <Shield size={10} />
                  管理員
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-700/40 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Mail size={12} />
              電子郵件
            </div>
            <p className="text-sm text-slate-200">{currentUser.email}</p>
          </div>
          <div className="bg-slate-700/40 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Calendar size={12} />
              加入日期
            </div>
            <p className="text-sm text-slate-200">{currentUser.joinDate}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-slate-400 flex items-center gap-1.5">
            <Edit2 size={13} />
            個人簡介
          </h3>
          {!editingBio && (
            <button
              onClick={() => setEditingBio(true)}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              編輯
            </button>
          )}
        </div>

        {editingBio ? (
          <div className="space-y-2">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-amber-500/60"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveBio}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs rounded-lg transition-colors"
              >
                <Save size={12} />
                儲存
              </button>
              <button
                onClick={() => {
                  setEditingBio(false);
                  setBio(currentUser.bio ?? "");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
              >
                <X size={12} />
                取消
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-300 text-sm">
            {currentUser.bio ? currentUser.bio : <span className="text-slate-500">尚未填寫簡介</span>}
          </p>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-sm text-slate-400 mb-4">第三方帳號綁定</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-700/40 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-red-400" />
              <div>
                <p className="text-sm text-slate-200">Google</p>
                <p className="text-xs text-slate-500">{oauthStatus.google ? "已綁定" : "尚未綁定"}</p>
              </div>
            </div>
            <button
              onClick={() => toggleOAuth("google")}
              disabled={oauthLoading.google}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                oauthStatus.google
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                  : "bg-slate-600 text-slate-300 hover:bg-slate-500"
              }`}
            >
              {oauthLoading.google ? (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : oauthStatus.google ? (
                <>
                  <X size={11} /> 解除綁定
                </>
              ) : (
                <>
                  <Check size={11} /> 綁定
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-700/40 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Github size={18} className="text-slate-300" />
              <div>
                <p className="text-sm text-slate-200">GitHub</p>
                <p className="text-xs text-slate-500">{oauthStatus.github ? "已綁定" : "尚未綁定"}</p>
              </div>
            </div>
            <button
              onClick={() => toggleOAuth("github")}
              disabled={oauthLoading.github}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                oauthStatus.github
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                  : "bg-slate-600 text-slate-300 hover:bg-slate-500"
              }`}
            >
              {oauthLoading.github ? (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : oauthStatus.github ? (
                <>
                  <X size={11} /> 解除綁定
                </>
              ) : (
                <>
                  <Check size={11} /> 綁定
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-4">* 這是示範功能，實際環境需連接 OAuth 服務</p>
      </div>
    </div>
  );
}