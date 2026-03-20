"use client";























































































































































}  );    </div>      </div>        </div>          </div>            )}              </div>                {generatedProposal}              <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">            ) : (              </div>                <p className="text-sm">Your generated generic proposal pitch will appear here.</p>                <Send className="w-12 h-12 opacity-20" />              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">            {!generatedProposal ? (          <div className="flex-1 p-6 overflow-y-auto w-full">          </div>            )}              </button>                {copied ? <span className="text-orange-400">Copied!</span> : <><Copy className="w-3.5 h-3.5" /> Copy</>}              >                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"                onClick={handleCopy}              <button            {generatedProposal && (            </div>              <h3 className="font-bold text-white">Your Pitch</h3>              <Send className="w-5 h-5 text-orange-400" />            <div className="flex items-center gap-2">          <div className="p-5 border-b border-gray-800 bg-[#111] flex items-center justify-between">        <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl flex flex-col shadow-lg overflow-hidden lg:h-[730px]">        {/* Output Column */}        </div>          </button>            )}              </>                Generate Proposal Pitch                <Sparkles className="w-5 h-5" />              <>            ) : (              </>                Drafting your Proposal...                <RefreshCw className="w-5 h-5 animate-spin" />              <>            {isGenerating ? (          >            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"            disabled={isGenerating || !formData.resumeText || !formData.jobDescription}            onClick={handleGenerate}          <button          </div>            />              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}              value={formData.jobDescription}              placeholder="Paste the details of the job listing, client website, or gig you're aiming for..."              className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all min-h-[220px] resize-y placeholder:text-gray-600"            <textarea            </label>              2. Target Project / Job Description              <Briefcase className="w-4 h-4 mr-2 text-amber-500" />            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl p-5 shadow-lg">          </div>             </div>               <ChevronRight className="w-5 h-5 text-gray-500 rotate-90 lg:rotate-0" />             <div className="bg-[#111] border border-gray-800 p-2 rounded-full shadow-xl">          <div className="flex justify-center -my-3 relative z-10">          </div>            />              onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}              value={formData.resumeText}              placeholder="Paste your past experiences, skills, or resume text here..."              className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all min-h-[220px] resize-y placeholder:text-gray-600"            <textarea            </label>              1. Your Profile / Resume              <FileText className="w-4 h-4 mr-2 text-orange-500" />            <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl p-5 shadow-lg">        <div className="space-y-5">        {/* Input Column */}      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">      </div>        </p>          Instantly generate a highly persuasive, platform-agnostic cold email or generic proposal to win over clients, agencies, or standard job postings.        <p className="text-gray-400 text-sm max-w-2xl">        </h1>          Cold Proposal Pitch        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500 mb-2">      <div>      {/* Header */}    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">  return (  };    }      setTimeout(() => setCopied(false), 2000);      setCopied(true);      navigator.clipboard.writeText(generatedProposal);    if (generatedProposal) {  const handleCopy = () => {  };    }      setIsGenerating(false);    } finally {      alert("An error occurred during generation.");      console.error(error);    } catch (error) {      }        alert("Failed to generate Proposal. Please try again.");      } else {        setGeneratedProposal(data.proposal);        const data = await response.json();      if (response.ok) {      });        body: JSON.stringify(formData),        headers: { "Content-Type": "application/json" },        method: "POST",      const response = await fetch("/api/slayer/proposal", {    try {    setGeneratedProposal(null);    setIsGenerating(true);    }      return;      alert("Please provide both your profile/resume and the target's info/job description.");    if (!formData.resumeText.trim() || !formData.jobDescription.trim()) {  const handleGenerate = async () => {  const [copied, setCopied] = useState(false);  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);  const [isGenerating, setIsGenerating] = useState(false);  });    jobDescription: "",    resumeText: "",  const [formData, setFormData] = useState({export default function GenericProposalPage() {import { FileText, Sparkles, Copy, Mail, RefreshCw, Briefcase, ChevronRight, Send } from "lucide-react";import { useState } from "react";import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, Map, History, Settings, Plus, Star, FileText, MessageSquare, Send } from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname !== '/dashboard') {
      return false; // Exact match for dashboard
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#050505] border-r border-gray-800/50 flex flex-col z-50">
      {/* Search / Brand Area */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">AI ATS Resume Slayer</h1>
            <p className="text-[10px] text-gray-500 font-medium">Elite Tier Access</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <Link href="/dashboard" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link href="/dashboard/workspace" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/workspace') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Zap className="w-4 h-4" />
          Slay Mode
        </Link>
        <Link href="/dashboard/roadmap" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/roadmap') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Map className="w-4 h-4" />
          Skill Roadmap
        </Link>
        <Link href="/dashboard/cover-letter" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/cover-letter') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <FileText className="w-4 h-4" />
          Cover Letter Pro
        </Link>
        <Link href="/dashboard/upwork" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/upwork') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Zap className="w-4 h-4" />
          Upwork Proposals
        </Link>
        <Link href="/dashboard/linkedin" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/linkedin') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <MessageSquare className="w-4 h-4" />
          LinkedIn DMs
        </Link>
        <Link href="/dashboard/proposal" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/proposal') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Send className="w-4 h-4" />
          Cold Proposals
        </Link>
        <Link href="/dashboard/history" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/history') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <History className="w-4 h-4" />
          History
        </Link>
        <Link href="/dashboard/settings" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors", isActive('/dashboard/settings') ? "bg-[#111] text-blue-500 border border-gray-800/50" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent")}>
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-gray-800/50">
        <Link href="/dashboard/workspace" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          New Slay
        </Link>
      </div>
    </aside>
  );
}