'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { AnswerKey, Topic } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function AnswerKeysPage() {
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    examName: '',
    questions: [{ questionNumber: 1, correctAnswer: '', explanation: '' }],
  });

  useEffect(() => {
    setAnswerKeys(storage.getAnswerKeys());
    setTopics(storage.getTopics());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnswerKey: AnswerKey = {
      id: generateId(),
      topicId: formData.topicId,
      examName: formData.examName,
      questions: formData.questions,
      createdAt: new Date(),
    };
    const updatedKeys = [...answerKeys, newAnswerKey];
    setAnswerKeys(updatedKeys);
    storage.saveAnswerKeys(updatedKeys);
    setFormData({
      topicId: '',
      examName: '',
      questions: [{ questionNumber: 1, correctAnswer: '', explanation: '' }],
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedKeys = answerKeys.filter(k => k.id !== id);
    setAnswerKeys(updatedKeys);
    storage.saveAnswerKeys(updatedKeys);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionNumber: formData.questions.length + 1, correctAnswer: '', explanation: '' }],
    });
  };

  const getTopicName = (topicId: string) => {
    return topics.find(t => t.id === topicId)?.name || 'Unknown Topic';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Answer Keys</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Answer Key
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">New Answer Key</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Topic</label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a topic</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Exam Name</label>
                <input
                  type="text"
                  value={formData.examName}
                  onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Questions</label>
                {formData.questions.map((q, index) => (
                  <div key={index} className="mb-3 p-3 border border-gray-200 dark:border-gray-600 rounded">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="number"
                        value={q.questionNumber}
                        onChange={(e) => {
                          const newQuestions = [...formData.questions];
                          newQuestions[index].questionNumber = parseInt(e.target.value);
                          setFormData({ ...formData, questions: newQuestions });
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Question #"
                      />
                      <input
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) => {
                          const newQuestions = [...formData.questions];
                          newQuestions[index].correctAnswer = e.target.value;
                          setFormData({ ...formData, questions: newQuestions });
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Correct Answer"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => {
                        const newQuestions = [...formData.questions];
                        newQuestions[index].explanation = e.target.value;
                        setFormData({ ...formData, questions: newQuestions });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Explanation (optional)"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Question
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Answer Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {answerKeys.map((key) => (
            <div key={key.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {key.examName}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    {getTopicName(key.topicId)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(key.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {key.questions.map((q, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Q{q.questionNumber}:</span>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-medium">{q.correctAnswer}</span>
                      {q.explanation && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {answerKeys.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No answer keys yet. Click "Add Answer Key" to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
