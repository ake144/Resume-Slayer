"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Mail, RefreshCw, Briefcase, ChevronRight, MessageSquare } from "lucide-react";

export default function LinkedinDmPage() {
  const [formData, setFormData] = useState({
    resumeText: "",
    jobDescription: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDM, setGeneratedDM] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.resumeText.trim() || !formData.jobDescription.trim()) {
      alert("Please provide both your profile/resume and the target's info/job description.");
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
        alert("Failed to generate LinkedIn DM. Please try again.");
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
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500 mb-2">
          LinkedIn DM Generator
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Craft the perfect outreach message for recruiters, hiring managers, or potential clients. Keep it concise, professional, and optimized for high response rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-5">
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              1. Your Profile / Resume
            </label>
            <textarea
              className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste your past experiences, skills, or resume text here..."
              value={formData.resumeText}
              onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
            />
          </div>

          <div className="flex justify-center -my-3 relative z-10">
             <div className="bg-[#111] border border-gray-800 p-2 rounded-full shadow-xl">
               <ChevronRight className="w-5 h-5 text-gray-500 rotate-90 lg:rotate-0" />
             </div>
          </div>

          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
              <Briefcase className="w-4 h-4 mr-2 text-sky-500" />
              2. Target Person / Job Description
            </label>
            <textarea
              className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste the target job description or details about the person you are messaging..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.resumeText || !formData.jobDescription}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Drafting your DM...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate LinkedIn DM
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl flex flex-col shadow-lg overflow-hidden lg:h-[730px]">
          <div className="p-5 border-b border-gray-800 bg-[#111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white">Your LinkedIn DM</h3>
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
          <div className="flex-1 p-6 overflow-y-auto w-full">
            {!generatedDM ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p className="text-sm">Your generated LinkedIn DM will appear here.</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
                {generatedDM}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
