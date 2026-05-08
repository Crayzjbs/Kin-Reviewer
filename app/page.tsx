'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseStorage } from '@/lib/supabase-storage';
import { Sparkles, Brain, Zap, BookOpen, FileQuestion } from 'lucide-react';

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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-primary)'
          }}>
            <Sparkles className="w-4 h-4" style={{ color: 'var(--apple-blue)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>AI-Powered Learning</span>
          </div>
          <h1 className="apple-title mb-4">
            Kin Reviewer
          </h1>
          <p className="apple-body max-w-2xl mx-auto mb-2">
            Master your exams with spaced repetition and AI-powered learning
          </p>
          <p className="apple-caption">
            by Kienth Justine Javines
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/select-subject"
            className="apple-card p-8 md:col-span-2 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 smooth-transition" style={{
                background: 'linear-gradient(135deg, var(--apple-blue) 0%, #0051D5 100%)'
              }}>
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="apple-subtitle mb-2">
                  Start Review
                </h2>
                <p className="apple-body">
                  Review your due cards using spaced repetition algorithm. Track your progress and master your topics efficiently.
                </p>
              </div>
            </div>
          </Link>

          <div className="apple-card p-8 group">
            <div className="text-5xl font-bold mb-3" style={{ color: 'var(--apple-blue)' }}>
              {stats.totalTopics}
            </div>
            <div className="apple-caption uppercase tracking-wider mb-2">Topics</div>
            <p className="apple-caption">
              Organized learning materials
            </p>
            <div className="mt-4 h-1 w-12 rounded-full group-hover:w-full smooth-transition" style={{
              background: 'var(--apple-blue)'
            }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="apple-card p-8 group">
            <div className="text-5xl font-bold mb-3" style={{ color: 'var(--apple-purple)' }}>
              {stats.totalQuestions}
            </div>
            <div className="apple-caption uppercase tracking-wider mb-2">Questions</div>
            <p className="apple-caption">
              Practice questions ready
            </p>
            <div className="mt-4 h-1 w-12 rounded-full group-hover:w-full smooth-transition" style={{
              background: 'var(--apple-purple)'
            }}></div>
          </div>

          <Link
            href="/generate"
            className="apple-card p-8 md:col-span-2 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 smooth-transition" style={{
                background: 'linear-gradient(135deg, var(--apple-purple) 0%, #9933FF 100%)'
              }}>
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="apple-subtitle mb-2">
                  Generate Questions
                </h2>
                <p className="apple-body">
                  Auto-generate practice questions from your topics using AI. Create comprehensive study materials instantly.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/topics"
            className="apple-card p-6 group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition" style={{
              background: 'rgba(0, 122, 255, 0.1)'
            }}>
              <BookOpen className="w-6 h-6" style={{ color: 'var(--apple-blue)' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontSize: '1.125rem' }}>
              Topics
            </h3>
            <p className="apple-caption">
              Organize and manage your study materials by topic
            </p>
          </Link>

          <Link
            href="/questions"
            className="apple-card p-6 group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition" style={{
              background: 'rgba(175, 82, 222, 0.1)'
            }}>
              <FileQuestion className="w-6 h-6" style={{ color: 'var(--apple-purple)' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontSize: '1.125rem' }}>
              Questions
            </h3>
            <p className="apple-caption">
              Browse and manage all your practice questions
            </p>
          </Link>

          <div className="apple-card p-6 group">
            <div className="text-4xl font-bold mb-3" style={{ color: 'var(--apple-green)' }}>
              {stats.totalReviews}
            </div>
            <div className="apple-caption uppercase tracking-wider mb-2">Review Cards</div>
            <p className="apple-caption">
              Cards in your study queue
            </p>
            <div className="mt-4 h-1 w-12 rounded-full group-hover:w-full smooth-transition" style={{
              background: 'var(--apple-green)'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
