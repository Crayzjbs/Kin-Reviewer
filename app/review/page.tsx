'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabaseStorage } from '@/lib/supabase-storage';
import { ReviewCard, ReviewRating, Analogy, Question } from '@/lib/types';
import { getDueCards, calculateNextReview } from '@/lib/spaced-repetition';
import { generateAnalogy } from '@/lib/analogy-generator';
import { generateId } from '@/lib/utils';
import { generateEnhancedExplanation, generateHumanAnalogy } from '@/lib/explanation-generator';

function ReviewContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic');
  
  const [dueCards, setDueCards] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentAnalogy, setCurrentAnalogy] = useState<string>('');
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [enhancedExplanation, setEnhancedExplanation] = useState<string>('');
  const [humanAnalogy, setHumanAnalogy] = useState<string>('');
  const [topicName, setTopicName] = useState<string>('All Topics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviewCards() {
      try {
        const [questions, existingCards, topics] = await Promise.all([
          supabaseStorage.getQuestions(),
          supabaseStorage.getReviewCards(),
          supabaseStorage.getTopics()
        ]);

        let filteredQuestions = questions;
        if (topicId) {
          filteredQuestions = questions.filter(q => q.topicId === topicId);
          const topic = topics.find(t => t.id === topicId);
          if (topic) {
            setTopicName(topic.name);
          }
        }

        const existingQuestionIds = new Set(existingCards.map(card => card.questionId));
        
        const newCards: ReviewCard[] = filteredQuestions
          .filter(q => !existingQuestionIds.has(q.id))
          .map(question => ({
            id: generateId(),
            questionId: question.id,
            question: question,
            nextReview: new Date(),
            interval: 0,
            easeFactor: 2.5,
            repetitions: 0,
          }));

        const allCards = [...existingCards, ...newCards];
        
        if (newCards.length > 0) {
          await supabaseStorage.saveReviewCards(allCards);
        }

        let filteredCards = allCards;
        if (topicId) {
          filteredCards = allCards.filter(card => card.question.topicId === topicId);
        }
        
        const due = getDueCards(filteredCards);
        setDueCards(due);
      } catch (error) {
        console.error('Failed to load review cards:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReviewCards();
  }, [topicId]);

  const currentCard = dueCards[currentIndex];

  const handleSubmitAnswer = () => {
    if (!currentCard) return;
    
    const correctAnswer = currentCard.question.correctAnswer || currentCard.question.answer;
    const isSingleAnswer = correctAnswer.length === 1;
    
    let correct = false;
    if (isSingleAnswer && currentCard.question.options) {
      const correctIndex = correctAnswer.charCodeAt(0) - 65;
      const correctOptionText = currentCard.question.options[correctIndex];
      correct = userAnswer.trim() === correctOptionText;
    } else {
      const userLetters = userAnswer.split('|||').map(opt => {
        const idx = currentCard.question.options?.indexOf(opt);
        return idx !== undefined && idx >= 0 ? String.fromCharCode(65 + idx) : '';
      }).filter(l => l).sort().join('');
      correct = userLetters === correctAnswer.split('').sort().join('');
    }
    
    setIsCorrect(correct);
    setShowAnswer(true);

    generateEnhancedExplanation(
      currentCard.question.question,
      correctAnswer,
      currentCard.question.explanation
    ).then(explanation => {
      setEnhancedExplanation(explanation);
    });

    generateHumanAnalogy(
      currentCard.question.question,
      correctAnswer,
      currentCard.question.explanation
    ).then(analogy => {
      setHumanAnalogy(analogy);
    });

    if (!correct) {
      generateAnalogy(
        currentCard.question.question,
        userAnswer,
        correctAnswer
      ).then(analogy => {
        setCurrentAnalogy(analogy);
        
        const newAnalogy: Analogy = {
          id: generateId(),
          questionId: currentCard.questionId,
          originalQuestion: currentCard.question.question,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
          analogy: analogy,
          createdAt: new Date(),
        };
        
        supabaseStorage.getAnalogies().then(analogies => {
          supabaseStorage.saveAnalogies([...analogies, newAnalogy]);
        });
      });
    }
  };

  const handleRating = async (rating: ReviewRating) => {
    if (!currentCard) return;

    const updates = calculateNextReview(currentCard, rating);
    const allCards = await supabaseStorage.getReviewCards();
    const updatedCards = allCards.map((card: ReviewCard) =>
      card.id === currentCard.id ? { ...card, ...updates } : card
    );
    await supabaseStorage.saveReviewCards(updatedCards);

    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);
    setShowAnalogy(false);
    setCurrentAnalogy('');
    setEnhancedExplanation('');
    setHumanAnalogy('');
    
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const newDue = getDueCards(updatedCards);
      setDueCards(newDue);
      setCurrentIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-400">Loading review cards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard || dueCards.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Link href="/select-topic" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 smooth-transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Review</h1>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-800">
            <CheckCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              All Caught Up
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              No cards due for review right now
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Link href="/select-topic" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 smooth-transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Review</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{topicName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                  setShowAnswer(false);
                  setUserAnswer('');
                  setIsCorrect(null);
                  setShowAnalogy(false);
                  setCurrentAnalogy('');
                  setEnhancedExplanation('');
                  setHumanAnalogy('');
                }
              }}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 smooth-transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous question"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {currentIndex + 1} of {dueCards.length}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-10 mb-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-8">
            <span className="px-3 py-1.5 bg-white dark:bg-black text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-800">
              {currentCard.question.difficulty}
            </span>
            <span className="px-3 py-1.5 bg-white dark:bg-black text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-800">
              {currentCard.question.type}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line">
              {currentCard.question.question.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < currentCard.question.question.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>

          {currentCard.question.options && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Options</p>
              <div className="space-y-3">
                {currentCard.question.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const correctAnswer = currentCard.question.correctAnswer || currentCard.question.answer;
                  const isSingleAnswer = correctAnswer.length === 1;
                  const isSelected = userAnswer.includes(option);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!showAnswer) {
                          if (isSingleAnswer) {
                            setUserAnswer(option);
                          } else {
                            if (userAnswer.includes(option)) {
                              const answers = userAnswer.split('|||').filter(a => a !== option);
                              setUserAnswer(answers.join('|||'));
                            } else {
                              const newAnswer = userAnswer ? `${userAnswer}|||${option}` : option;
                              setUserAnswer(newAnswer);
                            }
                          }
                        }
                      }}
                      disabled={showAnswer}
                      className={`w-full text-left px-4 py-3 rounded-lg border smooth-transition ${
                        showAnswer 
                          ? 'cursor-default border-gray-200 dark:border-gray-800' 
                          : isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-500'
                          : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                          showAnswer
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 font-light flex-1">
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!showAnswer ? (
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                Your Answer
              </label>
              <input
                type="text"
                value={userAnswer.replace(/\|\|\|/g, ', ')}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                className="w-full px-5 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-black text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 smooth-transition font-light"
                placeholder="Click options above to select your answer..."
                readOnly
                autoFocus
              />
              <button
                onClick={handleSubmitAnswer}
                className="w-full bg-blue-600 dark:bg-blue-500 hover:opacity-90 text-white px-6 py-4 rounded-2xl smooth-transition font-medium"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div>
              <div className={`p-6 rounded-2xl mb-6 border ${isCorrect ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'}`}>
                <div className="flex items-center gap-2 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <span className={`font-semibold text-sm ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 font-light">
                  <span className="font-medium">Your answer:</span> {userAnswer}
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-light">
                  <span className="font-medium">Correct answer:</span> {currentCard.question.correctAnswer || currentCard.question.answer}
                </p>
              </div>

              {enhancedExplanation && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-2xl p-6 mb-6">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Explanation
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-light leading-relaxed">
                    {enhancedExplanation}
                  </p>
                </div>
              )}

              {humanAnalogy && (
                <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900 rounded-2xl p-6 mb-6">
                  <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Human Analogy
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-light leading-relaxed italic">
                    {humanAnalogy}
                  </p>
                </div>
              )}

              {!isCorrect && currentAnalogy && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowAnalogy(!showAnalogy)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 mb-3 smooth-transition"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {showAnalogy ? 'Hide' : 'Show'} Learning Analogy
                    </span>
                  </button>
                  {showAnalogy && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-light leading-relaxed">
                        {currentAnalogy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                  How well did you know this?
                </p>
                <button
                  onClick={() => handleRating('again')}
                  className="w-full bg-red-500 hover:opacity-90 text-white px-6 py-3.5 rounded-2xl smooth-transition font-medium"
                >
                  Again
                </button>
                <button
                  onClick={() => handleRating('hard')}
                  className="w-full bg-orange-500 hover:opacity-90 text-white px-6 py-3.5 rounded-2xl smooth-transition font-medium"
                >
                  Hard
                </button>
                <button
                  onClick={() => handleRating('good')}
                  className="w-full bg-green-500 hover:opacity-90 text-white px-6 py-3.5 rounded-2xl smooth-transition font-medium"
                >
                  Good
                </button>
                <button
                  onClick={() => handleRating('easy')}
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:opacity-90 text-white px-6 py-3.5 rounded-2xl smooth-transition font-medium"
                >
                  Easy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading review...</div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
