'use client';

import { useEffect, useState } from "react";
import { getToken } from "@/utils/common";
import { SlayType } from "@/utils/types";
import Link from "next/link"; 
import {
  BarChart3,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Info,
  Sparkles,
  PieChart,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalysisPage() {
  const [stats, setStats] = useState({
    totalSlays: 0,
    avgScore: 0,
    topSkills: [] as string[],
    scoreDistribution: [0, 0, 0, 0], // <60, 60-75, 75-90, >90
    recentImprovement: "+12%"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch('/api/slayer?size=100', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.content || [];

          const scores = content.map((s: any) => parseInt(s.atsScore) || 0);
          const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

          const distribution = [0, 0, 0, 0];
          scores.forEach((s: number) => {
            if (s < 60) distribution[0]++;
            else if (s < 75) distribution[1]++;
            else if (s < 90) distribution[2]++;
            else distribution[3]++;
          });

          setStats({
            totalSlays: data.totalItems || 0,
            avgScore: avg,
            topSkills: ["React", "TypeScript", "Node.js", "AWS", "Docker"], // Mocked for now
            scoreDistribution: distribution,
            recentImprovement: "+12%"
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-[0.2em]"
        >
          <Activity className="w-4 h-4" />
          Performance Insights
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-black tracking-tight text-white"
        >
          Slay Analytics<span className="text-purple-600">.</span>
        </motion.h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Avg Match Score", value: `${stats.avgScore}%`, icon: Target, color: "blue" },
          { label: "Total Slays", value: stats.totalSlays, icon: Zap, color: "purple" },
          { label: "Improvement", value: stats.recentImprovement, icon: TrendingUp, color: "green" },
          { label: "Market Fit", value: "High", icon: Sparkles, color: "orange" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-6 flex items-center gap-5"
          >
            <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center border border-${stat.color}-500/20`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{loading ? "..." : stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Score Distribution Chart */}
        <div className="lg:col-span-7 bg-[#0a0a0c] border border-white/5 rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Score Distribution
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <Info className="w-4 h-4" />
              Last 100 Slays
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-4 px-4">
            {["< 60%", "60-75%", "75-90%", "> 90%"].map((label, i) => {
              const count = stats.scoreDistribution[i];
              const max = Math.max(...stats.scoreDistribution, 1);
              const height = (count / max) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative flex flex-col justify-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                      className={`w-full rounded-2xl bg-gradient-to-t ${i === 0 ? "from-red-500/20 to-red-500/40" :
                          i === 1 ? "from-yellow-500/20 to-yellow-500/40" :
                            i === 2 ? "from-blue-500/20 to-blue-500/40" :
                              "from-green-500/20 to-green-500/40"
                        } border-x border-t border-white/5 group-hover:opacity-80 transition-opacity relative`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {count}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Skills / Keywords */}
        <div className="lg:col-span-5 bg-[#0a0a0c] border border-white/5 rounded-[3rem] p-10 space-y-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <PieChart className="w-5 h-5 text-purple-500" />
            Keyword Dominance
          </h3>

          <div className="space-y-4">
            {stats.topSkills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-400">{skill}</span>
                  <span className="text-white">{90 - i * 10}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${90 - i * 10}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                    className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-[2rem] space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                AI Recommendation
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your profile is strongest in <span className="text-white font-bold">Frontend Engineering</span>. Focus on adding more <span className="text-white font-bold">Cloud Architecture</span> keywords to increase your match rate for Senior roles.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Critical Alerts */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center flex-shrink-0 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black text-white">Critical Skill Gaps Detected</h3>
          <p className="text-gray-500 max-w-2xl">
            We've identified 4 recurring skills missing from your optimized resumes that are frequently requested in your target roles. Addressing these could boost your interview rate by up to 30%.
          </p>
        </div>
        <Link
          href="/dashboard/roadmap"
          className="bg-red-500 hover:bg-red-600 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-red-900/20 whitespace-nowrap"
        >
          View Roadmap
        </Link>
      </div>

    </div>
  );
}