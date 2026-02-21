"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";
import { FloatingContactButton } from "./FloatingContactButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ChevronDown, Heart, FileText, Shield, User, LogOut, QrCode } from "lucide-react";

function DonateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-amber-400 flex items-center gap-2">
            <Heart size={18} className="text-pink-400" />
            支持創作
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <div className="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center">
              <QrCode size={80} className="text-slate-200" />
            </div>
          </div>
          <p className="text-slate-300 text-center text-sm">
            如果我的文章對你有幫助，<br />歡迎掃描 QR Code 請我喝杯咖啡 ☕
          </p>
          <p className="text-xs text-slate-500">（這是示範用 QR Code）</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, isOwner, logout } = useAuth();
  const router = useRouter();
  const [donateOpen, setDonateOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/articles");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/articles" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded grid grid-cols-2 gap-0.5 overflow-hidden">
                  <div className="bg-red-500" />
                  <div className="bg-amber-400" />
                  <div className="bg-sky-400" />
                  <div className="bg-emerald-400" />
                </div>
                <span className="text-base text-amber-400 group-hover:text-amber-300 transition-colors hidden sm:inline">
                  麻糬的寂靜嶺
                </span>
              </Link>

              <button
                onClick={() => setDonateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 hover:text-pink-300 text-sm transition-all border border-pink-500/30"
              >
                <Heart size={13} />
                <span className="hidden sm:inline">捐款</span>
              </button>

              {isOwner && (
                <Link
                  href="/review"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 hover:text-orange-300 text-sm transition-all border border-orange-500/30"
                >
                  <Shield size={13} />
                  <span className="hidden sm:inline">審查</span>
                </Link>
              )}
            </div>

            <div className="flex-1" />

            <nav className="flex items-center gap-2">
              <Link
                href="/articles"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 text-sm transition-all"
              >
                <FileText size={15} />
                <span>文章</span>
              </Link>

              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm transition-all border border-slate-700">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">{currentUser.username}</span>
                      <ChevronDown size={12} className="opacity-60" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200 w-44">
                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="hover:bg-slate-700 cursor-pointer gap-2"
                    >
                      <User size={14} />
                      會員資料
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-slate-700" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="hover:bg-slate-700 cursor-pointer gap-2 text-red-400"
                    >
                      <LogOut size={14} />
                      登出
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm transition-all"
                >
                  <User size={15} />
                  登入會員
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      <FloatingContactButton />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}