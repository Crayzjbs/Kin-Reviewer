import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('answer_keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const keys = (data || []).map(k => ({
      id: k.id,
      topicId: k.topic_id,
      examName: k.exam_name,
      questions: k.questions,
      createdAt: new Date(k.created_at)
    }));
    
    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error fetching answer keys:', error);
    return NextResponse.json({ error: 'Failed to fetch answer keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const keys = await request.json();
    
    const dbKeys = keys.map((k: any) => ({
      id: k.id,
      topic_id: k.topicId,
      exam_name: k.examName,
      questions: k.questions,
      created_at: k.createdAt
    }));

    const { error } = await supabaseServer
      .from('answer_keys')
      .upsert(dbKeys);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving answer keys:', error);
    return NextResponse.json({ error: 'Failed to save answer keys' }, { status: 500 });
  }
}
