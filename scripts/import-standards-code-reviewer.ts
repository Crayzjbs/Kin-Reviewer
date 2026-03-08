import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RawQuestion {
  id: number;
  topic: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer_letter: string;
  answer: string;
}

async function importStandardsCodeReviewer() {
  console.log('Starting import of STANDARDS_CODE_REVIEWER data...\n');

  const jsonPath = path.join(__dirname, '../app/topicjson/STANDARDS_CODE_REVIEWER.json');
  const rawData: RawQuestion[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`Loaded ${rawData.length} questions from JSON file`);

  const uniqueTopics = [...new Set(rawData.map(q => q.topic))];
  console.log(`Found ${uniqueTopics.length} unique topics:`, uniqueTopics);

  const topicIdMap: { [key: string]: string } = {};

  console.log('\n--- Inserting Topics ---');
  for (const topicName of uniqueTopics) {
    const topicId = `standards-code-reviewer-${topicName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;
    topicIdMap[topicName] = topicId;

    const topic = {
      id: topicId,
      name: `Standards Code Reviewer - ${topicName}`,
      description: `Questions from Standards Code Reviewer exam covering ${topicName}`,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('topics')
      .upsert(topic);

    if (error) {
      console.error(`Error inserting topic "${topicName}":`, error);
    } else {
      console.log(`✓ Inserted topic: ${topicName} (ID: ${topicId})`);
    }
  }

  console.log('\n--- Inserting Questions ---');
  console.log('This may take a while...\n');

  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rawData.length; i += batchSize) {
    const batch = rawData.slice(i, i + batchSize);
    
    const questions = batch.map(q => {
      const topicId = topicIdMap[q.topic];
      const questionId = `standards-code-reviewer-q${q.id}`;

      return {
        id: questionId,
        topic_id: topicId,
        question: q.question,
        answer: q.answer,
        options: [q.choices.A, q.choices.B, q.choices.C, q.choices.D],
        type: 'multiple-choice',
        difficulty: 'medium',
        correct_answer: q.answer_letter,
        explanation: null,
        created_at: new Date().toISOString()
      };
    });

    const { error } = await supabase
      .from('questions')
      .upsert(questions);

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✓ Inserted batch ${i / batchSize + 1}: ${successCount}/${rawData.length} questions`);
    }
  }

  console.log('\n--- Import Summary ---');
  console.log(`Topics inserted: ${uniqueTopics.length}`);
  console.log(`Questions successfully inserted: ${successCount}`);
  console.log(`Questions with errors: ${errorCount}`);
  console.log('\nImport complete!');
}

importStandardsCodeReviewer().catch(console.error);
