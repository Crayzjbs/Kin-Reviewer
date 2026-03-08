import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('analogies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const analogies = (data || []).map(a => ({
      id: a.id,
      questionId: a.question_id,
      originalQuestion: a.original_question,
      userAnswer: a.user_answer,
      correctAnswer: a.correct_answer,
      analogy: a.analogy,
      createdAt: new Date(a.created_at)
    }));
    
    return NextResponse.json(analogies);
  } catch (error) {
    console.error('Error fetching analogies:', error);
    return NextResponse.json({ error: 'Failed to fetch analogies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const analogies = await request.json();
    
    const dbAnalogies = analogies.map((a: any) => ({
      id: a.id,
      question_id: a.questionId,
      original_question: a.originalQuestion,
      user_answer: a.userAnswer,
      correct_answer: a.correctAnswer,
      analogy: a.analogy,
      created_at: a.createdAt
    }));

    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('analogies')
      .upsert(dbAnalogies);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving analogies:', error);
    return NextResponse.json({ error: 'Failed to save analogies' }, { status: 500 });
  }
}
