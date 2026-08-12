"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Copy, Check, AlertTriangle } from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";
import { setApiKey } from "@/utils/common";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", fullName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [apiKey, setLocalApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmedSaved, setConfirmedSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.register(formData.email, formData.fullName || undefined);
      setLocalApiKey(response.api_key);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError("An account with this email already exists.");
      } else {
        const detail = axios.isAxiosError(err) ? err.response?.data?.detail : undefined;
        setError(detail || "Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    if (!apiKey) return;
    setApiKey(apiKey);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-6 text-white">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">AI ATS Resume Slayer</span>
      </Link>

      <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {!apiKey ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-400 text-sm mb-6">Start optimizing your resumes and landing more interviews.</p>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name (optional)</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account? <Link href="/login" className="text-blue-500 hover:underline font-medium">Log in</Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Save your API key</h2>
            <p className="text-gray-400 text-sm mb-6">
              This is the only time your key will be shown. There is no password to reset it with — if you lose it, you&apos;ll need to create a new account.
            </p>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
              <code className="text-sm text-blue-400 break-all">{apiKey}</code>
              <button
                type="button"
                onClick={handleCopy}
                className="flex-shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                aria-label="Copy API key"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-xs leading-relaxed">
                Store this somewhere safe (a password manager works well). It cannot be recovered or regenerated.
              </p>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedSaved}
                onChange={(e) => setConfirmedSaved(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-700 bg-[#0a0a0a] text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">I&apos;ve saved my API key somewhere safe.</span>
            </label>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!confirmedSaved}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              Continue to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
