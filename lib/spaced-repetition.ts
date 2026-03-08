import { ReviewCard, ReviewRating } from './types';

export function calculateNextReview(
  card: ReviewCard,
  rating: ReviewRating
): Partial<ReviewCard> {
  let newInterval = card.interval;
  let newEaseFactor = card.easeFactor;
  let newRepetitions = card.repetitions;

  switch (rating) {
    case 'again':
      newInterval = 1;
      newRepetitions = 0;
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.2);
      break;
    
    case 'hard':
      newInterval = Math.max(1, Math.floor(card.interval * 1.2));
      newRepetitions = card.repetitions + 1;
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.15);
      break;
    
    case 'good':
      if (card.repetitions === 0) {
        newInterval = 1;
      } else if (card.repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.floor(card.interval * card.easeFactor);
      }
      newRepetitions = card.repetitions + 1;
      break;
    
    case 'easy':
      if (card.repetitions === 0) {
        newInterval = 4;
      } else {
        newInterval = Math.floor(card.interval * card.easeFactor * 1.3);
      }
      newRepetitions = card.repetitions + 1;
      newEaseFactor = card.easeFactor + 0.15;
      break;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
    nextReview,
    lastReviewed: new Date(),
  };
}

export function getDueCards(cards: ReviewCard[]): ReviewCard[] {
  const now = new Date();
  return cards.filter(card => new Date(card.nextReview) <= now);
}

export function getNewCards(cards: ReviewCard[], limit: number = 20): ReviewCard[] {
  return cards
    .filter(card => card.repetitions === 0)
    .slice(0, limit);
}
