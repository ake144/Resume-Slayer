'use client'

import { useEffect, useState } from "react";
import { Navbar } from "../components/landing/navbar";
import { InputSection } from "../components/workspace/input-section";
import { Workspace as WorkspaceView } from "../components/workspace/workspace";

export default function WorkspacePage() {
  // In a real app, this would be managed by state/context based on whether the user has submitted data
  const hasSubmitted = false; // Toggle this to true to see the workspace view
  
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      window.location.href = "/login";
    } else {
      setToken(t);
    }
  }, []);

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
