import { Bell, BookOpen, Code2, LineChart, CheckCircle, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 space-y-12 pb-24">
      
      {/* Header Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="bg-blue-900/50 text-blue-400 text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase border border-blue-500/20">
            Active Mission
          </span>
          <span className="text-gray-500 text-sm font-medium">Level: Intermediate</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Mission: Slay the Gap - Python Proficiency
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
          A 4-week intensive roadmap designed to bridge the technical skills identified by our AI audit. Master Python and automate your path to hire.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-7 relative">
           
           {/* Timeline Line */}
           <div className="absolute top-8 bottom-12 left-8 w-px bg-gray-800 hidden sm:block z-0" />

           <div className="space-y-10 relative z-10">
              
              {/* Week 1 */}
              <div className="flex gap-6 sm:gap-8 group">
                <div className="flex-shrink-0 flex sm:block flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] z-10 relative relative">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="w-px h-full bg-gray-800 sm:hidden mt-4" />
                </div>
                <div className="pt-2 pb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">Week 1: Basics</h2>
                    <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20 uppercase tracking-widest">Completed</span>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    Master syntax, variables, data structures, and fundamental loops.
                  </p>
                  <button className="text-blue-500 font-medium text-sm flex items-center gap-1 hover:text-blue-400 transition-colors">
                    View Module <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Week 2 */}
              <div className="flex gap-6 sm:gap-8 group">
                <div className="flex-shrink-0 flex sm:block flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] z-10 relative">
                     <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                  </div>
                  <div className="w-px h-full bg-blue-600/30 sm:hidden mt-4" />
                </div>
                <div className="pt-2 pb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">Week 2: Simple Automation Scripts</h2>
                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-widest">In Progress</span>
                  </div>
                  <p className="text-gray-400 mb-5 text-sm leading-relaxed">
                    Build scripts to automate repetitive tasks and file management systems.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[65%] rounded-full shadow-[0_0_5px_rgba(37,99,235,0.5)]"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">65% Done</span>
                  </div>
                </div>
              </div>

              {/* Week 3 */}
              <div className="flex gap-6 sm:gap-8 group">
                <div className="flex-shrink-0 flex sm:block flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center z-10 relative group-hover:border-gray-700 transition-colors">
                     <LineChart className="w-7 h-7 text-gray-500" />
                  </div>
                  <div className="w-px h-full bg-gray-800 sm:hidden mt-4" />
                </div>
                <div className="pt-2 pb-6 opacity-60">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">Week 3: Data Visualization Project</h2>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    Analyze complex datasets using Pandas and create visual insights with Matplotlib.
                  </p>
                  <span className="inline-block bg-[#1a1a1a] text-gray-400 px-4 py-1.5 rounded-lg text-xs font-medium border border-gray-800">Locked</span>
                </div>
              </div>

              {/* Week 4 */}
              <div className="flex gap-6 sm:gap-8 group">
                <div className="flex-shrink-0 flex sm:block flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center z-10 relative group-hover:border-gray-700 transition-colors">
                     <CheckCircle className="w-7 h-7 text-gray-500" />
                  </div>
                </div>
                <div className="pt-2 opacity-60">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">Week 4: Update Resume & Apply</h2>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    Optimize your ATS profile with new projects and start strategic applications.
                  </p>
                  <span className="inline-block bg-[#1a1a1a] text-gray-400 px-4 py-1.5 rounded-lg text-xs font-medium border border-gray-800">Locked</span>
                </div>
              </div>

           </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Curated Courses Widget */}
          <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
               <BookOpen className="w-5 h-5 text-blue-500" />
               Curated Courses
            </h3>
            
            <div className="space-y-4">
              {/* Course 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#111] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-gray-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                    <Code2 className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">Python for Automation</h4>
                    <p className="text-xs text-gray-500">Slayer Academy • 4h 20m</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              
              {/* Course 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#111] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-gray-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                    <LineChart className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">Mastering Pandas</h4>
                    <p className="text-xs text-gray-500">Data Science Pro • 6h 15m</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>

              {/* Course 3 */}
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#111] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-gray-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                    <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">ATS Keyword Strategy</h4>
                    <p className="text-xs text-gray-500">Resume Expert • 2h 25m</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            <button className="w-full mt-4 bg-[#111] hover:bg-[#1a1a1a] border border-gray-800 text-sm font-medium py-3 rounded-xl transition-colors">
              Explore All Courses
            </button>
          </div>

          {/* Tip Card */}
          <div className="bg-blue-600/90 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute -bottom-8 -right-8 opacity-20">
               <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 14.5V10C18 6.9 15.6 4.3 12.5 3.5V3C12.5 2.2 11.8 1.5 11 1.5C10.2 1.5 9.5 2.2 9.5 3V3.5C6.4 4.3 4 6.9 4 10V14.5L2 16.5V17.5H22V16.5L18 14.5Z" />
               </svg>
             </div>
             
             <div className="relative z-10">
               <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                 <Zap className="w-4 h-4 fill-white" />
                 Slayer Tip
               </h3>
               <p className="text-blue-50 text-sm leading-relaxed mb-6">
                 Most ATS systems look for Python libraries like <strong className="text-white">NumPy</strong> and <strong className="text-white">Pandas</strong> specifically under "Technical Skills". Make sure to link your Week 2 scripts to your GitHub profile and add the URL to your header!
               </p>
               <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-lg">
                 Learn More
               </button>
             </div>
          </div>

          {/* Progress Card */}
          <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6">
             <h3 className="font-bold mb-4">Your Progress</h3>
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">Total Missions Completed</span>
               <span className="text-blue-500 font-bold">12/40</span>
             </div>
             <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
               <div className="bg-blue-600 h-full w-[30%]"></div>
             </div>
             <p className="text-center text-xs text-gray-500 italic">"Consistency is the enemy of the gap."</p>
          </div>

        </div>
      </div>
    </div>
  );
}