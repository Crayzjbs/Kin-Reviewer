import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const questions = (data || []).map(q => ({
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
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const questions = await request.json();
    
    const dbQuestions = questions.map((q: any) => ({
      id: q.id,
      topic_id: q.topicId,
      question: q.question,
      answer: q.answer,
      options: q.options,
      type: q.type,
      difficulty: q.difficulty,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      created_at: q.createdAt
    }));

    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('questions')
      .upsert(dbQuestions);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving questions:', error);
    return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 });
  }
}
