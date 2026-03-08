import { Topic, Question, AnswerKey, ReviewCard, Analogy } from './types';
import { supabase } from './supabase';
import { validateBeforeSave } from './supabase-limits';

export const supabaseStorage = {
  async getTopics(): Promise<Topic[]> {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(t => ({
      ...t,
      createdAt: new Date(t.created_at)
    }));
  },

  async saveTopics(topics: Topic[]): Promise<void> {
    const validation = await validateBeforeSave('save topics');
    if (!validation.canProceed) {
      throw new Error(validation.message || 'Cannot save: Storage limit reached');
    }

    const dbTopics = topics.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      created_at: t.createdAt.toISOString()
    }));

    const { error } = await supabase
      .from('topics')
      .upsert(dbTopics);
    
    if (error) throw error;
  },

  async getQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(q => ({
      id: q.id,
      topicId: q.topic_id,
      question: q.question,
      answer: q.answer,
      options: q.options,
      type: q.type,
      difficulty: q.difficulty,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      createdAt: new Date(q.created_at)
    }));
  },

  async saveQuestions(questions: Question[]): Promise<void> {
    const validation = await validateBeforeSave('save questions');
    if (!validation.canProceed) {
      throw new Error(validation.message || 'Cannot save: Storage limit reached');
    }

    const dbQuestions = questions.map(q => ({
      id: q.id,
      topic_id: q.topicId,
      question: q.question,
      answer: q.answer,
      options: q.options,
      type: q.type,
      difficulty: q.difficulty,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      created_at: q.createdAt.toISOString()
    }));

    const { error } = await supabase
      .from('questions')
      .upsert(dbQuestions);
    
    if (error) throw error;
  },

  async getReviewCards(): Promise<ReviewCard[]> {
    const { data, error } = await supabase
      .from('review_cards')
      .select(`
        *,
        questions (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(card => ({
      id: card.id,
      questionId: card.question_id,
      nextReview: new Date(card.next_review),
      interval: card.interval,
      easeFactor: card.ease_factor,
      repetitions: card.repetitions,
      lastReviewed: card.last_reviewed ? new Date(card.last_reviewed) : undefined,
      question: {
        id: card.questions.id,
        topicId: card.questions.topic_id,
        question: card.questions.question,
        answer: card.questions.answer,
        options: card.questions.options,
        type: card.questions.type,
        difficulty: card.questions.difficulty,
        correctAnswer: card.questions.correct_answer,
        explanation: card.questions.explanation,
        createdAt: new Date(card.questions.created_at)
      }
    }));
  },

  async saveReviewCards(cards: ReviewCard[]): Promise<void> {
    const validation = await validateBeforeSave('save review cards');
    if (!validation.canProceed) {
      throw new Error(validation.message || 'Cannot save: Storage limit reached');
    }

    const dbCards = cards.map(c => ({
      id: c.id,
      question_id: c.questionId,
      next_review: c.nextReview.toISOString(),
      interval: c.interval,
      ease_factor: c.easeFactor,
      repetitions: c.repetitions,
      last_reviewed: c.lastReviewed?.toISOString()
    }));

    const { error } = await supabase
      .from('review_cards')
      .upsert(dbCards);
    
    if (error) throw error;
  },

  async getAnalogies(): Promise<Analogy[]> {
    const { data, error } = await supabase
      .from('analogies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(a => ({
      id: a.id,
      questionId: a.question_id,
      originalQuestion: a.original_question,
      userAnswer: a.user_answer,
      correctAnswer: a.correct_answer,
      analogy: a.analogy,
      createdAt: new Date(a.created_at)
    }));
  },

  async saveAnalogies(analogies: Analogy[]): Promise<void> {
    const validation = await validateBeforeSave('save analogies');
    if (!validation.canProceed) {
      throw new Error(validation.message || 'Cannot save: Storage limit reached');
    }

    const dbAnalogies = analogies.map(a => ({
      id: a.id,
      question_id: a.questionId,
      original_question: a.originalQuestion,
      user_answer: a.userAnswer,
      correct_answer: a.correctAnswer,
      analogy: a.analogy,
      created_at: a.createdAt.toISOString()
    }));

    const { error } = await supabase
      .from('analogies')
      .upsert(dbAnalogies);
    
    if (error) throw error;
  },

  async getAnswerKeys(): Promise<AnswerKey[]> {
    const { data, error } = await supabase
      .from('answer_keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(k => ({
      id: k.id,
      topicId: k.topic_id,
      examName: k.exam_name,
      questions: k.questions,
      createdAt: new Date(k.created_at)
    }));
  },

  async saveAnswerKeys(keys: AnswerKey[]): Promise<void> {
    const validation = await validateBeforeSave('save answer keys');
    if (!validation.canProceed) {
      throw new Error(validation.message || 'Cannot save: Storage limit reached');
    }

    const dbKeys = keys.map(k => ({
      id: k.id,
      topic_id: k.topicId,
      exam_name: k.examName,
      questions: k.questions,
      created_at: k.createdAt.toISOString()
    }));

    const { error } = await supabase
      .from('answer_keys')
      .upsert(dbKeys);
    
    if (error) throw error;
  },
};
