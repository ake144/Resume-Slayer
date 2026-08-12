'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { ApplicationDetail } from "@/utils/types";
import Link from "next/link";
import { ArrowLeft, CalendarDays, RefreshCw, Target, Briefcase, FileText, CheckCircle2, Download, Palette, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SlayDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'optimized' | 'coverLetter'>('optimized');
  const [activeTemplate, setActiveTemplate] = useState<'modern' | 'executive' | 'sidebar'>('modern');

  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [generatingCL, setGeneratingCL] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      setLoading(true);
      try {
        const detail = await api.getApplication(id);
        setApplication(detail);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.status === 404 ? "Slay not found" : "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
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

  const parsedResume = application?.generated_content ? parseResume(application.generated_content) : null;

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
    if (!application) return;
    setActiveTab('coverLetter');

    if (coverLetter && !window.confirm("A cover letter already exists. Generate a new one?")) {
      return;
    }

    setGeneratingCL(true);

    try {
      const jobContext = application.company
        ? `Role: ${application.job_title} at ${application.company}. Tailor the cover letter to this role, inferring typical responsibilities from the title.`
        : `Role: ${application.job_title}. Tailor the cover letter to this role, inferring typical responsibilities from the title.`;

      const result = await api.generateApplication({
        job_description: jobContext,
        job_title: application.job_title,
        application_type: "cover_letter",
        job_posting_id: application.job_posting_id ?? undefined,
      });
      setCoverLetter(result.content);
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

  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-red-400 text-lg">{error || "Slay not found"}</p>
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-400 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const analysis = application.match_analysis;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-gray-800 pb-6">
        <div className="space-y-2">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-200 inline-flex items-center text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-500">
              {application.job_title || `Slay #${application.id}`}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-indigo-400" />
              {new Date(application.created_at).toLocaleDateString() || 'N/A'}
            </div>
            {application.company && (
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-indigo-400" />
                {application.company}
              </div>
            )}
          </div>
        </div>

        {/* Match Score Card */}
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-4 min-w-50 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Match Score</p>
            <p className="text-3xl font-bold text-green-400">{application.match_score ?? "—"}</p>
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

          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 min-h-150 overflow-x-auto">
            {activeTab === 'coverLetter' ? (
              <div className="max-w-[210mm] mx-auto bg-white text-gray-900 p-8 sm:p-12 shadow-lg resume-document font-sans">
                {generatingCL ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-100 space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
                    <p className="text-gray-500 font-medium">Drafting your actionable cover letter with AI...</p>
                  </div>
                ) : coverLetter ? (
                  <div className="whitespace-pre-wrap text-[15px] text-gray-800 leading-relaxed font-serif">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-100 space-y-4">
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
                          <div className="flex-2 space-y-6">
                            {parsedResume.summary && <ReactMarkdown components={styleMaps.modern.body}>{parsedResume.summary}</ReactMarkdown>}
                            {parsedResume.experience && <ReactMarkdown components={styleMaps.modern.body}>{parsedResume.experience}</ReactMarkdown>}
                          </div>
                          <div className="flex-1 space-y-6">
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
            ) : null}
          </div>
        </div>

        {/* Right Column - Stats & Analysis (1/3 width) */}
        <div className="space-y-6">
          {analysis && analysis.tailoring_recommendations.length > 0 && (
            <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                <h3 className="font-semibold text-white">Tailoring Recommendations</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                {analysis.tailoring_recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          )}

          {analysis && analysis.skill_gaps.length > 0 && (
             <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5">
                 <div className="flex items-center mb-4">
                   <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                   <h3 className="font-semibold text-white">Skill Gaps</h3>
                 </div>
                 <ul className="space-y-2 text-sm text-gray-300 list-disc pl-4">
                   {analysis.skill_gaps.map((gap, i) => <li key={i}>{gap}</li>)}
                 </ul>
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
                disabled={activeTab !== 'optimized' || !application.generated_content}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center mb-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>

              <button
                onClick={() => {
                  let text = "";
                  if (activeTab === 'optimized') text = application.generated_content;
                  else if (activeTab === 'coverLetter') text = coverLetter || "";

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
                Copy {activeTab === 'optimized' ? 'Optimized' : 'Cover Letter'}
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
