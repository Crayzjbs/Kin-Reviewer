import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n--- Testing Topics Table ---');
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .limit(5);

    if (topicsError) {
      console.error('Error fetching topics:', topicsError);
    } else {
      console.log(`✓ Found ${topics?.length || 0} topics (showing first 5):`);
      topics?.forEach(topic => {
        console.log(`  - ${topic.name} (ID: ${topic.id})`);
      });
    }

    console.log('\n--- Testing Questions Table ---');
    const { count: questionCount, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting questions:', countError);
    } else {
      console.log(`✓ Total questions in database: ${questionCount}`);
    }

    console.log('\n--- Connection Test Complete ---');
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
