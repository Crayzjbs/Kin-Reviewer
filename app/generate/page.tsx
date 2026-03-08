'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Topic, Question, ReviewCard } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function GeneratePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Question['difficulty']>('medium');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<Question[]>([]);

  useEffect(() => {
    setTopics(storage.getTopics());
  }, []);

  const generateQuestions = () => {
    if (!selectedTopic) return;
    
    setGenerating(true);
    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic) return;

    const sampleQuestions: Question[] = [];
    const questionTemplates = [
      {
        question: `What is the primary purpose of ${topic.name}?`,
        answer: `To understand and apply ${topic.name} concepts`,
        type: 'short-answer' as const,
      },
      {
        question: `Which of the following best describes ${topic.name}?`,
        answer: `A fundamental concept in networking`,
        type: 'multiple-choice' as const,
        options: [
          'A fundamental concept in networking',
          'An outdated technology',
          'A programming language',
          'A hardware component',
        ],
      },
      {
        question: `${topic.name} is essential for network communication. True or False?`,
        answer: 'True',
        type: 'true-false' as const,
        options: ['True', 'False'],
      },
      {
        question: `Explain the key benefits of understanding ${topic.name}`,
        answer: `Better network design, troubleshooting, and optimization`,
        type: 'short-answer' as const,
      },
      {
        question: `What are the main components of ${topic.name}?`,
        answer: `Various protocols, devices, and configurations`,
        type: 'short-answer' as const,
      },
    ];

    for (let i = 0; i < Math.min(count, questionTemplates.length); i++) {
      const template = questionTemplates[i];
      const newQuestion: Question = {
        id: generateId(),
        topicId: selectedTopic,
        question: template.question,
        answer: template.answer,
        type: template.type,
        difficulty: difficulty,
        options: template.options,
        createdAt: new Date(),
      };
      sampleQuestions.push(newQuestion);
    }

    setGenerated(sampleQuestions);
    setGenerating(false);
  };

  const saveQuestions = () => {
    const questions = storage.getQuestions();
    const updatedQuestions = [...questions, ...generated];
    storage.saveQuestions(updatedQuestions);

    const cards = storage.getReviewCards();
    const newCards: ReviewCard[] = generated.map(q => ({
      id: generateId(),
      questionId: q.id,
      question: q,
      nextReview: new Date(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
    }));
    storage.saveReviewCards([...cards, ...newCards]);

    setGenerated([]);
    alert(`${generated.length} questions saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Generate Questions</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Auto-Generate Questions
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Choose a topic...</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Question['difficulty'])}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              onClick={generateQuestions}
              disabled={!selectedTopic || generating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {generating ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>

        {generated.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Questions ({generated.length})
              </h3>
              <button
                onClick={saveQuestions}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save All Questions
              </button>
            </div>

            <div className="space-y-4">
              {generated.map((question, index) => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                      Question {index + 1}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {question.type}
                    </span>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded">
                      {question.difficulty}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {question.question}
                  </h4>
                  {question.options && (
                    <ul className="list-disc list-inside mb-2 text-gray-600 dark:text-gray-300 text-sm">
                      {question.options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                    Answer: {question.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
