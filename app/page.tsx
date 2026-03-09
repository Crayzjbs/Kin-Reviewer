'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseStorage } from '@/lib/supabase-storage';
import { Sparkles, Brain, Zap, BookOpen, FileQuestion, Key, Lightbulb, Upload } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalQuestions: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [topics, questions, cards] = await Promise.all([
          supabaseStorage.getTopics(),
          supabaseStorage.getQuestions(),
          supabaseStorage.getReviewCards()
        ]);

        setStats({
          totalTopics: topics.length,
          totalQuestions: questions.length,
          totalReviews: cards.length,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-20 text-center animate-float">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">AI-Powered Learning</span>
          </div>
          <h1 className="text-7xl font-bold mb-6 tracking-tight">
            <span className="glow-text">Kin Reviewer</span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed mb-3">
            Master your exams with spaced repetition and AI-powered learning
          </p>
          <p className="text-sm text-slate-500 font-light">
            by Kienth Justine Javines
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <Link
            href="/select-subject"
            className="group relative glass-card rounded-2xl p-8 smooth-transition hover:scale-[1.02] glow-border overflow-hidden md:col-span-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50 group-hover:opacity-100 smooth-transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Start Review
              </h2>
              <p className="text-slate-400 font-light">
                Review your due cards using spaced repetition algorithm. Track your progress and master your topics efficiently.
              </p>
            </div>
          </Link>

          <div className="glass-card p-8 rounded-2xl hover:scale-[1.02] smooth-transition group">
            <div className="text-4xl font-bold mb-2 glow-text">
              {stats.totalTopics}
            </div>
            <div className="text-sm text-slate-400 font-medium tracking-wide uppercase mb-3">Topics</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Organized learning materials
            </p>
            <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:w-full smooth-transition"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="glass-card p-8 rounded-2xl hover:scale-[1.02] smooth-transition group">
            <div className="text-4xl font-bold mb-2 glow-text">
              {stats.totalQuestions}
            </div>
            <div className="text-sm text-slate-400 font-medium tracking-wide uppercase mb-3">Questions</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Practice questions ready
            </p>
            <div className="mt-4 h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full smooth-transition"></div>
          </div>

          <Link
            href="/generate"
            className="group relative glass-card rounded-2xl p-8 smooth-transition hover:scale-[1.02] glow-border overflow-hidden md:col-span-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-50 group-hover:opacity-100 smooth-transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Generate Questions
              </h2>
              <p className="text-slate-400 font-light">
                Auto-generate practice questions from your topics using AI. Create comprehensive study materials instantly.
              </p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <Link
            href="/topics"
            className="group glass-card p-6 rounded-2xl smooth-transition hover:scale-[1.02] hover:glow-border"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Topics
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Organize and manage your study materials by topic
            </p>
          </Link>

          <Link
            href="/questions"
            className="group glass-card p-6 rounded-2xl smooth-transition hover:scale-[1.02] hover:glow-border"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
              <FileQuestion className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Questions
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Browse and manage all your practice questions
            </p>
          </Link>

          <Link
            href="/import"
            className="group glass-card p-6 rounded-2xl smooth-transition hover:scale-[1.02] hover:glow-border"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
              <Upload className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Import
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Load questions from JSON files quickly
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            href="/answer-keys"
            className="group glass-card p-6 rounded-2xl smooth-transition hover:scale-[1.02] hover:glow-border"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
              <Key className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Answer Keys
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Store and access exam answer keys for reference
            </p>
          </Link>

          <Link
            href="/analogies"
            className="group glass-card p-6 rounded-2xl smooth-transition hover:scale-[1.02] hover:glow-border"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Analogies
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              AI-generated learning insights and analogies
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
