"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfoStore } from "@/store/userInfo";
import { clearAuth } from "@/utils/common";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const name = useUserInfoStore((state) => state.name);
  const role = useUserInfoStore((state) => state.role);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setShowProfileMenu(false);
    router.push("/login");
  };

  return (
    <header className="h-20 bg-[#050505] border-b border-gray-800/50 flex items-center justify-between px-8 sticky top-0 z-40">
      
      {/* Search Input */}
      <div className="relative w-96 max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search slays or job titles..." 
          className="w-full bg-[#111] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
        />
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]"></span>
        </button>
        
        <div ref={profileRef} className="relative pl-6 border-l border-gray-800/50">
          <button
            type="button"
            onClick={() => setShowProfileMenu((value) => !value)}
            className="flex items-center gap-3 text-left group"
            aria-haspopup="menu"
            aria-expanded={showProfileMenu}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight group-hover:text-blue-300 transition-colors">{name}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-bold overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=transparent" alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? "rotate-180 text-white" : ""}`} />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-gray-800 bg-[#0b0b0d] shadow-2xl shadow-black/40 overflow-hidden z-50">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
    </header>
  );
}