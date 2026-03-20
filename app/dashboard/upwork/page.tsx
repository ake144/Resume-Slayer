"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Mail, RefreshCw, Briefcase, ChevronRight } from "lucide-react";

export default function UpworkProposalPage() {
  const [formData, setFormData] = useState({
    resumeText: "",
    jobDescription: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.resumeText.trim() || !formData.jobDescription.trim()) {
      alert("Please provide both your profile/resume and the Upwork job description.");
      return;
    }

    setIsGenerating(true);
    setGeneratedProposal(null);

    try {
      const response = await fetch("/api/slayer/upwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedProposal(data.proposal);
      } else {
        alert("Failed to generate proposal. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedProposal) {
      navigator.clipboard.writeText(generatedProposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 mb-2">
          Upwork Proposal Genie
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Instantly generate a highly persuasive, winning proposal for Upwork clients using AI. 
          Hook the client, prove your value, and win the job.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-5">
          <div className="bg-[#0a0a0c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              <FileText className="w-4 h-4 mr-2 text-emerald-500" />
              1. Your Profile / Resume
            </label>
            <textarea
              className="w-full bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste your past experiences, skills, or resume text here..."
              value={formData.resumeText}
              onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
            />
          </div>

          <div className="flex justify-center -my-3 relative z-10 w-full hover:scale-110 transition-transform cursor-pointer">
             <div className="bg-[#0a0a0e] border border-[rgba(255,255,255,0.05)] p-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-shadow">
               <ChevronRight className="w-5 h-5 text-gray-500 rotate-90 lg:rotate-0" />
             </div>
          </div>

          <div className="bg-[#0a0a0c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              <Briefcase className="w-4 h-4 mr-2 text-teal-500" />
              2. Upwork Job Posting
            </label>
            <textarea
              className="w-full bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste the details of the Upwork client's job post here..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.resumeText || !formData.jobDescription}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Drafting your Proposal...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                Generate Upwork Proposal
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="bg-[#0a0a0c] border border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col shadow-lg overflow-hidden lg:h-[750px]">
          <div className="p-5 border-b border-[rgba(255,255,255,0.05)] bg-[#111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white tracking-wide">Your Proposal</h3>
            </div>
            {generatedProposal && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                {copied ? <span className="text-emerald-400">Copied!</span> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto w-full custom-scrollbar">
            {!generatedProposal ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <Mail className="w-16 h-16 opacity-10" />
                <p className="text-sm font-medium">Your generated Upwork proposal will appear here.</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans bg-[#0c0c10] p-6 rounded-xl border border-[rgba(255,255,255,0.02)]">
                {generatedProposal}
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
