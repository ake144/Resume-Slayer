'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Map,
  Target,
  Zap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { JobMatchAnalysis } from "@/utils/types";

export default function RoadmapPage() {
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const list = await api.listApplications(0, 1);
        const latest = list.content?.[0];
        if (latest) {
          const detail = await api.getApplication(latest.id);
          setAnalysis(detail.match_analysis);
          setJobTitle(detail.job_title);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

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
          {jobTitle && (
            <p className="text-gray-500 font-medium">Based on your most recent slay: <span className="text-white">{jobTitle}</span></p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : !analysis ? (
        <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-16 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 mx-auto">
            <Map className="w-10 h-10 text-gray-700" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">No roadmap yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Generate a slay first so we can identify your skill gaps and tailoring recommendations.
            </p>
          </div>
          <Link href="/dashboard/workspace" className="inline-block bg-white text-black font-black px-8 py-3 rounded-xl transition-all hover:bg-gray-200">
            Start Slaying
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Tailoring Recommendations */}
          <div className="lg:col-span-8 space-y-8 relative">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" />
              Tailoring Recommendations
            </h3>
            {analysis.tailoring_recommendations.length === 0 ? (
              <p className="text-gray-500">No specific recommendations - your resume is well-aligned with this role.</p>
            ) : (
              analysis.tailoring_recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-6 flex gap-5 hover:border-orange-500/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-500 font-black text-sm">{i + 1}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{rec}</p>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar Insights */}
          <div className="lg:col-span-4 space-y-8">

            <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-900/20 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20">
                  <Target className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black leading-tight">Match Score</h3>
                  <p className="text-orange-100/80 text-sm leading-relaxed">{analysis.overall_verdict}</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-black">{analysis.match_score}%</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Current</p>
                  </div>
                  <ArrowRight className="w-8 h-8 opacity-40" />
                  <div className="text-center">
                    <p className="text-2xl font-black">{analysis.confidence_level}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Confidence</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Skill Gaps
              </h3>
              {analysis.skill_gaps.length === 0 ? (
                <p className="text-sm text-gray-500">No significant gaps identified.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.skill_gaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300">{gap}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                Strong Matches
              </div>
              <ul className="space-y-2">
                {analysis.strong_matches.map((match, i) => (
                  <li key={i} className="text-sm text-gray-400 leading-relaxed">{match}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
