export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-black/50 backdrop-blur-md border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">AI ATS Resume Slayer</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#success" className="hover:text-white transition-colors">Success Stories</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
        </div>
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
            Start Slaying for Free
          </button>
        </div>
      </div>
    </nav>
  );
}
