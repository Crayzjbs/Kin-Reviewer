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
  const [showTimerSelection, setShowTimerSelection] = useState(true);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

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

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerActive, timeRemaining]);

  const startQuiz = (minutes: number) => {
    setTimerDuration(minutes);
    setTimeRemaining(minutes * 60);
    setTimerActive(minutes > 0);
    setShowTimerSelection(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scorePercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

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
    setTotalAnswered(totalAnswered + 1);
    if (correct) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }

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

  if (showTimerSelection) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Link href="/select-topic" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 smooth-transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Set Timer</h1>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
              How long do you want to study?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
              Select a time limit or choose no timer
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => startQuiz(15)}
                className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 smooth-transition group"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">15</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">minutes</div>
              </button>
              
              <button
                onClick={() => startQuiz(30)}
                className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 smooth-transition group"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">30</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">minutes</div>
              </button>
              
              <button
                onClick={() => startQuiz(45)}
                className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 smooth-transition group"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">45</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">minutes</div>
              </button>
              
              <button
                onClick={() => startQuiz(60)}
                className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 smooth-transition group"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">60</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">minutes</div>
              </button>
            </div>
            
            <button
              onClick={() => startQuiz(0)}
              className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-4 rounded-2xl smooth-transition font-medium"
            >
              No Timer - Study at my own pace
            </button>
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
          <div className="flex items-center gap-4">
            {timerDuration > 0 && (
              <div className={`px-4 py-2 rounded-xl font-mono text-lg font-semibold ${
                timeRemaining < 60 ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900' : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
              }`}>
                {formatTime(timeRemaining)}
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Score: </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{scorePercentage}%</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">{correctCount}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">{incorrectCount}</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                <div className="text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} / {dueCards.length}
                </div>
              </div>
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
                {isCorrect ? (
                  <p className="text-sm text-green-600 dark:text-green-400 mb-3 font-medium italic">
                    Lezzgoo!!, Goodjob love ko keep it up&lt;333
                  </p>
                ) : (
                  <p className="text-sm text-pink-600 dark:text-pink-400 mb-3 font-medium italic">
                    It's okay love ko! Kaya yan, lovelove kin&lt;33
                  </p>
                )}
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

              <div className="space-y-4">
                <button
                  onClick={() => handleRating('good')}
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:opacity-90 text-white px-6 py-4 rounded-2xl smooth-transition font-semibold text-lg"
                >
                  Next Question
                </button>
                
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 text-center">
                    How well did you know this?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRating('again')}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg smooth-transition text-xs font-medium border border-red-500/20"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => handleRating('hard')}
                      className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-lg smooth-transition text-xs font-medium border border-orange-500/20"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => handleRating('good')}
                      className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg smooth-transition text-xs font-medium border border-green-500/20"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => handleRating('easy')}
                      className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg smooth-transition text-xs font-medium border border-blue-500/20"
                    >
                      Easy
                    </button>
                  </div>
                </div>
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
