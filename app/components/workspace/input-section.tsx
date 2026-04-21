"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, Zap, Target, Sparkles, ArrowRight, Info, RefreshCw } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { useResumeStore } from "@/store/useResumeStore";

export function InputSection({ token }: { token: string }) {
  const [activeTab, setActiveTab] = useState("paste");
  const { resumeText: storedResume, setResumeText: setStoredResume } = useResumeStore();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobURL, setJobURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      setResumeText(storedResume);
      mounted.current = true;
    }
  }, [storedResume]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    setStoredResume(e.target.value);
  };

  const submitData = async () => {
    if (!resumeText) {
      alert("Please paste your resume text first!");
      return;
    }

    if (!jobDescription && !jobURL) {
      alert("Please provide a job description or job URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await Axios.post("/api/slayer", {
        resumeText,
        jobDescription,
        jobURL
      }, {
        headers: {
          'Authorization': `${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data;
        const slayId = data?.slayId;
        if (slayId) {
          window.location.href = `/dashboard/slays/${slayId}`;
        } else {
          window.location.href = `/dashboard`;
        }
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data", error);
      alert("Integration request failed. Make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Optimization
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black tracking-tight"
            >
              Slay Mode<span className="text-blue-600">.</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Online</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left Column - Input */}
          <div className="lg:col-span-7 space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Step 1: Resume */}
              <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <FileText className="w-32 h-32" />
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold">1. Your Resume</h3>
                  </div>

                  <div className="flex bg-black p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => setActiveTab("paste")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "paste" ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      Paste
                    </button>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "upload" ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "paste" ? (
                    <motion.div
                      key="paste"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                      <textarea
                        value={resumeText}
                        onChange={handleResumeChange}
                        className="w-full h-64 bg-black/50 border border-white/10 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none placeholder:text-gray-700"
                        placeholder="Paste your current resume content here..."
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="border-2 border-dashed border-white/10 hover:border-blue-500/30 bg-black/50 rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer group/upload"
                    >
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover/upload:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-400 mb-2">Drag and drop your PDF here, or <span className="text-blue-500 font-bold">browse files</span></p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Supports PDF, DOCX (Max 5MB)</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Target Job */}
              <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Target className="w-32 h-32" />
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                    <Target className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold">2. Target Job</h3>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-gray-300 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all placeholder:text-gray-700"
                      placeholder="Paste Job URL (LinkedIn, Greenhouse, etc.)"
                      value={jobURL}
                      onChange={(e) => setJobURL(e.target.value)}
                    />
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink-0 mx-6 text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">OR</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <textarea
                    className="w-full h-40 bg-black/50 border border-white/10 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all resize-none placeholder:text-gray-700"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={submitData}
                disabled={isSubmitting}
                className="w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isSubmitting ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Zap className="w-6 h-6 fill-white" />
                )}
                {isSubmitting ? "Slaying in Progress..." : "Slay My Resume"}
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-28 space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black leading-tight">The Unfair Advantage.</h3>
                    <p className="text-blue-100/80 leading-relaxed">
                      Our agentic AI doesn't just swap keywords. It deeply analyzes the employer's pain points and restructures your entire narrative to position you as the perfect solution.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    {[
                      { title: "Deep Job Analysis", desc: "Extracting hidden requirements and intent." },
                      { title: "ATS Optimization", desc: "Bypassing filters with perfect parsing structure." },
                      { title: "Skill Gap Roadmap", desc: "Actionable plans to bridge missing expertise." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-black border border-white/20">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{step.title}</h4>
                          <p className="text-xs text-blue-100/60">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Free Trial</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">No credit card required</p>
                  </div>
                </div>
                <Info className="w-5 h-5 text-gray-700" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}