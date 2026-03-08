import { NextResponse } from 'next/server';
import { checkStorageLimits } from '@/lib/supabase-limits';

export async function GET() {
  try {
    const limits = await checkStorageLimits();
    return NextResponse.json(limits);
  } catch (error) {
    console.error('Error checking storage limits:', error);
    return NextResponse.json(
      { error: 'Failed to check storage limits' },
      { status: 500 }
    );
  }
}
