'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { CareerSummary } from "@/utils/types";
import { useUserInfoStore } from "@/store/userInfo";

const actionStyles = {
  urgent: "border-amber-400/20 bg-amber-400/[0.06] text-amber-200",
  ready: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200",
  build: "border-sky-400/20 bg-sky-400/[0.06] text-sky-200",
};

function getFirstName(displayName: string | null, storedName: string) {
  const name = displayName || storedName || "there";
  return name.split(" ")[0];
}

export function CareerCommandCenter() {
  const storedName = useUserInfoStore((state) => state.name);
  const [summary, setSummary] = useState<CareerSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareerSummary()
      .then((nextSummary) => {
        setSummary(nextSummary);
        useUserInfoStore.setState({
          name: nextSummary.display_name || storedName,
        });
      })
      .catch((error) => console.error("Could not load career command center", error))
      .finally(() => setLoading(false));
  }, [storedName]);

  const profileScore = summary?.profile_readiness.score || 0;
  const applications = summary?.recent_applications || [];
  const averageMatch = summary?.average_match_score || 0;
  const openApplications = summary?.active_applications || 0;
  const profileSignals = summary ? [
    { label: "Profile identity", complete: summary.profile_readiness.identity },
    { label: "Career summary", complete: summary.profile_readiness.summary },
    { label: "Skills evidence", complete: summary.profile_readiness.skills },
    { label: "Work history", complete: summary.profile_readiness.work_history },
    { label: "Verified accomplishments", complete: summary.profile_readiness.verified_evidence },
  ] : [];
  const nextGap = summary?.skill_gaps[0] || "Validate a missing requirement from your next target role";

  return (
    <div className="relative mx-auto max-w-[1440px] space-y-8 pb-16">
      <div className="pointer-events-none absolute -right-32 -top-28 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101a24] p-6 shadow-2xl shadow-sky-950/20 sm:p-9">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.2),transparent_32%),linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.04))]" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
              <Sparkles className="h-4 w-4" /> Career intelligence
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Good morning, {getFirstName(summary?.display_name || null, storedName)}. Let&apos;s make your next move count.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-slate-300">
              Your career profile is the source of truth. Slayer uses it to find fit, surface gaps, and prepare applications grounded in your real experience.
            </p>
          </div>
          <Link href="/dashboard/workspace" className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-sky-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-200">
            <Radar className="h-4 w-4" /> Analyze a role <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Profile readiness", value: `${profileScore}%`, detail: "evidence coverage", icon: UserRound, tone: "text-sky-300" },
          { label: "Active applications", value: openApplications, detail: "in your pipeline", icon: BriefcaseBusiness, tone: "text-emerald-300" },
          { label: "Average compatibility", value: averageMatch ? `${averageMatch}%` : "--", detail: "across recent work", icon: TrendingUp, tone: "text-amber-300" },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-white/10 bg-[#0d141c] p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-semibold text-white">{loading ? "..." : stat.value}</p><p className="mt-1 text-xs text-slate-500">{stat.detail}</p></div>
              <stat.icon className={`h-5 w-5 ${stat.tone}`} />
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-4">
          <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Your next best actions</p><h2 className="mt-2 text-2xl font-semibold text-white">Career plan</h2></div><span className="text-xs text-slate-500">Updated just now</span></div>
          <div className="space-y-3">
            {[
              { title: "Finish your career profile", body: profileScore === 100 ? "Your foundational evidence is ready for matching." : `${profileSignals.filter((signal) => !signal.complete).length} profile signals still need evidence.`, icon: UserRound, tone: profileScore === 100 ? "ready" : "urgent", href: "/dashboard/settings" },
              { title: "Close your next skill gap", body: nextGap, icon: Target, tone: "build", href: "/dashboard/roadmap" },
              { title: applications.length ? "Review your latest application" : "Create your first tailored application", body: applications.length ? "Check the evidence, gaps, and recommended next step before you send it." : "Paste a job description and let Slayer build a grounded application package.", icon: FileText, tone: "ready", href: applications.length ? `/dashboard/slays/${applications[0].id}` : "/dashboard/workspace" },
            ].map((action, index) => (
              <Link key={action.title} href={action.href} className={`group flex items-center gap-4 rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-white/25 ${actionStyles[action.tone as keyof typeof actionStyles]}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/20"><action.icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1"><p className="font-semibold text-white">{index + 1}. {action.title}</p><p className="mt-1 text-sm text-slate-400">{action.body}</p></div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Source of truth</p><h2 className="mt-2 text-2xl font-semibold text-white">Profile health</h2></div><Link href="/dashboard/settings" className="text-xs font-semibold text-sky-300 hover:text-white">Edit</Link></div>
          <div className="rounded-2xl border border-white/10 bg-[#0d141c] p-5">
            <div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-400">Evidence coverage</span><span className="text-xl font-semibold text-white">{profileScore}%</span></div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-300 transition-all" style={{ width: `${profileScore}%` }} /></div>
            <div className="space-y-3">{profileSignals.map((signal) => <div key={signal.label} className="flex items-center gap-3 text-sm"><CheckCircle2 className={`h-4 w-4 ${signal.complete ? "text-emerald-300" : "text-slate-600"}`} /><span className={signal.complete ? "text-slate-300" : "text-slate-500"}>{signal.label}</span></div>)}</div>
            {profileScore < 100 && <Link href="/dashboard/settings" className="mt-6 flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white"><CircleAlert className="h-4 w-4" /> Strengthen your evidence <ArrowUpRight className="h-4 w-4" /></Link>}
          </div>
          <Link href="/dashboard/workspace" className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-5 text-sm transition hover:border-sky-400/50 hover:bg-slate-900/60"><Upload className="h-5 w-5 text-sky-300" /><span className="flex-1 text-slate-300">Add a resume or job description to expand your agent context.</span><ChevronRight className="h-4 w-4 text-slate-500" /></Link>
        </aside>
      </div>

      <section className="space-y-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Application pipeline</p><h2 className="mt-2 text-2xl font-semibold text-white">Recent momentum</h2></div><Link href="/dashboard/history" className="flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white">View all <ChevronRight className="h-4 w-4" /></Link></div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{applications.length ? applications.slice(0, 3).map((application) => <Link key={application.id} href={`/dashboard/slays/${application.id}`} className="group rounded-2xl border border-white/10 bg-[#0d141c] p-5 transition hover:border-sky-400/30"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-white group-hover:text-sky-200">{application.job_title}</p><p className="mt-1 text-sm text-slate-500">{application.company || "Company not specified"}</p></div><span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">{application.status}</span></div><div className="mt-6 flex items-end justify-between"><span className="text-xs text-slate-500">{new Date(application.created_at).toLocaleDateString()}</span><span className="text-lg font-semibold text-sky-300">{application.match_score ?? "--"}<small className="ml-1 text-xs font-normal text-slate-500">match</small></span></div></Link>) : <div className="col-span-full rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">Your pipeline will appear here after your first tailored application.</div>}</div>
      </section>
    </div>
  );
}
