
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/dashboard/sidebar";
import { Header } from "../components/dashboard/header";
import { getValidToken, clearAuth } from "@/utils/common";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const t = getValidToken();
    if (!t) {
      clearAuth();
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased flex">
      {isMobileSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setIsMobileSidebarOpen((state) => !state)} />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-350 mx-auto w-full pb-24 lg:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}