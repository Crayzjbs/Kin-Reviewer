import { Topic, Question, AnswerKey, ReviewCard, Analogy } from './types';

// Cache for synchronous access
let cachedTopics: Topic[] = [];
let cachedQuestions: Question[] = [];
let cachedReviewCards: ReviewCard[] = [];
let cachedAnalogies: Analogy[] = [];
let cachedAnswerKeys: AnswerKey[] = [];
let isLoaded = false;

// Secure API client - all calls go through Next.js API routes
const api = {
  async get(endpoint: string) {
    const res = await fetch(`/api/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return res.json();
  },
  
  async post(endpoint: string, data: any) {
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to save ${endpoint}`);
    return res.json();
  }
};

export const storage = {
  getTopics: (): Topic[] => {
    return cachedTopics;
  },

  saveTopics: (topics: Topic[]) => {
    cachedTopics = topics;
    api.post('topics', topics).catch(err => 
      console.error('Failed to save topics:', err)
    );
  },

  getQuestions: (): Question[] => {
    return cachedQuestions;
  },

  saveQuestions: (questions: Question[]) => {
    cachedQuestions = questions;
    api.post('questions', questions).catch(err => 
      console.error('Failed to save questions:', err)
    );
  },

  getAnswerKeys: (): AnswerKey[] => {
    return cachedAnswerKeys;
  },

  saveAnswerKeys: (answerKeys: AnswerKey[]) => {
    cachedAnswerKeys = answerKeys;
    api.post('answer-keys', answerKeys).catch(err => 
      console.error('Failed to save answer keys:', err)
    );
  },

  getReviewCards: (): ReviewCard[] => {
    return cachedReviewCards;
  },

  saveReviewCards: (cards: ReviewCard[]) => {
    cachedReviewCards = cards;
    api.post('review-cards', cards).catch(err => 
      console.error('Failed to save review cards:', err)
    );
  },

  getAnalogies: (): Analogy[] => {
    return cachedAnalogies;
  },

  saveAnalogies: (analogies: Analogy[]) => {
    cachedAnalogies = analogies;
    api.post('analogies', analogies).catch(err => 
      console.error('Failed to save analogies:', err)
    );
  },

  async loadFromBackend() {
    if (isLoaded) return;
    
    try {
      const [topics, questions, cards, analogies, answerKeys] = await Promise.all([
        api.get('topics'),
        api.get('questions'),
        api.get('review-cards'),
        api.get('analogies'),
        api.get('answer-keys'),
      ]);

      cachedTopics = topics;
      cachedQuestions = questions;
      cachedReviewCards = cards;
      cachedAnalogies = analogies;
      cachedAnswerKeys = answerKeys;
      isLoaded = true;
    } catch (error) {
      console.error('Failed to load from backend:', error);
    }
  },
};
