import { AnalysisHeader } from "../../components/dashboard/analysis-header";
import { CheckCircle2, AlertCircle, PlusCircle, Lightbulb, Zap } from "lucide-react";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AnalysisHeader />

      <main className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Comparison Analysis</h1>
            <p className="text-sm text-gray-400">Review the AI-enhanced optimizations for your target role.</p>
          </div>
          
          <div className="flex bg-[#111] p-1 rounded-md border border-gray-800">
             <button className="px-4 py-1.5 rounded text-sm font-medium text-gray-400 hover:text-white transition-colors">
               Side-by-Side
             </button>
             <button className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm font-medium shadow-md shadow-blue-600/20">
               Overlay View
             </button>
          </div>
        </div>

        {/* Resumes Split View */}
        <div className="grid md:grid-cols-2 gap-6 h-[500px]">
          
          {/* Unoptimized */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold tracking-wider text-gray-500">ORIGINAL RESUME</span>
              <span className="text-xs italic text-gray-500">Unoptimized</span>
            </div>
            <div className="flex-1 bg-white rounded-xl flex items-center justify-center p-8 relative overflow-hidden">
               {/* Skeleton loading UI for original resume */}
               <div className="absolute inset-0 p-8 opacity-20 pointer-events-none">
                 <div className="w-1/3 h-4 bg-gray-300 rounded mb-2"></div>
                 <div className="w-1/4 h-3 bg-gray-200 rounded mb-8"></div>

                 <div className="w-1/5 h-3 bg-gray-300 rounded mb-4"></div>
                 <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                 <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                 <div className="w-4/5 h-2 bg-gray-200 rounded mb-8"></div>

                 <div className="w-1/5 h-3 bg-gray-300 rounded mb-4"></div>
                 <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                 <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                 <div className="w-[85%] h-2 bg-gray-200 rounded mb-2"></div>
               </div>
               
               <div className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-md shadow-sm z-10 text-sm">
                 Draft Preview
               </div>
            </div>
          </div>

          {/* Optimized */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
               <span className="text-xs font-bold tracking-wider text-blue-500">OPTIMIZED RESUME</span>
               <span className="text-xs font-bold tracking-wider text-green-500 flex items-center gap-1">
                 <CheckCircle2 className="w-3 h-3" />
                 ATS COMPLIANT
               </span>
            </div>
            <div className="flex-1 bg-[#0a0a14] border border-blue-900/30 rounded-xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.05)]">
               
               <div className="font-sans text-[13px] text-gray-300 leading-relaxed">
                  <h2 className="text-xl font-bold text-white mb-1">ALEX RIVERA</h2>
                  <p className="text-blue-500 mb-8">Senior Full-Stack Engineer</p>

                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border-b border-gray-800 pb-2 mb-3">Professional Summary</h3>
                    <p>
                      Results-driven Engineer with 8+ years of experience in <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded border border-blue-500/30 font-medium">Cloud Architecture</span> and <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded border border-blue-500/30 font-medium">Scalable Microservices</span>. Proven track record of increasing system efficiency by 40% using <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded border border-blue-500/30 font-medium">Kubernetes</span>.
                    </p>
                  </div>

                  <div>
                     <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border-b border-gray-800 pb-2 mb-3">Experience</h3>
                     <div className="mb-4">
                       <div className="flex items-center justify-between font-bold text-white mb-1">
                         <span>TechCorp Solutions</span>
                         <span className="text-xs font-normal text-gray-500">2020 - Present</span>
                       </div>
                       <p className="text-blue-400 italic text-xs mb-3">Senior Developer</p>
                       <ul className="list-disc pl-4 space-y-2 text-xs">
                          <li>Spearheaded transition to <span className="bg-blue-500/20 text-blue-400 px-1 rounded border border-blue-500/30">AWS Lambda</span> reducing costs by $12k/month.</li>
                          <li>Managed <span className="bg-blue-500/20 text-blue-400 px-1 rounded border border-blue-500/30">Agile Workflows</span> for a team of 12 developers.</li>
                          <li>Optimized <span className="bg-blue-500/20 text-blue-400 px-1 rounded border border-blue-500/30">CI/CD Pipelines</span> using GitHub Actions.</li>
                       </ul>
                     </div>
                  </div>
               </div>
               
            </div>
          </div>
        </div>

        {/* Skills Gaps Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          
          {/* Hard Skills */}
          <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-blue-900/30 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">Missing Hard Skills</h3>
             </div>

             <div className="space-y-6">
                <div className="flex gap-4">
                  <PlusCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-white">Docker & Containerization</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Mention specific experience with container orchestration to hit the "DevOps" keyword requirements.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <PlusCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-white">GraphQL API Design</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">The job description emphasizes modern API standards. Add GraphQL to your technical toolkit section.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <PlusCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-white">Redis Caching</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Found 4 mentions of "performance optimization". Include Redis to demonstrate low-latency skills.</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Soft Skills */}
          <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-blue-900/30 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">Missing Soft Skills</h3>
             </div>

             <div className="space-y-6">
                <div className="flex gap-4">
                  <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 bg-blue-500/20 rounded-full p-0.5 border border-blue-500/30 box-content" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-white">Cross-functional Collaboration</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Describe a project where you worked directly with Product and Design teams.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                   <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 bg-blue-500/20 rounded-full p-0.5 border border-blue-500/30 box-content" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-white">Mentorship & Leadership</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">For Senior roles, ATS looks for "mentored," "guided," or "onboarded" keywords.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                   <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 bg-blue-500/20 rounded-full p-0.5 border border-blue-500/30 box-content" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-white">Stakeholder Management</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Highlight your ability to translate technical concepts for non-technical leadership.</p>
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Ready to slay the ATS?</h3>
            <p className="text-sm text-gray-400">Your resume is now 85% optimized. These changes will put you in the top 5% of applicants.</p>
          </div>
          <button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
            <Zap className="w-4 h-4 fill-white" />
            Apply All Optimizations
          </button>
        </div>

      </main>
    </div>
  );
}