'use client';

import { useEffect, useState, useCallback } from "react";
import { Application } from "@/utils/types";
import Link from "next/link";
import {
    History,
    ChevronLeft,
    ChevronRight,
    Zap,
    RefreshCw,
    Target,
    Search,
    ArrowUpRight,
    FileText,
    CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function HistoryPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const PAGE_SIZE = 10;

    const fetchApplications = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const data = await api.listApplications(p, PAGE_SIZE);
            setApplications(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalItems(data.totalItems || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications(page);
    }, [page, fetchApplications]);

    const getScoreColor = (score: number | null) => {
        const num = score ?? 0;
        if (num >= 85) return "text-green-400 bg-green-500/10 border-green-500/20";
        if (num >= 65) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-400 bg-red-500/10 border-red-500/20";
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <History className="w-6 h-6 text-blue-500" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white">Slay History</h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        You&apos;ve optimized <span className="text-white">{totalItems}</span> resumes so far. Keep slaying.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Search slays..."
                            className="bg-[#0a0a0c] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all w-64"
                        />
                    </div>
                    <Link
                        href="/dashboard/workspace"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black px-6 py-3 rounded-xl transition-all shadow-xl shadow-blue-600/20"
                    >
                        <Zap className="w-4 h-4 fill-white" />
                        New Slay
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-gray-500 font-medium">Retrieving your slays...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10">
                            <Zap className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">No slays yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                Your history is empty. Start by optimizing your first resume in Slay Mode.
                            </p>
                        </div>
                        <Link
                            href="/dashboard/workspace"
                            className="bg-white text-black font-black px-8 py-3 rounded-xl transition-all hover:bg-gray-200"
                        >
                            Start Slaying
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black bg-black/20">
                                    <th className="px-8 py-6">Job Title & Company</th>
                                    <th className="px-8 py-6">Match Score</th>
                                    <th className="px-8 py-6">Date Optimized</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {applications.map((application, idx) => (
                                        <motion.tr
                                            key={application.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-white/[0.02] transition-all group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-colors">
                                                        <FileText className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                            {application.job_title || `Slay #${application.id}`}
                                                        </p>
                                                        {application.company && (
                                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                                                {application.company}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${getScoreColor(application.match_score)}`}>
                                                    <Target className="w-3.5 h-3.5" />
                                                    {application.match_score ?? "—"}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <CalendarDays className="w-4 h-4 opacity-50" />
                                                    {new Date(application.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/dashboard/slays/${application.id}`}
                                                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/10 transition-all"
                                                    >
                                                        View Slay
                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-6 border-t border-white/5 bg-black/20">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Page {page + 1} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white transition-all border border-white/10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white transition-all border border-white/10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
