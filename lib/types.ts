export interface Subject {
  id: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: Date;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  options?: string[];
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  difficulty: 'easy' | 'medium' | 'hard';
  correctAnswer?: string;
  explanation?: string;
  createdAt: Date;
}

export interface AnswerKey {
  id: string;
  topicId: string;
  examName: string;
  questions: {
    questionNumber: number;
    correctAnswer: string;
    explanation?: string;
  }[];
  createdAt: Date;
}

export interface ReviewCard {
  id: string;
  questionId: string;
  question: Question;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastReviewed?: Date;
}

export interface ReviewSession {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface Analogy {
  id: string;
  questionId: string;
  originalQuestion: string;
  userAnswer: string;
  correctAnswer: string;
  analogy: string;
  createdAt: Date;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
