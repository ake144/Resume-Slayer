export function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-24 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Bottom CTA */}
        <div className="bg-blue-600 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden mb-32 z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent opacity-50 blur-2xl z-0" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Ready to Land Your<br />Dream Offer?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of candidates who stopped guessing and started getting hired. 
              Start your ATS-optimized journey today.
            </p>
            <a href="/workspace" className="inline-block bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-black/20">
              Start Slaying for Free
            </a>
            <p className="mt-6 text-blue-200 text-sm">
              No credit card required. Free forever version available.
            </p>
          </div>
        </div>

        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5 pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
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
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Empowering job seekers with elite AI technology to navigate the modern hiring landscape and secure life-changing opportunities.
            </p>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-400">Product</h4>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Features</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Templates</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">API</a>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-400">Company</h4>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">About Us</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Careers</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Contact</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Privacy</a>
          </div>
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-sm tracking-wider uppercase mb-6 text-gray-400">Resources</h4>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Blog</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Help Center</a>
            <a href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">Job Market Reports</a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-900 pt-8 mt-8">
          <p className="text-xs text-gray-600">
            © 2024 AI ATS Resume Slayer. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}