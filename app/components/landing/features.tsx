"use client";

import { motion } from "framer-motion";
import { Settings, Map, FileText, Download, Target, Zap, Sparkles, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Settings className="w-6 h-6 text-blue-500" />,
    title: "ATS Optimization",
    description: "Bypass complex screening filters with keyword-optimized templates that rank #1 in hiring algorithms."
  },
  {
    icon: <Map className="w-6 h-6 text-orange-500" />,
    title: "Skill Gap Roadmaps",
    description: "Identify missing skills and get a step-by-step actionable plan to bridge the gap for your target role."
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-500" />,
    title: "Cover Letter Engine",
    description: "Generate high-converting, tailored cover letters that perfectly align with the job description in seconds."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
    title: "Trap Detection",
    description: "Automatically identify and fix common resume 'traps' that cause automatic rejections by ATS systems."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    title: "AI Resume Builder",
    description: "Create a beautiful, tech-focused resume from scratch in minutes using our AI-driven intelligent builder.",
    comingSoon: true
  },
  {
    icon: <Target className="w-6 h-6 text-cyan-500" />,
    title: "1-Click Auto Apply",
    description: "Instantly tailor your existing resume to specific job postings and submit applications with a single click.",
    comingSoon: true
  }
];

export function Features() {
  return (
    <section className="py-32 bg-[#050505] text-white" id="features">

     
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-40 border-b border-white/5 pb-20">
        {[
          { label: "Success Rate", value: "98%", boost: "+25%" },
          { label: "Interview Boost", value: "3x More", boost: "+300%" },
          { label: "ATS Bypass", value: "100%", boost: "+15%" },
          { label: "Avg. Salary Jump", value: "$24k", boost: "+18%" }
        ].map((stat, i) => (
          <div key={i} className="space-y-2">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black tracking-tight">{stat.value}</span>
              <span className="text-green-500 font-bold text-xs mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.boost}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]"
          >
            Engineered for Elite Candidates
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight"
          >
            The Slayer Advantage<span className="text-blue-600">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Our advanced AI algorithms deconstruct job descriptions to ensure your profile stands out to both robots and recruiters.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/2 transition-all group relative overflow-hidden flex flex-col"
            >
              {feature.comingSoon && (
                <div className="absolute top-8 right-8">
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-40 text-center border-t border-white/5 pt-20">
        <p className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase mb-12">
          Trusted by professionals at top tech companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-16 opacity-20 grayscale hover:opacity-40 transition-opacity duration-700">
          <div className="text-3xl font-black flex items-center gap-3">GOOGLE</div>
          <div className="text-3xl font-black flex items-center gap-3">AMAZON</div>
          <div className="text-3xl font-black flex items-center gap-3">MICROSOFT</div>
          <div className="text-3xl font-black flex items-center gap-3">META</div>
          <div className="text-3xl font-black flex items-center gap-3">APPLE</div>
        </div>
      </div>
    </section>
  );
}

import { TrendingUp } from "lucide-react";