import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const topics = (data || []).map(t => ({
      ...t,
      createdAt: new Date(t.created_at)
    }));
    
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const topics = await request.json();
    
    const dbTopics = topics.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      created_at: t.createdAt
    }));

    const { error } = await supabaseServer
      .from('topics')
      .upsert(dbTopics);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving topics:', error);
    return NextResponse.json({ error: 'Failed to save topics' }, { status: 500 });
  }
}
