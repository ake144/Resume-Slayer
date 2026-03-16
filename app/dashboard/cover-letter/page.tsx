"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Mail, RefreshCw, Briefcase, ChevronRight } from "lucide-react";
import Axios from "axios";

export default function CoverLetterPage() {
  const [formData, setFormData] = useState({
    resumeText: "",
    jobDescription: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.resumeText.trim() || !formData.jobDescription.trim()) {
      alert("Please provide both your resume and the job description.");
      return;
    }

    setIsGenerating(true);
    setGeneratedLetter(null);

    try {
      const response = await fetch("/api/slayer/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLetter(data.coverLetter);
      } else {
        alert("Failed to generate cover letter. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 mb-2">
          Cover Letter Pro
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Instantly generate a highly persuasive, perfectly tailored cover letter using AI. 
          Just paste your resume and the target job description below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-5">
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl p-5 shadow-lg">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              1. Paste Your Resume
            </label>
            <textarea
              className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste your full resume text or latest work experience here..."
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
              <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
              2. Paste Job Description
            </label>
            <textarea
              className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all min-h-[220px] resize-y placeholder:text-gray-600"
              placeholder="Paste the target job description, requirements, or link context here..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.resumeText || !formData.jobDescription}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Drafting your Cover Letter...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl flex flex-col shadow-lg overflow-hidden lg:h-[730px]">
          <div className="p-5 border-b border-gray-800 bg-[#111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">Your Cover Letter</h3>
            </div>
            {generatedLetter && (
              <button
                onClick={handleCopy}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy Text"}
              </button>
            )}
          </div>

          <div className="p-1 flex-1 overflow-y-auto bg-[#0a0a0c]">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
                <h4 className="text-white font-medium mb-1">Analyzing alignment...</h4>
                <p className="text-sm text-gray-500">Writing a compelling narrative based on your skills.</p>
              </div>
            ) : generatedLetter ? (
              <div className="p-6 md:p-8">
                <div className="bg-white rounded-xl p-8 shadow-sm font-serif text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap selection:bg-purple-200">
                  {generatedLetter}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-gray-600" />
                </div>
                <h4 className="text-gray-400 font-medium mb-1">Awaiting Input</h4>
                <p className="text-sm text-gray-600 max-w-xs">
                  Fill out the resume and job description fields on the left to generate your custom cover letter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
