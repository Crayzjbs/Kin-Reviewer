'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Analogy } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AnalogiesPage() {
  const [analogies, setAnalogies] = useState<Analogy[]>([]);

  useEffect(() => {
    setAnalogies(storage.getAnalogies());
  }, []);

  const handleDelete = (id: string) => {
    const updated = analogies.filter(a => a.id !== id);
    setAnalogies(updated);
    storage.saveAnalogies(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Analogies</h1>
        </div>

        <div className="space-y-4">
          {analogies.map((analogy) => (
            <div key={analogy.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-purple-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(new Date(analogy.createdAt))}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(analogy.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Question:
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{analogy.originalQuestion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Your Answer:</p>
                  <p className="text-gray-700 dark:text-gray-300">{analogy.userAnswer}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Correct Answer:</p>
                  <p className="text-gray-700 dark:text-gray-300">{analogy.correctAnswer}</p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Human Analogy:
                </h4>
                <p className="text-gray-700 dark:text-gray-300 italic">{analogy.analogy}</p>
              </div>
            </div>
          ))}
          {analogies.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No analogies yet. They'll appear here when you make mistakes during review!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
