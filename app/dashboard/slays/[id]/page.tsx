'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/utils/common";
import { SlayType } from "@/utils/types";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, ExternalLink, RefreshCw, BarChart3, Target, Briefcase, FileText, CheckCircle2, Download, Palette } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SlayDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [slay, setSlay] = useState<SlayType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'optimized' | 'original' | 'coverLetter'>('optimized');
  const [activeTemplate, setActiveTemplate] = useState<'modern' | 'executive' | 'sidebar'>('modern');
  
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [generatingCL, setGeneratingCL] = useState(false);

  // Load any existing cover letter from local storage
  useEffect(() => {
    if (id) {
      const storedCL = localStorage.getItem(`cover_letter_${id}`);
      if (storedCL) {
        setCoverLetter(storedCL);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    const fetchSlay = async () => {
      setLoading(true);
      try {
        const token = getToken();
        // Since there is no /api/slayer/[id] endpoint on the frontend yet, we can fetch all and find it,
        // OR rely on the newly created /api/slayer/[id] endpoint.
        const response = await fetch(`/api/slayer/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSlay(data);
        } else if (response.status === 404) {
          // If the specific endpoint doesn't exist on backend, fallback to fetch all
          const fallbackResp = await fetch('/api/slayer', {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (fallbackResp.ok) {
            const allSlays = await fallbackResp.json();
            const found = allSlays.find((s: any) => s.id.toString() === id);
            if (found) {
              setSlay(found);
            } else {
              setError("Slay not found");
            }
          }
        } else {
          setError("Failed to fetch details");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlay();
  }, [id]);

  const parseResume = (md: string) => {
    const sections = { header: "", summary: "", experience: "", education: "", skills: "", others: [] as string[] };
    if (!md) return sections;
    
    // Split by Markdown headers (H2)
    const tokens = md.split(/(?=^##\s)/m);
    tokens.forEach(token => {
      if (!token.trim().startsWith('##')) {
        sections.header += token + '\n';
        return;
      }
      const lowerToken = token.toLowerCase();
      if (lowerToken.startsWith('## summary') || lowerToken.startsWith('## professional') || lowerToken.startsWith('## profile')) {
        sections.summary = token;
      } else if (lowerToken.startsWith('## experience') || lowerToken.startsWith('## work') || lowerToken.startsWith('## employment') || lowerToken.startsWith('## professional experience')) {
        sections.experience = token;
      } else if (lowerToken.startsWith('## education')) {
        sections.education = token;
      } else if (lowerToken.startsWith('## skill') || lowerToken.startsWith('## core') || lowerToken.startsWith('## technical')) {
        sections.skills = token;
      } else {
        sections.others.push(token);
      }
    });
    return sections;
  };

  const parsedResume = slay?.optimizedResume ? parseResume(slay.optimizedResume) : null;

  const styleMaps = {
    modern: {
      parent: "max-w-[210mm] mx-auto bg-white text-gray-900 shadow-xl resume-document font-sans overflow-hidden",
      header: {
        h1: ({node, ...props}: any) => <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight" {...props} />,
        p: ({node, ...props}: any) => <p className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 items-center" {...props} />,
        a: ({node, ...props}: any) => <a className="text-blue-600 hover:underline" {...props} />,
      },
      body: {
        h2: ({node, ...props}: any) => <h2 className="text-lg font-bold text-blue-800 mt-6 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-1" {...props} />,
        h3: ({node, ...props}: any) => <h3 className="text-md font-bold text-gray-900 mt-4 mb-1" {...props} />,
        p: ({node, ...props}: any) => <p className="text-[13px] text-gray-700 leading-relaxed mb-3" {...props} />,
        ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-4 text-[13px] text-gray-700 space-y-1.5 marker:text-blue-500" {...props} />,
        li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
        strong: ({node, ...props}: any) => <strong className="font-semibold text-gray-900" {...props} />,
      }
    },
    executive: {
      parent: "max-w-[210mm] mx-auto bg-[#faf9f6] text-gray-900 shadow-xl resume-document font-serif overflow-hidden",
      header: {
        h1: ({node, ...props}: any) => <h1 className="text-4xl font-normal text-white uppercase tracking-[0.2em] mb-2 text-center" {...props} />,
        p: ({node, ...props}: any) => <p className="text-sm text-gray-200 flex justify-center flex-wrap gap-x-4 gap-y-1 items-center" {...props} />,
        a: ({node, ...props}: any) => <a className="text-gray-100 hover:text-white" {...props} />,
      },
      body: {
        h2: ({node, ...props}: any) => <h2 className="text-lg font-bold text-black mt-6 mb-4 uppercase tracking-widest border-b border-black pb-2" {...props} />,
        h3: ({node, ...props}: any) => <h3 className="text-md font-bold text-gray-900 mt-4 mb-1" {...props} />,
        p: ({node, ...props}: any) => <p className="text-[13px] text-gray-800 leading-relaxed mb-3" {...props} />,
        ul: ({node, ...props}: any) => <ul className="list-none pl-0 mb-4 text-[13px] text-gray-800 space-y-2" {...props} />,
        li: ({node, ...props}: any) => <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:top-0 before:text-gray-400" {...props} />,
        strong: ({node, ...props}: any) => <strong className="font-bold text-black" {...props} />,
      }
    },
    sidebar: {
      parent: "max-w-[210mm] mx-auto bg-white text-gray-800 shadow-xl resume-document font-sans flex min-h-[297mm] overflow-hidden",
      header: {
        h1: ({node, ...props}: any) => <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase" {...props} />,
        p: ({node, ...props}: any) => <p className="text-[13px] text-gray-600 mb-1" {...props} />,
        a: ({node, ...props}: any) => <a className="text-teal-600 hover:underline" {...props} />,
      },
      body: {
        h2: ({node, ...props}: any) => <h2 className="text-[15px] font-bold text-teal-800 mt-6 mb-3 uppercase tracking-wider border-b border-gray-200 pb-1" {...props} />,
        h3: ({node, ...props}: any) => <h3 className="text-[14px] font-bold text-gray-800 mt-4 mb-1" {...props} />,
        p: ({node, ...props}: any) => <p className="text-[13px] text-gray-600 leading-relaxed mb-3" {...props} />,
        ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-4 text-[13px] text-gray-600 space-y-1.5 marker:text-teal-500" {...props} />,
        li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
        strong: ({node, ...props}: any) => <strong className="font-semibold text-gray-900" {...props} />,
      }
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-content');
    if (!element) return;
    
    // Import dynamically to avoid SSR "window is not defined" issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: 10,
      filename: `optimized-resume-${id}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const handleGenerateCoverLetter = async () => {
    if (!slay) return;
    setActiveTab('coverLetter');
    
    // If it's already generated, don't re-generate unless forced (user can just view it)
    if (coverLetter && !window.confirm("A cover letter already exists. Generate a new one?")) {
      return;
    }

    setGeneratingCL(true);
    
    try {
      const resp = await fetch("/api/slayer/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: slay.optimizedResume || slay.originalResume,
          jobDescription: `Job Title: ${slay.jobTitle || 'Unknown'}\nJob URL: ${slay.jobUrl || 'Unknown'} - Please infer the likely job duties from the title and align the cover letter towards it.`,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setCoverLetter(data.coverLetter);
        localStorage.setItem(`cover_letter_${id}`, data.coverLetter);
      } else {
        console.error("Failed to generate cover letter");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingCL(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !slay) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-red-400 text-lg">{error || "Slay not found"}</p>
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-400 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-gray-800 pb-6">
        <div className="space-y-2">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-200 inline-flex items-center text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              {slay.jobTitle && slay.jobTitle !== 'Unknown Title' ? slay.jobTitle : `Slay #${slay.id}`}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-indigo-400" />
              {slay.createdAt || 'N/A'}
            </div>
            {slay.jobUrl && slay.jobUrl !== 'Unknown URL' && (
              <a href={slay.jobUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original Job
              </a>
            )}
          </div>
        </div>

        {/* ATS Score Card */}
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-4 min-w-[200px] flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">ATS Match Score</p>
            <p className="text-3xl font-bold text-green-400">{slay.atsScore}</p>
          </div>
          <Target className="w-10 h-10 text-green-500/20" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Resume View (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('optimized')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'optimized' 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Optimized Version
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'original' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Original Version
            </button>
            <button
              onClick={() => setActiveTab('coverLetter')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'coverLetter' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Cover Letter
            </button>
          </div>

          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 min-h-[600px] overflow-x-auto">
            {activeTab === 'coverLetter' ? (
              <div className="max-w-[210mm] mx-auto bg-white text-gray-900 p-8 sm:p-12 shadow-lg resume-document font-sans">
                {generatingCL ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
                    <p className="text-gray-500 font-medium">Drafting your actionable cover letter with AI...</p>
                  </div>
                ) : coverLetter ? (
                  <div className="whitespace-pre-wrap text-[15px] text-gray-800 leading-relaxed font-serif">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-2">
                       <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No Cover Letter Generated</h3>
                    <p className="text-gray-500 text-center text-sm max-w-sm">
                      We haven't generated a cover letter for this optimized resume yet.
                    </p>
                    <button 
                      onClick={handleGenerateCoverLetter}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20"
                    >
                      Generate with AI
                    </button>
                  </div>
                )}
              </div>
            ) : activeTab === 'optimized' ? (
              <div 
                id="resume-content" 
                className={styleMaps[activeTemplate].parent}
              >
                {parsedResume ? (
                  <>
                    {activeTemplate === 'modern' && (
                      <div className="w-full flex flex-col">
                        <div className="bg-slate-50 px-10 pt-10 pb-6 border-b-[6px] border-blue-900">
                          <ReactMarkdown components={styleMaps.modern.header}>{parsedResume.header}</ReactMarkdown>
                        </div>
                        <div className="flex gap-10 px-10 py-8">
                          <div className="flex-[2] space-y-6">
                            {parsedResume.summary && <ReactMarkdown components={styleMaps.modern.body}>{parsedResume.summary}</ReactMarkdown>}
                            {parsedResume.experience && <ReactMarkdown components={styleMaps.modern.body}>{parsedResume.experience}</ReactMarkdown>}
                          </div>
                          <div className="flex-[1] space-y-6">
                            {parsedResume.education && <ReactMarkdown components={styleMaps.modern.body}>{parsedResume.education}</ReactMarkdown>}
                            {parsedResume.skills && <ReactMarkdown components={styleMaps.modern.body}>{parsedResume.skills}</ReactMarkdown>}
                            {parsedResume.others.map((other, i) => <ReactMarkdown key={i} components={styleMaps.modern.body}>{other}</ReactMarkdown>)}
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTemplate === 'executive' && (
                      <div className="w-full flex-col flex">
                        <div className="bg-[#1e2329] px-10 pt-10 pb-8 shadow-sm">
                          <ReactMarkdown components={styleMaps.executive.header}>{parsedResume.header}</ReactMarkdown>
                        </div>
                        <div className="flex gap-8 px-10 py-8">
                          <div className="w-[60%] space-y-6">
                             {parsedResume.summary && <ReactMarkdown components={styleMaps.executive.body}>{parsedResume.summary}</ReactMarkdown>}
                             {parsedResume.experience && <ReactMarkdown components={styleMaps.executive.body}>{parsedResume.experience}</ReactMarkdown>}
                             {parsedResume.others.map((other, i) => <ReactMarkdown key={i} components={styleMaps.executive.body}>{other}</ReactMarkdown>)}
                          </div>
                          <div className="w-[40%] space-y-6 bg-gray-100/50 p-6 rounded border border-gray-200 h-max">
                             {parsedResume.education && <ReactMarkdown components={styleMaps.executive.body}>{parsedResume.education}</ReactMarkdown>}
                             {parsedResume.skills && <ReactMarkdown components={styleMaps.executive.body}>{parsedResume.skills}</ReactMarkdown>}
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTemplate === 'sidebar' && (
                      <div className="w-full flex min-h-full">
                        <div className="w-[35%] bg-[#f7f9fa] border-r border-gray-200 px-6 py-10 flex flex-col gap-6">
                          <ReactMarkdown components={styleMaps.sidebar.header}>{parsedResume.header}</ReactMarkdown>
                          {parsedResume.skills && <ReactMarkdown components={styleMaps.sidebar.body}>{parsedResume.skills}</ReactMarkdown>}
                          {parsedResume.education && <ReactMarkdown components={styleMaps.sidebar.body}>{parsedResume.education}</ReactMarkdown>}
                        </div>
                        <div className="w-[65%] px-8 py-10 space-y-6">
                           {parsedResume.summary && <ReactMarkdown components={styleMaps.sidebar.body}>{parsedResume.summary}</ReactMarkdown>}
                           {parsedResume.experience && <ReactMarkdown components={styleMaps.sidebar.body}>{parsedResume.experience}</ReactMarkdown>}
                           {parsedResume.others.map((other, i) => <ReactMarkdown key={i} components={styleMaps.sidebar.body}>{other}</ReactMarkdown>)}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic p-12">No optimized resume data available.</div>
                )}
              </div>
            ) : (
              <div className="max-w-none text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed p-4">
                {slay.originalResume || 'No original resume data available.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & RoadMap (1/3 width) */}
        <div className="space-y-6">
          {slay.trapsFixed && (
            <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                <h3 className="font-semibold text-white">Traps Fixed</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                {(() => {
                  try {
                    let parsed: string[] = [];
                    if (typeof slay.trapsFixed === 'string') {
                      parsed = JSON.parse(slay.trapsFixed);
                      if (Array.isArray(parsed)) {
                        return parsed.map((trap: string, i: number) => <li key={i}>{trap}</li>);
                      }
                    } else if (Array.isArray(slay.trapsFixed)) {
                      return slay.trapsFixed.map((trap: string, i: number) => <li key={i}>{trap}</li>);
                    }
                  } catch {
                    if (typeof slay.trapsFixed === 'string') {
                      return slay.trapsFixed.split(',').map((t, i) => <li key={i}>{t.replace(/[\[\]"]/g, '').trim()}</li>);
                    }
                  }
                  return <li>{slay.trapsFixed}</li>;
                })()}
              </ul>
            </div>
          )}

          {slay.roadMap?.roadMapText && (
             <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5">
                 <div className="flex items-center mb-4">
                   <Target className="w-5 h-5 text-orange-400 mr-2" />
                   <h3 className="font-semibold text-white">Learning Roadmap</h3>
                 </div>
                 <div className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
                   {slay.roadMap.roadMapText}
                 </div>
             </div>
          )}

          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Palette className="w-5 h-5 text-pink-400 mr-2" />
              <h3 className="font-semibold text-white">Resume Template</h3>
            </div>
            <div className="space-y-3">
              <select 
                value={activeTemplate}
                onChange={(e) => setActiveTemplate(e.target.value as any)}
                className="w-full bg-[#131315] border border-gray-700 text-white text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
              >
                <option value="modern">Modern (Split Layout)</option>
                <option value="executive">Executive (Centered Header)</option>
                <option value="sidebar">Creative (Left Sidebar)</option>
              </select>
            </div>
          </div>

          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleDownloadPdf}
                disabled={activeTab !== 'optimized' || !slay.optimizedResume}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center mb-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              
              <button 
                onClick={() => {
                  let text = "";
                  if (activeTab === 'optimized') text = slay.optimizedResume;
                  else if (activeTab === 'coverLetter') text = coverLetter || "";
                  else text = slay.originalResume;
                  
                  if (!text) {
                     alert("Nothing to copy!");
                     return;
                  }
                  
                  navigator.clipboard.writeText(text);
                  alert("Copied to clipboard!");
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Copy {activeTab === 'optimized' ? 'Optimized' : activeTab === 'coverLetter' ? 'Cover Letter' : 'Original'}
              </button>
              
              {activeTab === 'coverLetter' && coverLetter && (
                <button 
                  onClick={handleGenerateCoverLetter}
                  disabled={generatingCL}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center mt-3"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${generatingCL ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
