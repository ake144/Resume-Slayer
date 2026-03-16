'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/utils/common";
import { SlayType } from "@/utils/types";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, ExternalLink, RefreshCw, BarChart3, Target, Briefcase, FileText, CheckCircle2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SlayDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [slay, setSlay] = useState<SlayType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'optimized' | 'original' | 'coverLetter'>('optimized');
  
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
                className="max-w-[210mm] mx-auto bg-white text-gray-900 p-8 sm:p-12 shadow-lg resume-document font-sans"
              >
                {slay.optimizedResume ? (
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase tracking-wider" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-sm text-gray-700 leading-relaxed mb-3" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-sm text-gray-700 space-y-1 marker:text-gray-500" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-sm text-gray-700 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
                    }}
                  >
                    {slay.optimizedResume}
                  </ReactMarkdown>
                ) : (
                  <div className="text-gray-500 italic">No optimized resume data available.</div>
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
              <p className="text-sm text-gray-400 whitespace-pre-wrap">
                {slay.trapsFixed}
              </p>
            </div>
          )}

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
