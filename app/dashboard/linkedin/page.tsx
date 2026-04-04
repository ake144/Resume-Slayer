"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Sparkles, Copy, MessageSquare, RefreshCw, Briefcase, ChevronRight, UserPlus } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";

export default function LinkedInDMPage() {
  const { resumeText: storedResume, setResumeText: setStoredResume } = useResumeStore();
  const [formData, setFormData] = useState({
    resumeText: "",
    targetProfile: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDM, setGeneratedDM] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      setFormData(prev => ({ ...prev, resumeText: storedResume }));
      mounted.current = true;
    }
  }, [storedResume]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, resumeText: val });
    setStoredResume(val);
  };

  const handleGenerate = async () => {
    if (!formData.resumeText.trim() || !formData.targetProfile.trim()) {
      alert("Please provide both your profile/resume and the target's profile context.");
      return;
    }

    setIsGenerating(true);
    setGeneratedDM(null);

    try {
      const response = await fetch("/api/slayer/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedDM(data.dm);
      } else {
        alert("Failed to generate DM. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedDM) {
      navigator.clipboard.writeText(generatedDM);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
          LinkedIn Outbound DM
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Instantly draft a personalized, engaging LinkedIn direct message tailored for networking, prospecting, or recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-5">
          <div className="bg-[#0a0a0c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              1. Your Profile / Context
            </label>
            <textarea
              className="w-full bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste your LinkedIn intro, current role, or resume text here..."
              value={formData.resumeText}
              onChange={handleResumeChange}
            />
          </div>

          <div className="flex justify-center -my-3 relative z-10 w-full hover:scale-110 transition-transform cursor-pointer">
             <div className="bg-[#0a0a0e] border border-[rgba(255,255,255,0.05)] p-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-shadow">
               <ChevronRight className="w-5 h-5 text-gray-500 rotate-90 lg:rotate-0" />
             </div>
          </div>

          <div className="bg-[#0a0a0c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              <UserPlus className="w-4 h-4 mr-2 text-cyan-500" />
              2. Target Profile / Intent
            </label>
            <textarea
              className="w-full bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste the target person's headline, recent post, or your specific goal for outreach..."
              value={formData.targetProfile}
              onChange={(e) => setFormData({ ...formData, targetProfile: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.resumeText || !formData.targetProfile}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Drafting your Message...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                Generate Outbound Message
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="bg-[#0a0a0c] border border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col shadow-lg overflow-hidden lg:h-[750px]">
          <div className="p-5 border-b border-[rgba(255,255,255,0.05)] bg-[#111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white tracking-wide">Your Final Draft</h3>
            </div>
            {generatedDM && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                {copied ? <span className="text-blue-400">Copied!</span> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto w-full custom-scrollbar">
            {!generatedDM ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <MessageSquare className="w-16 h-16 opacity-10" />
                <p className="text-sm font-medium">Your generated LinkedIn DM will appear here.</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans bg-[#0c0c10] p-6 rounded-xl border border-[rgba(255,255,255,0.02)]">
                {generatedDM}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a3a;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
