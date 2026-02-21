"use client";

import { Mail } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function FloatingContactButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/contact") return null;

  return (
    <button
      onClick={() => router.push("/contact")}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-white shadow-lg hover:shadow-amber-500/40 transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
      title="聯絡我"
    >
      <Mail size={22} />
    </button>
  );
}