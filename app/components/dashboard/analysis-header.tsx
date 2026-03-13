import { Bell, User, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function AnalysisHeader() {
  return (
    <header className="h-16 bg-[#050505] border-b border-gray-800/50 flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 text-blue-500">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 2L2 22h20L12 2z"/>
             <path d="M12 22V12"/>
             <path d="M12 12l-4 4"/>
             <path d="M12 12l4 4"/>
           </svg>
        </div>
        <span className="font-semibold text-white tracking-wide">AI ATS Resume Slayer</span>
      </Link>

      {/* Right Area */}
      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-4 mr-4">
           <div className="text-right">
             <div className="flex items-center gap-2 text-xs font-bold font-mono">
               <span className="text-blue-500">SLAY MODE ACTIVE</span>
               <span className="text-white">85% Match</span>
             </div>
             <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
               <div className="bg-blue-600 h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
             </div>
           </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors shadow-lg shadow-blue-600/20">
          Download PDF
        </button>

        <button className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-[#111]">
          <Bell className="w-4 h-4" />
        </button>
        
        <button className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-[#111]">
          <User className="w-4 h-4" />
        </button>
      </div>
      
    </header>
  );
}