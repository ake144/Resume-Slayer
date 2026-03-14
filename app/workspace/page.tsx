'use client'

import { Navbar } from "../components/landing/navbar";
import { InputSection } from "../components/workspace/input-section";
import { Workspace as WorkspaceView } from "../components/workspace/workspace";

export default function WorkspacePage() {
  // In a real app, this would be managed by state/context based on whether the user has submitted data
  const hasSubmitted = false; // Toggle this to true to see the workspace view
  
  const token = localStorage.getItem("token");

   if (!token) {
    // If no token, redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null; // Render nothing while redirecting
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans antialiased">
      <Navbar />
      {hasSubmitted ? <WorkspaceView /> : <InputSection  token={token}/>}
    </main>
  );
}
