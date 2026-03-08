'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Topic } from '@/lib/types';

export default function SelectTopicPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const router = useRouter();

  useEffect(() => {
    const allTopics = storage.getTopics();
    setTopics(allTopics);
  }, []);

  const handleTopicSelect = (topicId: string) => {
    router.push(`/review?topic=${topicId}`);
  };

  const handleAllTopics = () => {
    router.push('/review');
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Link href="/" className="text-slate-400 hover:text-white smooth-transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-white">Select Topic</h1>
        </div>

        <div className="mb-8">
          <p className="text-slate-400 mb-6">Choose a topic to review, or review all topics together.</p>
          
          <button
            onClick={handleAllTopics}
            className="w-full group relative glass-card rounded-2xl p-8 smooth-transition hover:scale-[1.02] glow-border overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50 group-hover:opacity-100 smooth-transition"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-1 text-white">All Topics</h3>
              <p className="text-slate-400 font-light">Review questions from all topics</p>
            </div>
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">By Topic</h2>
          
          {topics.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl">
              <p className="text-slate-400">No topics available. Import questions to get started.</p>
              <Link href="/import" className="text-blue-400 hover:text-blue-300 mt-2 inline-block smooth-transition">
                Go to Import
              </Link>
            </div>
          ) : (
            topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className="w-full text-left px-6 py-5 glass-card rounded-xl hover:glow-border smooth-transition group hover:scale-[1.01]"
              >
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 smooth-transition">
                  {topic.name}
                </h3>
                {topic.description && (
                  <p className="text-sm text-slate-400 font-light">{topic.description}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
