"use client";

import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "axios";

export function InputSection() {
  const [activeTab, setActiveTab] = useState("paste");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobURL, setJobURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



    const submitData = async () => {
      // Basic validation
      if (!resumeText) {
        alert("Please paste your resume text first!");
        return;
      }
      
      setIsSubmitting(true);
      try {
        // Calling our Next.js test integration endpoint
        const response = await Axios.post("/api/slayer", { 
          resumeText, 
          jobDescription, 
          jobURL 
        });

        if (response.status === 200) {
          console.log("Data submitted successfully");
          const data = response.data;
          console.log("Response data:", data); 
          
          alert(`Integration Success!\nATS Score: ${data.atsScore}%\nCheck console for details.`);
        } else {
          console.error("Error submitting data", response);
          alert("Failed to submit data.");
        }
      } catch (error) {
        console.error("Error submitting data", error);
        alert("Integration request failed. Make sure the API route exists.");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Slay Mode</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            
            {/* Tabs */}
            <div className="flex bg-[#111] p-1 rounded-xl w-fit border border-gray-800">
              <button 
                onClick={() => setActiveTab("paste")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "paste" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Paste Text
              </button>
              <button 
                onClick={() => setActiveTab("upload")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "upload" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Upload PDF
              </button>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                1. Your Resume
              </h3>
              
              {activeTab === "paste" ? (
                <textarea 
                   value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-64 bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Paste your current resume content here..."
                />
              ) : (
                <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/50 bg-[#0a0a0a] rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                  <UploadCloud className="w-12 h-12 text-gray-500 group-hover:text-blue-500 mb-4 transition-colors" />
                  <p className="text-sm text-gray-400 mb-2">Drag and drop your PDF here, or <span className="text-blue-500 font-medium">browse files</span></p>
                  <p className="text-xs text-gray-600">Supports PDF, DOCX (Max 5MB)</p>
                </div>
              )}
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                2. Target Job
              </h3>
              <input 
                type="text" 
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all mb-4"
                placeholder="Paste Job URL (e.g., LinkedIn, Greenhouse, Ashby)"
                value={jobURL}
                onChange={(e) => setJobURL(e.target.value)}
              />
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-medium uppercase tracking-wider">OR PASTE DESCRIPTION</span>
                <div className="flex-grow border-t border-gray-800"></div>
              </div>
              <textarea 
                className="w-full h-32 mt-4 bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            
            <button 
              onClick={submitData} 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {isSubmitting ? "Slaying in Progress..." : "Slay My Resume"}
            </button>
          </div>

          {/* Right Column - Preview/Info */}
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 sticky top-28 h-fit hidden lg:flex flex-col">
            <div className="flex items-center gap-3 mb-6 bg-blue-500/10 w-fit px-4 py-2 rounded-full border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-400 text-sm font-semibold tracking-wide flex items-center">
                System Ready for Input
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Provide your current resume and the target job. Our agentic AI will deeply analyze the requirements, restructure your content to bypass ATS filters, and give you an unfair advantage.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Deep Job Analysis", desc: "Extracting critical keywords and hidden requirements." },
                { title: "ATS Optimization", desc: "Restructuring format and wording to maximize parse rates." },
                { title: "Skill Gap Identification", desc: "Pinpointing missing skills with personalized learning roadmaps." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 font-bold text-sm text-gray-400">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Free forever for first try</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No signup required</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}