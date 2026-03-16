'use client';

import { Star, CalendarCheck, CheckCircle2, MoreHorizontal, Zap, BarChart3, TrendingUp, Briefcase } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { SlayType } from "@/utils/types";
import { getToken } from "@/utils/common";
import Link from "next/link";

export default function DashboardPage() {
  const [slays, setSlays] = useState<SlayType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlays = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/slayer", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSlays(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch slays:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlays();
  }, [fetchSlays]);

  // Derived stats
  const avgScor = slays.length > 0
    ? Math.round(slays.reduce((acc, curr) => acc + parseInt(curr.atsScore || "0"), 0) / slays.length)
    : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back, Slayer ⚔️</h1>
        <p className="text-gray-400 text-sm">
          Your current profile score is in the <span className="text-blue-400 font-semibold">top 2%</span> of applicants in your field.
        </p>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Slays */}
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-6 right-6 text-blue-500 bg-blue-500/10 p-2 rounded-xl">
             <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">Total Slays</p>
          <h2 className="text-4xl font-bold text-white mb-4">{loading ? "..." : slays.length}</h2>
          <div className="flex items-center gap-2 text-sm">
             <TrendingUp className="w-4 h-4 text-green-500" />
             <span className="text-green-500 font-medium">Active applications</span>
          </div>
        </div>

        {/* Action Taken */}
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="absolute top-6 right-6 text-purple-500 bg-purple-500/10 p-2 rounded-xl">
             <CalendarCheck className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">Interviews Landed</p>
          <h2 className="text-4xl font-bold text-white mb-4">3</h2>
          <div className="flex items-center gap-2 text-sm">
             <TrendingUp className="w-4 h-4 text-green-500" />
             <span className="text-green-500 font-medium">+1 from last week</span>
          </div>
        </div>

        {/* ATS Avg Score */}
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-colors">
          <div className="absolute top-6 right-6 text-green-500 bg-green-500/10 p-2 rounded-xl">
             <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">ATS Avg Score</p>
          <h2 className="text-4xl font-bold text-white mb-4">{loading ? "..." : (avgScor > 0 ? `${avgScor}%` : "0%")}</h2>
          <div className="flex items-center gap-2 text-sm">
             <TrendingUp className="w-4 h-4 text-green-500" />
             <span className="text-green-500 font-medium">Optimization high</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Slays Section */}
        <div className="lg:col-span-2 bg-[#0a0a0c] border border-gray-800/50 rounded-2xl flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Recent Slays</h3>
            <Link href="/dashboard/history" className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
              View all
            </Link>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">Loading history...</div>
            ) : slays.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="text-gray-300 font-semibold mb-2">No slays yet</h4>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">You haven't optimized any resumes. Head to the workspace to start slaying ATS filters.</p>
                <Link href="/workspace" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors">
                  Create First Slay
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800/50 text-xs text-gray-500 uppercase tracking-wider bg-[#111]/50">
                    <th className="px-6 py-4 font-semibold">Role & URL</th>
                    <th className="px-6 py-4 font-semibold">Match Score</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {slays.slice(0, 5).map((slay) => (
                    <tr key={slay.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white text-sm truncate max-w-[200px]">{slay.jobTitle}</p>
                        {slay.jobUrl && slay.jobUrl !== "Unknown URL" && (
                          <a href={slay.jobUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[200px] block mt-1">
                            {slay.jobUrl}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
                              style={{ width: slay.atsScore || '0%' }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-200">{slay.atsScore || '0%'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {slay.createdAt ? new Date(slay.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/slays/${slay.id}`} className="text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column - Promos & Skill Roadmap */}
        <div className="space-y-6">
          
          {/* Skill Roadmap Snapshot */}
          <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg text-white">Skill Snapshot</h3>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-medium">React & Tailwind CSS</span>
                  <span className="text-blue-400 font-bold">95%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[95%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-medium">System Architecture</span>
                  <span className="text-blue-400 font-bold">78%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[78%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-medium">Cloud & DevOps</span>
                  <span className="text-blue-400 font-bold">64%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[64%]"></div>
                </div>
              </div>
            </div>

            <Link href="/dashboard/roadmap" className="flex items-center justify-center w-full mt-8 bg-[#111] hover:bg-gray-800 text-white font-medium py-3 rounded-xl border border-gray-800 transition-colors text-sm">
              View Full Roadmap
            </Link>
          </div>

          {/* Upgrade Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 relative overflow-hidden group">
            {/* Decor */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
             <div className="absolute bottom-4 right-4 text-white/20 group-hover:rotate-12 transition-transform duration-700">
               <Star className="w-24 h-24 stroke-[0.5]" />
             </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">
                <Zap className="w-3 h-3 fill-white" /> Pro Plan
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Slay Beyond <br/>Limits</h3>
              <p className="text-blue-100 text-sm mb-6 max-w-[200px] leading-relaxed">
                Unlock unlimited ATS checks, auto-apply features, and recruiter AI chats.
              </p>
              <button className="bg-white text-blue-700 hover:bg-gray-50 border-none font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xl shadow-black/10 hover:scale-105 active:scale-95">
                Go Pro Max
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}