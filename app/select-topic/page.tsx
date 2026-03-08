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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Link href="/" className="text-gray-500 hover:text-gray-900 smooth-transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Select Topic</h1>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 mb-6">Choose a topic to review, or review all topics together.</p>
          
          <button
            onClick={handleAllTopics}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl smooth-transition shadow-sm hover:shadow-md mb-4"
          >
            <h3 className="text-xl font-semibold mb-1">All Topics</h3>
            <p className="text-blue-100 font-light">Review questions from all topics</p>
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">By Topic</h2>
          
          {topics.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">No topics available. Import questions to get started.</p>
              <Link href="/import" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                Go to Import
              </Link>
            </div>
          ) : (
            topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className="w-full text-left px-6 py-5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-gray-50 smooth-transition group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                  {topic.name}
                </h3>
                {topic.description && (
                  <p className="text-sm text-gray-500 font-light">{topic.description}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
