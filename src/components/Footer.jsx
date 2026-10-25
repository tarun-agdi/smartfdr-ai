import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 bg-white border-t border-gray-300 py-6 px-6 text-xs text-gray-500">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-gray-700 font-semibold mb-1">
            © 2026 All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-500 text-[11px]">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#1e3a5f] hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#1e3a5f] hover:underline">
              Terms of Use
            </a>
            <span>•</span>
            <a href="#sitemap" onClick={(e) => e.preventDefault()} className="hover:text-[#1e3a5f] hover:underline">
              Sitemap
            </a>
            <span>•</span>
            <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-[#1e3a5f] hover:underline">
              Contact Support
            </a>
            <span>•</span>
            <a href="#accessibility" onClick={(e) => e.preventDefault()} className="hover:text-[#1e3a5f] hover:underline">
              Accessibility Statement
            </a>
          </div>
        </div>
        <div className="text-right md:shrink-0 text-[11px] text-gray-500 bg-gray-50 px-3 py-1.5 border border-gray-200 rounded-sm">
          <div>Portal Environment: <span className="font-semibold text-gray-800">Demo Production Build</span></div>
          <div>Last System Sync: <span className="font-medium">25 Oct 2026, 14:32 IST</span></div>
        </div>
      </div>
    </footer>
  );
}
