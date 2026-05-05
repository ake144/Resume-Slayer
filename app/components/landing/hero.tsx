"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden text-white">
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
          <div className="flex items-center justify-center flex-col gap-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            NEW: AI ENHANCED MATCHING
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            <LayoutTextFlip
              text="Get an"
              words={["unfair advantage", "the edge", "ahead of the pack", "competitive edge"]}
            />
              In<br />Your Job Hunt
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-xl"
          >
            AI-powered resume optimization designed to bypass ATS filters and land you 3x more interviews instantly. Stop being ignored by algorithms.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <a href="/dashboard/workspace" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20">
              Start Slaying for Free
            </a>
            <button className="bg-transparent border border-gray-700 hover:border-gray-500 text-white px-8 py-4 rounded-full font-bold transition-all">
              View Sample Resumes
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mt-6 text-sm text-gray-500"
          >
            <div className="flex -space-x-3">
              {['JD', 'ML', 'TS', '+2k'].map((initials, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black ${
                    i === 3 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p>Joined by 2,400+ tech professionals this week</p>
          </motion.div>
        </div>

          </>
        }
      >
        <img
          src="/dash1.png"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>

      {/* <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
       
        <div className="flex flex-col gap-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            NEW: GPT-4O ENHANCED MATCHING
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Get an <span className="text-blue-500 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Unfair<br />Advantage</span> In<br />Your Job Hunt
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-xl"
          >
            AI-powered resume optimization designed to bypass ATS filters and land you 3x more interviews instantly. Stop being ignored by algorithms.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <a href="/dashboard/workspace" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20">
              Start Slaying for Free
            </a>
            <button className="bg-transparent border border-gray-700 hover:border-gray-500 text-white px-8 py-4 rounded-full font-bold transition-all">
              View Sample Resumes
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mt-6 text-sm text-gray-500"
          >
            <div className="flex -space-x-3">
              {['JD', 'ML', 'TS', '+2k'].map((initials, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black ${
                    i === 3 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p>Joined by 2,400+ tech professionals this week</p>
          </motion.div>
        </div>

     
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative lg:h-[600px] w-full flex items-center justify-center mt-12 lg:mt-0"
        >
       
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />
          
          <div className="relative group">
     
            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />

            <div className="relative w-full max-w-4xl aspect-video bg-[#0a0a0a] rounded-lg shadow-2xl overflow-hidden border border-gray-800 p-0 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              
         
              <Image
                src="/dash1.png"
                alt="Dashboard Showcase"
                className="w-full h-full object-cover rounded-lg"
                width={1200} // Increased base resolution numbers for wide layout
                height={675}
              />
              
          
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-[#111]/90 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-6"
              >
                <div>
                  <p className="text-blue-500 text-xs font-bold tracking-wider mb-1">ATS COMPATIBILITY SCORE</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">98</span>
                    <span className="text-xl text-gray-500 font-bold">/100</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div> */}
    </section>
  );
}