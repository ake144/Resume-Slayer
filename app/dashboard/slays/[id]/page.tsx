'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { ApplicationArtifact, ApplicationContact, ApplicationDetail, ApplicationEvent, ApplicationStatus, ApplicationTask, InterviewAnswer, InterviewSession } from "@/utils/types";
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
  const [artifacts, setArtifacts] = useState<ApplicationArtifact[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [revision, setRevision] = useState("");
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [nextStatus, setNextStatus] = useState<ApplicationStatus | "">("");
  const [tasks, setTasks] = useState<ApplicationTask[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [contacts, setContacts] = useState<ApplicationContact[]>([]);
  const [contactName, setContactName] = useState("");
  const [interviewMessage, setInterviewMessage] = useState("");
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswer[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      setLoading(true);
      try {
        const [detail, nextArtifacts, nextEvents, nextTasks, nextContacts, sessions] = await Promise.all([api.getApplication(id), api.listApplicationArtifacts(id), api.listApplicationEvents(id), api.listApplicationTasks(id), api.listApplicationContacts(id), api.listInterviewSessions(id)]);
        setApplication(detail);
        setArtifacts(nextArtifacts);
        setEvents(nextEvents);
        setTasks(nextTasks);
        setContacts(nextContacts);
        setInterviewSessions(sessions);
        if (sessions[0]) {
          setInterviewSession(sessions[0]);
          setInterviewAnswers(await api.listInterviewAnswers(sessions[0].id));
        } else {
          setInterviewSession(null);
          setInterviewAnswers([]);
        }
        setRevision(nextArtifacts[0]?.content || detail.generated_content);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.status === 404 ? "Slay not found" : "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const reviewArtifact = async (action: "approve" | "reject") => {
    const artifact = artifacts.find((item) => item.state === "needs_review");
    if (!artifact) return;
    setReviewing(true);
    try {
      const updated = action === "approve" ? await api.approveArtifact(artifact.id) : await api.rejectArtifact(artifact.id);
      setArtifacts((current) => current.map((item) => item.id === updated.id ? updated : item));
    } finally { setReviewing(false); }
  };

  const updatePipeline = async () => {
    if (!application || !nextStatus) return;
    const updated = await api.updateApplicationStatus(application.id, nextStatus);
    setApplication(updated); setNextStatus(""); setEvents(await api.listApplicationEvents(application.id));
  };

  const addTask = async () => {
    if (!application || !taskTitle.trim()) return;
    const task = await api.createApplicationTask(application.id, { title: taskTitle.trim() });
    setTasks((current) => [...current, task]); setTaskTitle("");
  };
  const completeTask = async (taskId: string) => {
    const task = await api.completeApplicationTask(taskId);
    setTasks((current) => current.map((item) => item.id === task.id ? task : item));
    if (application) setEvents(await api.listApplicationEvents(application.id));
  };
  const addContact = async () => {
    if (!application || !contactName.trim()) return;
    const contact = await api.createApplicationContact(application.id, { name: contactName.trim() });
    setContacts((current) => [contact, ...current]); setContactName("");
  };
  const prepareInterview = async () => {
    if (!application) return;
    try {
      const session = await api.createInterviewSession({ application_id: application.id });
      setInterviewSession(session);
      setInterviewSessions((current) => [session, ...current]);
      setInterviewAnswers([]);
      setPracticeAnswers({});
      setInterviewMessage(`${session.question_set.length} grounded practice questions prepared.`);
    } catch { setInterviewMessage("Could not prepare interview practice."); }
  };
  const loadInterviewSession = async (session: InterviewSession) => {
    try {
      setInterviewSession(session);
      setInterviewAnswers(await api.listInterviewAnswers(session.id));
      setPracticeAnswers({});
      setInterviewMessage("");
    } catch { setInterviewMessage("Could not load that interview session."); }
  };
  const savePracticeAnswer = async (index: number) => {
    const practiceAnswer = practiceAnswers[index];
    if (!interviewSession || !practiceAnswer?.trim()) return;
    const answer = await api.saveInterviewAnswer(interviewSession.id, { question_index: index, answer: practiceAnswer.trim() });
    setInterviewAnswers((current) => [...current.filter((item) => item.question_index !== index), answer]);
    setInterviewSession((current) => current ? {
      ...current,
      improvement_plan: answer.feedback && !current.improvement_plan.includes(answer.feedback)
        ? [...current.improvement_plan, answer.feedback].slice(-5)
        : current.improvement_plan,
    } : current);
    setPracticeAnswers((current) => ({ ...current, [index]: "" }));
  };
  const deletePracticeSession = async () => {
    if (!interviewSession) return;
    await api.deleteInterviewSession(interviewSession.id);
    const remaining = interviewSessions.filter((session) => session.id !== interviewSession.id);
    setInterviewSessions(remaining);
    setInterviewSession(null); setInterviewAnswers([]); setPracticeAnswers({}); setInterviewMessage("Practice session deleted.");
  };

  const createRevision = async () => {
    const artifact = artifacts.find((item) => item.state === "needs_review" || item.state === "rejected");
    if (!artifact || !revision.trim()) return;
    setReviewing(true);
    try {
      const updated = await api.reviseArtifact(artifact.id, revision.trim());
      setArtifacts((current) => [updated, ...current.map((item) => item.id === artifact.id ? { ...item, state: "revised" as const } : item)]);
    } finally { setReviewing(false); }
  };

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
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5 space-y-3"><h3 className="font-semibold text-white">Application pipeline</h3><p className="text-xs text-gray-400">Current: <span className="text-white font-bold">{application.status}</span></p><div className="flex gap-2"><select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as ApplicationStatus)} className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-[#131315] p-2 text-xs text-white"><option value="">Move to…</option>{["submitted", "interviewing", "offer", "rejected", "withdrawn"].map((value) => <option key={value} value={value}>{value}</option>)}</select><button onClick={updatePipeline} disabled={!nextStatus} className="rounded-lg bg-blue-500 px-3 text-xs font-bold text-white disabled:opacity-50">Update</button></div>{events.slice(0, 3).map((event) => <p key={event.id} className="text-xs text-gray-500">{event.from_status} → {event.to_status} · {new Date(event.created_at).toLocaleDateString()}</p>)}</div>
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5 space-y-3"><h3 className="font-semibold text-white">Next actions</h3><div className="flex gap-2"><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()} placeholder="e.g. Follow up with recruiter" className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-[#131315] p-2 text-xs text-white" /><button onClick={addTask} disabled={!taskTitle.trim()} className="rounded-lg border border-blue-400/40 px-3 text-xs font-bold text-blue-300 disabled:opacity-50">Add</button></div>{tasks.length === 0 ? <p className="text-xs text-gray-500">No follow-ups yet.</p> : tasks.map((task) => <div key={task.id} className="flex items-center justify-between gap-2 text-xs"><span className={task.completed_at ? "text-gray-600 line-through" : "text-gray-300"}>{task.title}</span>{task.completed_at ? <span className="text-green-400">Done</span> : <button onClick={() => completeTask(task.id)} className="text-blue-300 hover:text-white">Complete</button>}</div>)}</div>
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5 space-y-3"><h3 className="font-semibold text-white">Contacts</h3><div className="flex gap-2"><input value={contactName} onChange={(event) => setContactName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addContact()} placeholder="Recruiter or hiring manager" className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-[#131315] p-2 text-xs text-white"/><button onClick={addContact} disabled={!contactName.trim()} className="rounded-lg border border-blue-400/40 px-3 text-xs font-bold text-blue-300 disabled:opacity-50">Add</button></div>{contacts.length === 0 ? <p className="text-xs text-gray-500">No contacts saved.</p> : contacts.map((contact) => <p key={contact.id} className="text-xs text-gray-300">{contact.name}{contact.role ? ` · ${contact.role}` : ""}</p>)}</div>
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-white">Interview practice</h3>
            <p className="text-xs text-gray-500">Questions are grounded in this role&apos;s saved match analysis. Scores assess answer structure only, not factual truth.</p>
            <div className="flex gap-2">
              <button onClick={prepareInterview} className="flex-1 rounded-lg border border-purple-400/40 px-3 py-2 text-xs font-bold text-purple-300 hover:text-white">Prepare new session</button>
              {interviewSession && <button onClick={deletePracticeSession} className="rounded-lg border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 hover:text-white">Delete</button>}
            </div>
            {interviewMessage && <p className="text-xs text-gray-400">{interviewMessage}</p>}
            {interviewSession && <div className="space-y-3 border-t border-gray-800 pt-3">
              <p className="text-xs text-gray-500">Session created {new Date(interviewSession.created_at).toLocaleDateString()} · deleting it permanently removes its answer history.</p>
              {interviewSession.question_set.map((question, index) => {
                const prior = interviewAnswers.find((answer) => answer.question_index === index);
                const draft = practiceAnswers[index] ?? "";
                return <div key={`${interviewSession.id}-${index}`} className="space-y-2">
                  <p className="text-xs text-gray-300">{index + 1}. {question}</p>
                  {prior ? <p className="text-xs leading-5 text-green-300">Score {prior.rubric_score ?? "—"}/100 · {prior.feedback}</p> : <>
                    <textarea value={draft} onChange={(event) => setPracticeAnswers((current) => ({ ...current, [index]: event.target.value }))} placeholder="Write your answer…" className="min-h-20 w-full rounded-lg border border-gray-700 bg-[#131315] p-2 text-xs text-white" />
                    <button onClick={() => savePracticeAnswer(index)} disabled={!draft.trim()} className="text-xs font-bold text-purple-300 disabled:opacity-50">Save and review answer</button>
                  </>}
                </div>;
              })}
              {interviewSession.improvement_plan.length > 0 && <div className="rounded-lg bg-[#131315] p-3 text-xs text-gray-400"><p className="mb-1 font-bold text-gray-300">Improvement plan</p>{interviewSession.improvement_plan.map((item) => <p key={item}>• {item}</p>)}</div>}
            </div>}
          </div>
          {artifacts[0] && <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-white">Document review</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${artifacts[0].state === "approved" ? "bg-green-500/10 text-green-300" : "bg-amber-500/10 text-amber-300"}`}>{artifacts[0].state.replace("_", " ")}</span></div>
            <p className="text-xs leading-5 text-gray-400">This document must be reviewed before it is treated as final. {artifacts[0].evidence_citations.length} source record{artifacts[0].evidence_citations.length === 1 ? "" : "s"} attached.</p>
            {artifacts[0].unsupported_claims.length > 0 && <p className="text-xs text-amber-300">Review unsupported claims: {artifacts[0].unsupported_claims.join(", ")}</p>}
            {artifacts[0].state === "needs_review" && <div className="flex gap-2"><button onClick={() => reviewArtifact("approve")} disabled={reviewing} className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-black disabled:opacity-50">Approve</button><button onClick={() => reviewArtifact("reject")} disabled={reviewing} className="flex-1 rounded-lg border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-50">Reject</button></div>}
            {(artifacts[0].state === "needs_review" || artifacts[0].state === "rejected") && <><textarea value={revision} onChange={(event) => setRevision(event.target.value)} className="min-h-24 w-full rounded-lg border border-gray-700 bg-[#131315] p-2 text-xs text-white" aria-label="Revised document content" /><button onClick={createRevision} disabled={reviewing || !revision.trim()} className="w-full rounded-lg border border-blue-400/40 px-3 py-2 text-xs font-bold text-blue-300 disabled:opacity-50">Save as new revision</button></>}
          </div>}
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
