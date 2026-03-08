'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImportQuestion {
  id: number;
  topic: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer_letter: string;
  answer: string;
}

export default function AdminPage() {
  const [jsonData, setJsonData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleImport = async () => {
    if (!jsonData.trim()) {
      setResult({
        success: 0,
        errors: ['Please paste JSON data'],
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const questions: ImportQuestion[] = JSON.parse(jsonData);
      
      if (!Array.isArray(questions)) {
        throw new Error('Data must be an array of questions');
      }

      // Group questions by topic
      const topicMap = new Map<string, ImportQuestion[]>();
      questions.forEach(q => {
        if (!topicMap.has(q.topic)) {
          topicMap.set(q.topic, []);
        }
        topicMap.get(q.topic)!.push(q);
      });

      let successCount = 0;
      const errors: string[] = [];

      // Import each topic
      const topicEntries = Array.from(topicMap.entries());
      for (const [topicName, topicQuestions] of topicEntries) {
        const topicId = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Insert topic
        const { error: topicError } = await supabase
          .from('topics')
          .upsert({
            id: topicId,
            name: topicName,
            description: `${topicQuestions.length} questions`,
            created_at: new Date().toISOString()
          });

        if (topicError) {
          errors.push(`Topic "${topicName}": ${topicError.message}`);
          continue;
        }

        // Insert questions for this topic
        const dbQuestions = topicQuestions.map((q: ImportQuestion) => ({
          id: `${topicId}-q${q.id}`,
          topic_id: topicId,
          question: q.question,
          answer: q.answer,
          options: q.choices,
          type: 'multiple-choice',
          difficulty: 'medium',
          correct_answer: q.answer_letter,
          explanation: null,
          created_at: new Date().toISOString()
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .upsert(dbQuestions);

        if (questionsError) {
          errors.push(`Questions for "${topicName}": ${questionsError.message}`);
        } else {
          successCount += topicQuestions.length;
        }
      }

      setResult({
        success: successCount,
        errors: errors
      });

      if (successCount > 0) {
        setJsonData('');
      }
    } catch (error) {
      setResult({
        success: 0,
        errors: [error instanceof Error ? error.message : 'Import failed'],
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Link href="/" className="text-slate-400 hover:text-white smooth-transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-white">Admin - Import to Supabase</h1>
        </div>

        <p className="text-slate-400 mb-8">
          Paste your JSON array of questions to import them directly into Supabase database.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              JSON Data (Array of Questions)
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full h-96 px-4 py-3 glass-card text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm placeholder-slate-500"
              placeholder={`[
  {
    "id": 1,
    "topic": "History of Architecture",
    "question": "...",
    "choices": {
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    },
    "answer_letter": "D",
    "answer": "..."
  }
]`}
            />
          </div>

          <button
            onClick={handleImport}
            disabled={!jsonData.trim() || isImporting}
            className="glass-card glow-border hover:scale-[1.02] text-white px-8 py-3 rounded-lg font-medium smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {isImporting ? 'Importing to Supabase...' : 'Import to Supabase'}
          </button>

          {result && (
            <div className="mt-8 p-6 glass-card rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {result.success > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                Import Results
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                Successfully imported: <span className="font-semibold text-green-400">{result.success}</span> questions
              </p>
              {result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-red-400 mb-2">
                    Errors ({result.errors.length}):
                  </p>
                  <div className="max-h-48 overflow-y-auto bg-slate-900/50 p-3 rounded border border-red-500/30">
                    {result.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-400 mb-1">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-6 glass-card rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">
              Expected JSON Format
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Each question object should have the following fields:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li><code className="text-blue-400">id</code>: Question ID (number)</li>
              <li><code className="text-blue-400">topic</code>: Topic name (string)</li>
              <li><code className="text-blue-400">question</code>: Question text (string)</li>
              <li><code className="text-blue-400">choices</code>: Object with A, B, C, D properties</li>
              <li><code className="text-blue-400">answer_letter</code>: Correct answer letter (string)</li>
              <li><code className="text-blue-400">answer</code>: Correct answer text (string)</li>
            </ul>
            <p className="text-xs text-slate-500 mt-4">
              Questions will be automatically grouped by topic and stored in Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
