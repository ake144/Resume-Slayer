'use client';


import { Star, CalendarCheck, CheckCircle2, MoreHorizontal, Zap, BarChart3, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { SlayType } from "@/utils/types";
import { getToken } from "@/utils/common";
import Link from "next/link";


export default function DashboardPage() {

  const [slays, setSlays] = useState<SlayType[]>([]);

  const token = getToken();
      
  const slaysData = async ()=>{
       const response = await fetch("/api/slayer", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
        if(response.ok){
          const data = await response.json();
          setSlays(data);
        }
         
  }


  useEffect(() => {
      slaysData();
    }, []);


  return (
    <div className="space-y-8 pb-12">
      
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Slayer</h1>
        <p className="text-gray-400 text-sm">
          Your current profile score is in the <span className="text-blue-400 font-semibold">top 2%</span> of applicants in your field.
        </p>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
       
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-6 right-6 text-blue-500">
             <Star className="w-5 h-5 fill-blue-500/20" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">Total Slays</p>
          <h2 className="text-4xl font-bold text-white mb-4">{slays.length}</h2>
          <div className="flex items-center gap-2 text-sm">
             <TrendingUp className="w-4 h-4 text-green-500" />
             <span className="text-green-500 font-medium">+12% from last month</span>
          </div>
        </div>

       
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-6 right-6 text-blue-500">
             <CalendarCheck className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">Interviews Landed</p>
          <h2 className="text-4xl font-bold text-white mb-4">12</h2>
          <div className="flex items-center gap-2 text-sm">
             <TrendingUp className="w-4 h-4 text-green-500" />
             <span className="text-green-500 font-medium">+5.2% conversion</span>
          </div>
        </div>

        {/* ATS Avg Score */}
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-6 right-6 text-blue-500">
             <CheckCircle2 className="w-5 h-5 fill-blue-500 text-black" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">ATS Avg Score</p>
          <h2 className="text-4xl font-bold text-white mb-4">94%</h2>
          <div className="flex items-center gap-2 text-sm">
             <TrendingUp className="w-4 h-4 text-green-500" />
             <span className="text-green-500 font-medium">+1.2% optimization</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Slays Section */}
        <div className="lg:col-span-2 bg-[#0a0a0c] border border-gray-800/50 rounded-2xl flex flex-col">
          <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
            <h3 className="font-bold text-lg">Recent Slays</h3>
            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">View all</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800/50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Job Title</th>
                  <th className="px-6 py-4 font-semibold">Company</th>
                  <th className="px-6 py-4 font-semibold">Match Score</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {slays.map((slay) => (
                  <Link href={`/slays/${slay.id}`} key={slay.id} className="block">
                <tr className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-medium text-white text-sm">{slay.jobTitle}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-400">{slay.company}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[98%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                      </div>
                      <span className="text-sm font-bold">{slay.atsScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                      Slayed
                    </span>
                  </td>
                </tr>
                </Link>
                ))}
               
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Promos & Skill Roadmap */}
        <div className="space-y-6">
          
          {/* Skill Roadmap Snapshot */}
          <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Skill Roadmap</h3>
              <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">React & Tailwind CSS</span>
                  <span className="text-blue-400 font-medium">95%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[95%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">System Architecture</span>
                  <span className="text-blue-400 font-medium">78%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[78%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">AI Prompt Engineering</span>
                  <span className="text-blue-400 font-medium">64%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[64%]"></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 bg-[#111] hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg border border-gray-700 transition-colors text-sm">
              Adjust Roadmap
            </button>
          </div>

          {/* Upgrade Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-4 right-4 text-white/20">
               <Star className="w-24 h-24 stroke-[0.5]" />
             </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Go Pro Max</h3>
              <p className="text-blue-100 text-sm mb-6 max-w-[200px] leading-relaxed">
                Get unlimited resume versions and direct AI recruiter chat access.
              </p>
              <button className="bg-white text-blue-700 hover:bg-gray-50 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-black/10">
                Upgrade Now
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}