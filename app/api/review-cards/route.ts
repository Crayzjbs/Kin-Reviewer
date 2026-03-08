import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('review_cards')
      .select(`
        *,
        questions (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const cards = (data || []).map((card: any) => ({
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
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching review cards:', error);
    return NextResponse.json({ error: 'Failed to fetch review cards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cards = await request.json();
    
    const dbCards = cards.map((c: any) => ({
      id: c.id,
      question_id: c.questionId,
      next_review: c.nextReview,
      interval: c.interval,
      ease_factor: c.easeFactor,
      repetitions: c.repetitions,
      last_reviewed: c.lastReviewed
    }));

    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('review_cards')
      .upsert(dbCards);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving review cards:', error);
    return NextResponse.json({ error: 'Failed to save review cards' }, { status: 500 });
  }
}
