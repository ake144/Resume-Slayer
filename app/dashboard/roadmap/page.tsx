'use client';

import { useEffect, useState } from "react";
import { getToken } from "@/utils/common";
import {
  Map,
  Target,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BookOpen,
  Code2,
  Globe,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = getToken();
        if (!token) return;

        // Fetch the most recent slay with a roadmap
        const res = await fetch('/api/slayer?size=100', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.content || [];

          // Find the first slay that has roadmap data
          // Note: The /api/slayer list might not include full roadmap text, 
          // so we might need to fetch the detail if needed.
          // For now, let's assume we find one or show a default state.
          const slayWithRoadmap = content.find((s: any) => s.trapsFixed); // Using trapsFixed as a proxy for "has optimization"

          if (slayWithRoadmap) {
            // Fetch detail to get full roadmap
            const detailRes = await fetch(`/api/slayer/${slayWithRoadmap.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (detailRes.ok) {
              const detail = await detailRes.json();
              setRoadmap(detail.roadmap);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const defaultRoadmap = [
    { week: "Week 1", title: "Core Fundamentals", desc: "Master advanced TypeScript patterns and React performance optimization.", status: "completed" },
    { week: "Week 2", title: "Cloud Architecture", desc: "Deep dive into AWS Lambda, S3, and DynamoDB integration.", status: "current" },
    { week: "Week 3", title: "System Design", desc: "Learn to design scalable distributed systems and microservices.", status: "upcoming" },
    { week: "Week 4", title: "DevOps & CI/CD", desc: "Setting up automated pipelines with GitHub Actions and Docker.", status: "upcoming" }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-[0.2em]"
          >
            <Map className="w-4 h-4" />
            Personalized Growth Path
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white"
          >
            Skill Roadmap<span className="text-orange-600">.</span>
          </motion.h1>
        </div>

        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-black px-6 py-3 rounded-xl transition-all border border-white/10">
          <RefreshCw className="w-4 h-4" />
          Regenerate Path
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Timeline View */}
        <div className="lg:col-span-8 space-y-12 relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500 via-orange-500/20 to-transparent"></div>

          {(roadmap?.roadMapText ? defaultRoadmap : defaultRoadmap).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="relative pl-20 group"
            >
              <div className={`absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-[#050505] z-10 transition-all duration-500 ${step.status === 'completed' ? 'bg-green-500 text-white' :
                  step.status === 'current' ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110' :
                    'bg-[#0a0a0c] text-gray-700 border-white/5'
                }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>

              <div className={`bg-[#0a0a0c] border rounded-[2.5rem] p-8 transition-all duration-500 ${step.status === 'current' ? 'border-orange-500/30 bg-orange-500/[0.02]' : 'border-white/5 hover:border-white/10'
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.status === 'completed' ? 'text-green-500' :
                      step.status === 'current' ? 'text-orange-500' :
                        'text-gray-600'
                    }`}>
                    {step.week}
                  </span>
                  {step.status === 'current' && (
                    <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full border border-orange-500/20 uppercase tracking-widest">
                      In Progress
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {step.desc}
                </p>

                <div className="flex flex-wrap gap-3">
                  {["Course", "Project", "Reading"].map((tag, j) => (
                    <div key={j} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <BookOpen className="w-3 h-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">

          <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-900/20 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20">
                <Target className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black leading-tight">The Goal.</h3>
                <p className="text-orange-100/80 leading-relaxed">
                  By completing this roadmap, you'll bridge the gap between your current skills and the requirements for <span className="text-white font-bold">Senior Software Engineer</span> roles.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-black">85%</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Readiness</p>
                </div>
                <ArrowRight className="w-8 h-8 opacity-40" />
                <div className="text-center">
                  <p className="text-2xl font-black">100%</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Target</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Recommended Resources</h3>
            <div className="space-y-4">
              {[
                { title: "Advanced React Patterns", provider: "Frontend Masters", icon: Code2 },
                { title: "AWS Solutions Architect", provider: "A Cloud Guru", icon: Globe },
                { title: "System Design Interview", provider: "ByteByteGo", icon: Target }
              ].map((res, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-orange-500/30 transition-colors">
                    <res.icon className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{res.title}</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">{res.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Slayer Insight
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Users who follow their personalized roadmap see a <span className="text-white font-bold">3x increase</span> in interview invitations within 30 days.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}