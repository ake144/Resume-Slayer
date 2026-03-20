"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, Map, History, Settings, Plus, Star, FileText } from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname !== '/dashboard') {
      return false; // Exact match for dashboard
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#050505] border-r border-gray-800/50 flex flex-col z-50">
      {/* Search / Brand Area */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">AI ATS Resume Slayer</h1>
            <p className="text-[10px] text-gray-500 font-medium">Elite Tier Access</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <Link href="/dashboard" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link href="/dashboard/workspace" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/workspace') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Zap className="w-4 h-4" />
          Slay Mode
        </Link>
        <Link href="/dashboard/roadmap" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/roadmap') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Map className="w-4 h-4" />
          Skill Roadmap
        </Link>
        <Link href="/dashboard/cover-letter" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/cover-letter') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <FileText className="w-4 h-4" />
          Cover Letter Pro
        </Link>
        <Link href="/dashboard/upwork" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/upwork') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Zap className="w-4 h-4" />
          Upwork Proposals
        </Link>
        <Link href="/dashboard/history" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/history') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <History className="w-4 h-4" />
          History
        </Link>
        <Link href="/dashboard/settings" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/settings') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-gray-800/50">
        <Link href="/dashboard/workspace" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          New Slay
        </Link>
      </div>
    </aside>
  );
}