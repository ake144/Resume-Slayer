'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CircleAlert, Clock3, ExternalLink, RefreshCw, Target } from "lucide-react";
import { api } from "@/lib/api";
import type { JobPosting, MatchResult } from "@/utils/types";

export default function OpportunitiesPage() {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [includeExpired, setIncludeExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [nextPostings, nextMatches] = await Promise.all([
        api.listJobPostings(includeExpired),
        api.listMatches(),
      ]);
      setPostings(nextPostings);
      setMatches(nextMatches);
    } catch (error) {
      console.error("Could not load opportunities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [includeExpired]);

  const latestMatchFor = (postingId: string) => matches.find((match) => match.job_posting_id === postingId);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <section className="rounded-3xl border border-white/10 bg-[#101a24] p-7 sm:p-9">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-300"><Target className="h-4 w-4" /> Opportunity inbox</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Roles worth your attention.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Review stored opportunities, see the latest compatibility result, and keep expired listings out of your active search.</p></div>
          <Link href="/dashboard/workspace" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-sky-200">Analyze a role <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Stored opportunities</p><p className="mt-1 text-sm text-slate-400">{postings.length} {includeExpired ? "total" : "active"} posting{postings.length === 1 ? "" : "s"}</p></div><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={includeExpired} onChange={(event) => setIncludeExpired(event.target.checked)} /> Include expired</label><button onClick={load} className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-sky-400 hover:text-white" aria-label="Refresh opportunities"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button></div></div>

      {loading ? <div className="rounded-2xl border border-white/10 bg-[#0d141c] p-12 text-center text-sm text-slate-500">Loading opportunities...</div> : postings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-600" /><p className="mt-4 text-sm text-slate-400">No stored opportunities yet.</p><Link href="/dashboard/workspace" className="mt-4 inline-flex text-sm font-semibold text-sky-300 hover:text-white">Analyze your first role <ArrowUpRight className="ml-1 h-4 w-4" /></Link></div> : <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{postings.map((posting) => { const match = latestMatchFor(posting.id); return <article key={posting.id} className={`rounded-2xl border p-5 ${posting.is_expired ? "border-amber-400/20 bg-amber-400/[0.04]" : "border-white/10 bg-[#0d141c]"}`}><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="truncate text-lg font-semibold text-white">{posting.title}</h2><p className="mt-1 text-sm text-slate-500">{posting.company || "Company not specified"}{posting.location ? ` · ${posting.location}` : ""}</p></div>{posting.is_expired ? <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300"><Clock3 className="h-3 w-3" /> Expired</span> : <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Active</span>}</div><div className="mt-5 flex items-end justify-between border-t border-white/5 pt-4"><div><p className="text-xs text-slate-500">Latest compatibility</p><p className="mt-1 text-2xl font-semibold text-sky-300">{match?.match_score ?? posting.latest_match_score ?? "--"}<small className="ml-1 text-xs font-normal text-slate-500">/ 100</small></p></div>{posting.source_url && <a href={posting.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">Source <ExternalLink className="h-3 w-3" /></a>}</div>{match?.hard_constraints?.length ? <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3"><p className="flex items-center gap-2 text-xs font-semibold text-amber-200"><CircleAlert className="h-4 w-4" /> Preference blocker</p><p className="mt-1 text-xs leading-5 text-amber-100/70">{match.hard_constraints[0]}</p></div> : <p className="mt-4 text-xs text-slate-500">No explicit preference blockers recorded.</p>}</article>; })}</div>}
    </div>
  );
}
