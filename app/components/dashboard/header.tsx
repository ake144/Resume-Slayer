import { Search, Bell } from "lucide-react";
import Image from "next/image";

export function Header() {
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
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-800/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight">Alex Slayer</p>
            <p className="text-xs text-gray-500">Product Designer</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center p-0.5">
             <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-bold overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </div>
      
    </header>
  );
}