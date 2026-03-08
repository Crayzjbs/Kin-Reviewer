'use client';

import { useState } from 'react';
import Link from 'next/link';
import { importQuestionsFromJSON } from '@/lib/import-questions';

export default function ImportPage() {
  const [jsonData, setJsonData] = useState('');
  const [topicName, setTopicName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleImport = () => {
    if (!topicName.trim()) {
      setResult({
        success: 0,
        errors: ['Please enter a topic name'],
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const importResult = importQuestionsFromJSON(jsonData, topicName.trim());
      setResult(importResult);
      if (importResult.success > 0) {
        setJsonData('');
        setTopicName('');
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 smooth-transition"
          >
            ← Back to Home
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Import Questions
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Paste JSON data to import questions into the system
          </p>
        </header>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Topic Name *
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., CCNA 200-301, Network Fundamentals, etc."
            />
            <p className="text-sm text-gray-500 mt-2">
              All imported questions will be grouped under this topic name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              JSON Data (one question per line)
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
              placeholder='{"id": 1, "topic": "Wireless", "question": "...", "answer_letter": "A", ...}'
            />
          </div>

          <button
            onClick={handleImport}
            disabled={!jsonData.trim() || !topicName.trim() || isImporting}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Importing...' : 'Import Questions'}
          </button>

          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Import Results
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Successfully imported: <span className="font-semibold text-green-600">{result.success}</span> questions
              </p>
              {result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-red-600 mb-2">
                    Errors ({result.errors.length}):
                  </p>
                  <div className="max-h-48 overflow-y-auto bg-white p-3 rounded border border-red-200">
                    {result.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-600 mb-1">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Format Instructions
            </h3>
            <p className="text-xs text-gray-600">
              Each line should be a valid JSON object with the following fields:
            </p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
              <li>id: Question ID (number)</li>
              <li>topic: Topic name (string)</li>
              <li>question: Question text (string)</li>
              <li>answer_letter: Correct answer letter(s) (string)</li>
              <li>answer_text: Answer explanation (string)</li>
              <li>answer_full: Full answer text (string)</li>
              <li>is_dragdrop: Whether it's a drag-drop question (boolean)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
