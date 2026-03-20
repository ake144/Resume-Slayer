
import { Sidebar } from "../components/dashboard/sidebar";
import { Header } from "../components/dashboard/header";
import { getToken } from "@/utils/common";
import LoginPage from "../(auth)/login/page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}