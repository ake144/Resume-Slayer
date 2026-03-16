'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/utils/common";
import { SlayType } from "@/utils/types";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, ExternalLink, RefreshCw, BarChart3, Target, Briefcase, FileText, CheckCircle2 } from "lucide-react";

export default function SlayDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [slay, setSlay] = useState<SlayType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'optimized' | 'original'>('optimized');

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
          </div>

          <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 min-h-[600px] overflow-x-auto">
            <div className="max-w-none text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {activeTab === 'optimized' ? (
                slay.optimizedResume || 'No optimized resume data available.'
              ) : (
                slay.originalResume || 'No original resume data available.'
              )}
            </div>
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
                onClick={() => {
                  const text = activeTab === 'optimized' ? slay.optimizedResume : slay.originalResume;
                  navigator.clipboard.writeText(text || "");
                  alert("Copied to clipboard!");
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Copy {activeTab === 'optimized' ? 'Optimized' : 'Original'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
