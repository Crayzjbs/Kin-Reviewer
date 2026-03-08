'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Question, Topic, ReviewCard } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    question: '',
    answer: '',
    type: 'multiple-choice' as Question['type'],
    difficulty: 'medium' as Question['difficulty'],
    options: ['', '', '', ''],
  });

  useEffect(() => {
    setQuestions(storage.getQuestions());
    setTopics(storage.getTopics());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: Question = {
      id: generateId(),
      topicId: formData.topicId,
      question: formData.question,
      answer: formData.answer,
      type: formData.type,
      difficulty: formData.difficulty,
      options: formData.type === 'multiple-choice' ? formData.options.filter(o => o) : undefined,
      createdAt: new Date(),
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    storage.saveQuestions(updatedQuestions);

    const newCard: ReviewCard = {
      id: generateId(),
      questionId: newQuestion.id,
      question: newQuestion,
      nextReview: new Date(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
    };
    const cards = storage.getReviewCards();
    storage.saveReviewCards([...cards, newCard]);

    setFormData({
      topicId: '',
      question: '',
      answer: '',
      type: 'multiple-choice',
      difficulty: 'medium',
      options: ['', '', '', ''],
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    storage.saveQuestions(updatedQuestions);

    const cards = storage.getReviewCards().filter(c => c.questionId !== id);
    storage.saveReviewCards(cards);
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Questions</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">New Question</h2>
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
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Question['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Question['difficulty'] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  required
                />
              </div>
              {formData.type === 'multiple-choice' && (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Options</label>
                  {formData.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="w-full px-4 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Correct Answer</label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Question
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
          {questions.map((question) => (
            <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {getTopicName(question.topicId)}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                      {question.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {question.question}
                  </h3>
                  {question.options && (
                    <ul className="list-disc list-inside mb-2 text-gray-600 dark:text-gray-300">
                      {question.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    Answer: {question.answer}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {questions.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No questions yet. Click "Add Question" to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
