"use client";

import { motion } from "framer-motion";
import { Settings, Map, SplitSquareHorizontal, Download } from "lucide-react";

const features = [
  {
    icon: <Settings className="w-5 h-5 text-blue-400" />,
    title: "ATS Optimization",
    description: "Bypass complex screening filters with keyword-optimized templates that rank #1 in ranking algorithms."
  },
  {
    icon: <Map className="w-5 h-5 text-blue-400" />,
    title: "Skill Gap Roadmaps",
    description: "Identify missing skills and get a step-by-step plan to bridge the gap and become the perfect candidate."
  },
  {
    icon: <SplitSquareHorizontal className="w-5 h-5 text-blue-400" />,
    title: "Split Comparison",
    description: "Compare your resume versions side-by-side with real-time scoring to see exactly what changed."
  },
  {
    icon: <Download className="w-5 h-5 text-blue-400" />,
    title: "One-Click Export",
    description: "Professional PDF and Word exports compatible with all hiring portals and automated readers."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[#050505] text-white" id="features">
      
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-b border-gray-800 pb-16">
        <div>
          <p className="text-sm text-gray-400 font-semibold mb-2">Success Rate</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">98%</span>
            <span className="text-green-500 font-medium text-sm mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +25%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-semibold mb-2">Interview Boost</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">3x More</span>
            <span className="text-green-500 font-medium text-sm mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +300%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-semibold mb-2">ATS Bypass</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">100%</span>
            <span className="text-green-500 font-medium text-sm mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +15%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-semibold mb-2">Avg. Salary Jump</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">$24k</span>
            <span className="text-green-500 font-medium text-sm mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +18%
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Engineered for Elite Candidates
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-16"
        >
          Our advanced AI algorithms deconstruct job descriptions to ensure your profile stands out to both robots and recruiters.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 hover:bg-[#111] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center mb-6 border border-blue-500/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Logos */}
      <div className="max-w-5xl mx-auto px-6 mt-32 text-center border-t border-gray-800 pt-16">
        <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">
          Trusted by professionals at top tech companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
          <div className="text-2xl font-bold flex items-center gap-2"><div className="w-6 h-6 rounded bg-current" /> Google</div>
          <div className="text-2xl font-bold flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-current" /> Amazon</div>
          <div className="text-2xl font-bold flex items-center gap-2"><div className="w-6 h-6 rotate-45 bg-current" /> Microsoft</div>
          <div className="text-2xl font-bold flex items-center gap-2"><div className="w-8 h-4 rounded-full bg-current" /> Meta</div>
        </div>
      </div>
    </section>
  );
}