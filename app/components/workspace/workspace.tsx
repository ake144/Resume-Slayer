"use client";

import { motion } from "framer-motion";
import { Download, Share2, AlertTriangle, CheckCircle2, ChevronRight, Map } from "lucide-react";
import { useState } from "react";

export function Workspace() {
  const [activeView, setActiveView] = useState("resume"); // "resume" or "roadmap"

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 flex flex-col">
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 flex flex-col h-full">
        
        {/* Workspace Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Workspace</h1>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">Target Role:</span>
                  <span className="text-white font-medium bg-[#111] px-3 py-1 rounded-full border border-gray-800">Senior React Developer</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Passed ATS Check
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-800 hover:bg-[#111] transition-colors text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Share Success
                </button>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full shadow-lg shadow-blue-600/20 transition-all text-sm font-bold">
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* View Toggles */}
            <div className="flex gap-4 mb-6">
               <button 
                onClick={() => setActiveView("resume")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeView === "resume" ? "bg-white text-black" : "bg-[#111] text-gray-400 border border-gray-800 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ATS Optimized Resume
              </button>
               <button 
                onClick={() => setActiveView("roadmap")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeView === "roadmap" ? "bg-white text-black" : "bg-[#111] text-gray-400 border border-gray-800 hover:text-white"
                }`}
              >
                <Map className="w-5 h-5" />
                Skill Gap Roadmap
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 border border-blue-500/20">NEW</span>
              </button>
            </div>


            {activeView === "resume" ? (
              /* SPLIT SCREEN RESUME VIEW */
              <div className="grid lg:grid-cols-2 gap-6 flex-1 h-[700px]">
                
                {/* Left - Original */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl flex flex-col overflow-hidden h-full">
                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#0a0a0a]">
                    <h3 className="font-semibold text-gray-300">Original Resume</h3>
                    <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 font-medium">
                      ATS Score: 42%
                    </span>
                  </div>
                  <div className="flex-1 p-8 overflow-y-auto bg-white/5 font-mono text-sm text-gray-400 relative">
                     {/* Fake Content Original */}
                     <div className="space-y-6 opacity-70">
                        <div className="border-b border-gray-700 border-dashed pb-4">
                          <h2 className="text-xl font-bold text-gray-200 mb-2">John Doe</h2>
                          <p>Web Developer | johndoe@email.com</p>
                        </div>
                        <div>
                          <h3 className="text-indigo-400 font-bold mb-2">Objective</h3>
                          <p className="leading-relaxed relative w-fit">
                            Hardworking individual looking for a position as a developer. Experience with making websites and working in teams.
                            {/* Trap Highlight */}
                            <span className="absolute -inset-1 bg-red-500/20 border border-red-500/50 rounded pointer-events-none" />
                          </p>
                        </div>
                        <div>
                         <h3 className="text-indigo-400 font-bold mb-2">Experience</h3>
                         <div className="mb-4">
                           <h4 className="font-semibold text-gray-200">Company A - Developer</h4>
                           <ul className="list-disc pl-5 mt-2 space-y-2 relative w-fit">
                             <li>Worked on the frontend using React.</li>
                             <li>Fixed bugs and attended meetings.</li>
                             {/* Trap Highlight */}
                             <span className="absolute -inset-2 bg-yellow-500/20 border border-yellow-500/50 rounded pointer-events-none" />
                           </ul>
                         </div>
                        </div>
                     </div>

                     {/* Tooltips Original */}
                     <div className="absolute top-32 right-12 bg-[#050505] border border-red-500/30 p-3 rounded-lg shadow-xl shadow-red-500/10 max-w-xs text-xs z-10 flex gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-red-500 mb-1">ATS Trap: Vague Objective</p>
                          <p className="text-gray-400">Bots filter out generic objectives. Missing critical keywords from the job description.</p>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Right - Optimized */}
                <div className="bg-[#111] border border-blue-500/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.1)] relative h-full">
                  
                  {/* Confetti (Static concept) */}
                  <div className="absolute top-0 right-10 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)]" />
                  <div className="absolute top-4 right-20 w-3 h-3 bg-purple-500 rounded-sm rotate-45 shadow-[0_0_10px_rgba(168,85,247,1)]" />
                  <div className="absolute top-6 right-4 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,1)]" />

                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#0a0a0a]">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white">Slayed Resume</h3>
                      <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Optimized</span>
                    </div>
                    <span className="text-sm bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full border border-green-500/30 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 className="w-4 h-4" />
                      94% Match Probability
                    </span>
                  </div>
                  <div className="flex-1 p-8 overflow-y-auto bg-white text-black font-serif text-[13px] leading-relaxed relative">
                    
                    {/* Fake Content Optimized - Designed like a real resume */}
                    <div className="max-w-2xl mx-auto">
                      <div className="border-b-2 border-black pb-4 mb-4 text-center">
                        <h1 className="text-3xl font-black mb-1">JOHN DOE</h1>
                        <p className="text-gray-600">San Francisco, CA | johndoe@email.com | github.com/johndoe | linkedin.com/in/johndoe</p>
                      </div>

                      <div className="mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
                        <p>Results-driven <span className="bg-blue-100 font-bold px-1 rounded">Senior React Developer</span> with 5+ years of experience architecting scalable front-end solutions. Proven expertise in <span className="bg-blue-100 font-bold px-1 rounded">Next.js</span>, <span className="bg-blue-100 font-bold px-1 rounded">TypeScript</span>, and state management, increasing application performance by 40%.</p>
                      </div>

                      <div className="mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Experience</h2>
                        
                        <div className="mb-3">
                          <div className="flex justify-between font-bold">
                            <span>TechCorp Inc.</span>
                            <span>Front-End Engineer</span>
                          </div>
                          <div className="flex justify-between text-gray-600 italic text-xs mb-2">
                            <span>San Francisco, CA</span>
                            <span>2020 - Present</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Spearheaded the migration of a legacy monolithic architecture to a <span className="bg-blue-100 font-bold px-1 rounded">component-based React</span> application, reducing load times by 2.5s.</li>
                            <li>Implemented dynamic rendering using <span className="bg-blue-100 font-bold px-1 rounded">Next.js Server-Side Rendering (SSR)</span>, boosting SEO rankings by 35%.</li>
                            <li>Collaborated with cross-functional teams using <span className="bg-blue-100 font-bold px-1 rounded">Agile/Scrum</span> methodologies to deliver 15+ major features.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating highlights info */}
                    <div className="absolute top-4 right-4 bg-black text-white p-3 rounded-xl shadow-2xl max-w-[200px] border border-gray-800 hidden md:block">
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Key Changes</p>
                      <ul className="text-xs space-y-2 text-gray-300">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" /> Added quantifiable metrics (40%, 2.5s)</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" /> Injected missing skills (Next.js, SSR)</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" /> Cleaned ATS parsing layout</li>
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
               /* ROADMAP VIEW */
               <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 lg:p-12 flex-1 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                     <Map className="w-96 h-96" />
                  </div>

                  <div className="max-w-3xl relative z-10">
                    <h2 className="text-3xl font-bold mb-4 font-mono">Your Unfair Advantage Plan.</h2>
                    <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                      We noticed a gap. The job description heavily weights <span className="text-blue-400 font-bold">GraphQL</span> and <span className="text-blue-400 font-bold">Testing (Jest/Cypress)</span>, which aren't strongly represented in your resume. Here is your 3-week actionable roadmap to bridge this gap before interviewing.
                    </p>

                    <div className="space-y-6">
                      
                      {/* Week 1 */}
                      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-blue-900/30 border border-blue-500/30 flex flex-col items-center justify-center font-bold text-blue-400">
                              <span className="text-[10px] uppercase">Week</span>
                              <span className="text-xl">01</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Mastering GraphQL Basics</h3>
                            <p className="text-gray-400 text-sm mb-4">Understand queries, mutations, and integrating Apollo Client with React.</p>
                            <div className="bg-[#111] rounded-lg p-4 border border-gray-800">
                              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Recommended Free Resources</h4>
                              <a href="#" className="flex items-center justify-between hover:bg-white/5 p-2 rounded -mx-2 transition-colors">
                                <span className="flex items-center gap-2 text-sm font-medium"><svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg> FreeCodeCamp: GraphQL for Beginners</span>
                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">2 Hrs</span>
                              </a>
                              <a href="#" className="flex items-center justify-between hover:bg-white/5 p-2 rounded -mx-2 transition-colors mt-1">
                                <span className="flex items-center gap-2 text-sm font-medium"><svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg> Official Apollo Client Docs Tutorial</span>
                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Reading</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Week 2 */}
                      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-800 flex flex-col items-center justify-center font-bold text-gray-400">
                              <span className="text-[10px] uppercase">Week</span>
                              <span className="text-xl">02</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Component Testing & E2E</h3>
                            <p className="text-gray-400 text-sm mb-4">Set up Jest and React Testing Library. Write your first Cypress tests.</p>
                             <div className="bg-[#111] rounded-lg p-4 border border-gray-800">
                              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Recommended Projects</h4>
                              <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full border border-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">Add 80% test coverage to a personal project.</p>
                                  <p className="text-xs text-gray-500 mt-1">Focus on user interactions and mocked API calls.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
               </div>
            )}

      </div>
    </div>
  );
}