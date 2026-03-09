'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseStorage } from '@/lib/supabase-storage';
import { Subject } from '@/lib/types';

export default function SelectSubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSubjects() {
      try {
        const allSubjects = await supabaseStorage.getSubjects();
        setSubjects(allSubjects);
      } catch (error) {
        console.error('Failed to load subjects:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  const handleSubjectSelect = (subjectId: string) => {
    router.push(`/select-topic?subject=${subjectId}`);
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Link href="/" className="text-slate-400 hover:text-white smooth-transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-white">Select Subject</h1>
        </div>

        <p className="text-slate-400 mb-8">Choose a subject to begin your review.</p>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 glass-card rounded-xl">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <p className="text-slate-400">Loading subjects...</p>
              </div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl">
              <p className="text-slate-400">No subjects available.</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectSelect(subject.id)}
                className="w-full group relative glass-card rounded-2xl p-8 smooth-transition hover:scale-[1.02] glow-border overflow-hidden text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 smooth-transition"></div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="text-4xl">{subject.icon || '📚'}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-400 smooth-transition">
                      {subject.name}
                    </h3>
                    <p className="text-slate-400 font-light leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                  <BookOpen className="w-6 h-6 text-slate-500 group-hover:text-blue-400 smooth-transition" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
