'use client'

import { Navbar } from "../../components/landing/navbar";
import { InputSection } from "../../components/workspace/input-section";

export default function WorkspacePage() {
  // Auth is already guaranteed by app/dashboard/layout.tsx's guard, which
  // this page is nested under - no separate check needed here.
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans antialiased">
      <Navbar />
      <InputSection />
    </main>
  );
}
