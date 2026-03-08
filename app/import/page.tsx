'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { importQuestionsFromJSON } from '@/lib/import-questions';

export default function ImportPage() {
  const [jsonData, setJsonData] = useState('');
  const [topicName, setTopicName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      const text = await file.text();
      
      if (fileExtension === 'json') {
        setJsonData(text);
      } else if (fileExtension === 'txt') {
        setJsonData(text);
      } else if (fileExtension === 'csv') {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const jsonLines = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = { id: index + 1 };
            headers.forEach((header, i) => {
              obj[header] = values[i] || '';
            });
            return JSON.stringify(obj);
          });
        setJsonData(jsonLines.join('\n'));
      } else if (fileExtension === 'xlsx') {
        setResult({
          success: 0,
          errors: ['XLSX support requires additional setup. Please convert to CSV or JSON first.'],
        });
      }
    } catch (error) {
      setResult({
        success: 0,
        errors: [error instanceof Error ? error.message : 'Failed to read file'],
      });
    }
  };

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
    <div className="min-h-screen relative">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-12">
          <Link href="/" className="text-slate-400 hover:text-white smooth-transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-white">Import Questions</h1>
        </div>

        <p className="text-slate-400 mb-8">
          Upload a file or paste JSON data to import questions into the system
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Topic Name *
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full px-4 py-3 glass-card text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
              placeholder="e.g., CCNA 200-301, Network Fundamentals, etc."
            />
            <p className="text-sm text-slate-400 mt-2">
              All imported questions will be grouped under this topic name
            </p>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setUploadMethod('paste')}
              className={`flex-1 px-4 py-3 rounded-lg smooth-transition ${
                uploadMethod === 'paste'
                  ? 'glass-card glow-border text-white'
                  : 'bg-slate-800/30 text-slate-400 hover:text-white'
              }`}
            >
              Paste JSON
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 px-4 py-3 rounded-lg smooth-transition ${
                uploadMethod === 'file'
                  ? 'glass-card glow-border text-white'
                  : 'bg-slate-800/30 text-slate-400 hover:text-white'
              }`}
            >
              Upload File
            </button>
          </div>

          {uploadMethod === 'paste' ? (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                JSON Data (one question per line)
              </label>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full h-96 px-4 py-3 glass-card text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm placeholder-slate-500"
                placeholder='{"id": 1, "topic": "Wireless", "question": "...", "answer_letter": "A", ...}'
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Upload File (JSON, CSV, TXT, XLSX)
              </label>
              <div className="glass-card rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept=".json,.csv,.txt,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg cursor-pointer smooth-transition"
                >
                  Choose File
                </label>
                <p className="text-sm text-slate-400 mt-4">
                  Supported formats: JSON, CSV, TXT, XLSX
                </p>
              </div>
              {jsonData && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Preview
                  </label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="w-full h-48 px-4 py-3 glass-card text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!jsonData.trim() || !topicName.trim() || isImporting}
            className="glass-card glow-border hover:scale-[1.02] text-white px-8 py-3 rounded-lg font-medium smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Importing...' : 'Import Questions'}
          </button>

          {result && (
            <div className="mt-8 p-6 glass-card rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
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
              Format Instructions
            </h3>
            <p className="text-xs text-slate-400">
              Each line should be a valid JSON object with the following fields:
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
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
