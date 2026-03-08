'use client';

import Link from 'next/link';
import { Github, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-slate-800/50 glass-card">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Exam Anki</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered spaced repetition learning system for exam preparation.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/Crayzjbs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 smooth-transition group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 smooth-transition" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://github.com/Crayzjbs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 smooth-transition group"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 smooth-transition" />
                <span className="text-sm">Facebook</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Supported By</h3>
            <a
              href="https://www.facebook.com/sie.jamilaren"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-blue-400 smooth-transition"
            >
              Sie Jamilaren
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800/50 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Kienth Justine Javines. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
