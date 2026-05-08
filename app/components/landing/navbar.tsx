import Link from "next/link";
import { Zap, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-24 bg-black/60 backdrop-blur-2xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl text-white tracking-tight leading-none">SLAYER<span className="text-blue-600">.</span></span>
            <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mt-1">AI ATS Optimization</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-gray-400">
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#success" className="hover:text-white transition-colors">Success</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login" className="hidden sm:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard/workspace" className="inline-block bg-white text-black hover:bg-gray-200 px-4 py-2 md:px-6 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5">
            Start Slaying
          </Link>
        </div>
      </div>
    </nav>
  );
}
