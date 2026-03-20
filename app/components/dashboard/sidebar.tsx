"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Zap, 
  Map, 
  History, 
  Settings, 
  Plus, 
  FileText, 
  MessageSquare, 
  Send 
} from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname !== '/dashboard') {
      return false; // Exact match for dashboard
    }
    return pathname?.startsWith(path);
  };

  type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    highlight?: boolean;
    badge?: string;
  };

  type NavGroup = {
    title: string;
    items: NavItem[];
  };

  const navGroups: NavGroup[] = [
    {
      title: "Core",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Slay Mode", href: "/dashboard/workspace", icon: Zap, highlight: true },
        { name: "Skill Roadmap", href: "/dashboard/roadmap", icon: Map },
      ]
    },
    {
      title: "Generators",
      items: [
        { name: "Cover Letters", href: "/dashboard/cover-letter", icon: FileText },
        { name: "Upwork Proposals", href: "/dashboard/upwork", icon: Zap, badge: "New" },
        { name: "LinkedIn DMs", href: "/dashboard/linkedin", icon: MessageSquare, badge: "New" },
        { name: "Cold Pitches", href: "/dashboard/proposal", icon: Send },
      ]
    },
    {
      title: "Settings",
      items: [
        { name: "History", href: "/dashboard/history", icon: History },
        { name: "Preferences", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#060608] border-r border-[#1a1a24] flex flex-col z-50">
      {/* Search / Brand Area */}
      <div className="h-20 flex items-center px-6 border-b border-[#1a1a24] bg-[#0a0a0e]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-[15px] bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 leading-tight">Resume Slayer</h1>
            <p className="text-[11px] text-blue-400/80 font-semibold tracking-wide uppercase mt-0.5">Elite Access</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={clsx(
                      "group flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                      active 
                        ? "bg-[#14141d] text-blue-400 border border-[#2a2a3a] shadow-inner" 
                        : "text-gray-400 hover:text-gray-100 hover:bg-[#111118] border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={clsx(
                        "w-4 h-4 transition-colors duration-200", 
                        item.highlight && !active ? "text-blue-500" : "",
                        active ? "text-blue-400" : "group-hover:text-blue-400"
                      )} />
                      {item.name}
                    </div>
                    
                    {item.badge && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-[#1a1a24] bg-[#0a0a0e]/50 backdrop-blur-sm">
        <Link 
          href="/dashboard/workspace" 
          className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] border border-blue-500/30"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
          New Slay
        </Link>
      </div>
      
      {/* Global styles for the shimmer effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a3a;
          border-radius: 10px;
        }
      `}} />
    </aside>
  );
}
