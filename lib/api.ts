import { Topic, Question, ReviewCard, Analogy, AnswerKey } from './types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  async getTopics(): Promise<Topic[]> {
    const response = await fetch(`${API_URL}/topics`);
    return response.json();
  },

  async saveTopics(topics: Topic[]): Promise<void> {
    await fetch(`${API_URL}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topics),
    });
  },

  async getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_URL}/questions`);
    return response.json();
  },

  async saveQuestions(questions: Question[]): Promise<void> {
    await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questions),
    });
  },

  async getReviewCards(): Promise<ReviewCard[]> {
    const response = await fetch(`${API_URL}/review-cards`);
    return response.json();
  },

  async saveReviewCards(cards: ReviewCard[]): Promise<void> {
    await fetch(`${API_URL}/review-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cards),
    });
  },

  async getAnalogies(): Promise<Analogy[]> {
    const response = await fetch(`${API_URL}/analogies`);
    return response.json();
  },

  async saveAnalogies(analogies: Analogy[]): Promise<void> {
    await fetch(`${API_URL}/analogies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analogies),
    });
  },

  async getAnswerKeys(): Promise<AnswerKey[]> {
    const response = await fetch(`${API_URL}/answer-keys`);
    return response.json();
  },

  async saveAnswerKeys(keys: AnswerKey[]): Promise<void> {
    await fetch(`${API_URL}/answer-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys),
    });
  },
};
