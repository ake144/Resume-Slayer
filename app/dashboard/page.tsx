'use client';

import { useEffect, useState } from "react";
import { getToken } from "@/utils/common";
import { SlayType } from "@/utils/types";
import Link from "next/link";
import {
  Zap,
  Target,
  History,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Briefcase,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useUserInfoStore } from "@/store/userInfo";



export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSlays: 0,
    avgScore: 0,
    recentSlays: [] as SlayType[]
  });
  const [loading, setLoading] = useState(true);
  const token = getToken();

  const fetchUserInfo = async ()=>{
    try{
   const res = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if(res.status === 200){
      const data = res.data;
      console.log("User info fetched successfully:", data);
      useUserInfoStore.setState({ id: data.id, name: data.name, email: data.email, role: data.role, avatarUrl: data?.avatarUrl });
    }
    else{
      console.error("Failed to fetch user info, status:", res.status);
    }
    }
    catch(e){
      console.error("Error fetching user info:", e);
    }
  }
   
 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
      
        if (!token) return;

        const res = await fetch('/api/slayer?size=5', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.content || [];

          // Calculate average score
          const scores = content.map((s: any) => parseInt(s.atsScore) || 0);
          const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

          setStats({
            totalSlays: data.totalItems || 0,
            avgScore: avg,
            recentSlays: content
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-4 h-4" />
            Welcome Back, Slayer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white"
          >
            Your Command Center<span className="text-blue-600">.</span>
          </motion.h1>
        </div>

        <Link
          href="/dashboard/workspace"
          className="group relative overflow-hidden bg-white text-black font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 flex items-center justify-center gap-3 w-full md:w-auto text-center"
        >
          <Zap className="w-5 h-5 fill-black" />
          Start New Slay
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Optimizations", value: stats.totalSlays, icon: History, color: "blue" },
          { label: "Average ATS Score", value: `${stats.avgScore}%`, icon: Target, color: "green" },
          { label: "Success Rate", value: "94%", icon: TrendingUp, color: "purple" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-white">{loading ? "..." : stat.value}</p>
              </div>
              <div className={`w-14 h-14 bg-${stat.color}-500/10 rounded-2xl flex items-center justify-center border border-${stat.color}-500/20`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-500`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Slays
            </h3>
            <Link href="/dashboard/history" className="text-sm font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse"></div>
              ))
            ) : stats.recentSlays.length === 0 ? (
              <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-4">
                <p className="text-gray-500 font-medium">No recent activity found.</p>
                <Link href="/dashboard/workspace" className="text-blue-500 font-bold hover:underline">Start your first slay</Link>
              </div>
            ) : (
              stats.recentSlays.map((slay, i) => (
                <motion.div
                  key={slay.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.02] transition-all group cursor-pointer"
                  onClick={() => window.location.href = `/dashboard/slays/${slay.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-colors">
                        <FileText className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{slay.jobTitle}</h4>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(slay.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">ATS Score</p>
                        <p className={`text-lg font-black ${parseInt(slay.atsScore) >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {slay.atsScore}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                        <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black leading-tight">Pro Tip: Cover Letters</h3>
                <p className="text-indigo-100/70 text-sm leading-relaxed">
                  Did you know that slayed resumes with matching cover letters have a 45% higher response rate?
                </p>
              </div>
              <button className="w-full bg-white text-indigo-600 font-black py-3 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                Generate One Now
              </button>
            </div>
          </div>

          <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Next Steps</h3>
            <div className="space-y-4">
              {[
                { label: "Complete your profile", icon: CheckCircle2, done: true },
                { label: "Optimize 3 resumes", icon: Zap, done: stats.totalSlays >= 3 },
                { label: "Generate a roadmap", icon: Target, done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.done ? 'text-green-500' : 'text-gray-700'}`} />
                    <span className={`text-sm font-bold ${item.done ? 'text-gray-400 line-through' : 'text-white'}`}>{item.label}</span>
                  </div>
                  {!item.done && <ChevronRight className="w-4 h-4 text-gray-700" />}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}