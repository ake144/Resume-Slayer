"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getApiKey, setApiKey, clearAuth } from "@/utils/common";

export default function LoginPage() {
  const router = useRouter();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const previousKey = getApiKey();
    setApiKey(apiKeyInput.trim());

    try {
      await api.getMe();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      if (previousKey) {
        setApiKey(previousKey);
      } else {
        clearAuth();
      }
      setError("Invalid API key. Double-check what you pasted and try again.");
    } finally {
      setIsLoading(false);
    }
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
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-400 text-sm mb-6">Paste your API key to access your dashboard.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">API Key</label>
            <textarea
              required
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              rows={2}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 resize-none"
              placeholder="rsag_..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !apiKeyInput.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4"
          >
            {isLoading ? "Verifying..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
