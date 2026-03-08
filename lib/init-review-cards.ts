import { Question, ReviewCard } from './types';
import { storage } from './storage';
import { generateId } from './utils';

export function initializeReviewCards(): void {
  const questions = storage.getQuestions();
  const existingCards = storage.getReviewCards();
  
  const existingQuestionIds = new Set(existingCards.map(card => card.questionId));
  
  const newCards: ReviewCard[] = questions
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
  
  if (newCards.length > 0) {
    storage.saveReviewCards([...existingCards, ...newCards]);
  }
}
