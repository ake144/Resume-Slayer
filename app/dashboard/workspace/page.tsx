'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/landing/navbar";
import { InputSection } from "../../components/workspace/input-section";
import { Workspace as WorkspaceView } from "../../components/workspace/workspace";
import { getValidToken, clearAuth } from '@/utils/common';

export default function WorkspacePage() {
  // In a real app, this would be managed by state/context based on whether the user has submitted data
  const hasSubmitted = false; // Toggle this to true to see the workspace view
  
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const t = getValidToken();
    if (!t) {
      clearAuth();
      router.push('/login');
    } else {
      setToken(t);
    }
  }, [router]);

  if (!token) {
    return null; // Render nothing while redirecting
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans antialiased">
      <Navbar />
      {hasSubmitted ? <WorkspaceView /> : <InputSection  token={token}/>}
    </main>
  );
}
