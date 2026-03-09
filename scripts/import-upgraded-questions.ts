import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UpgradedQuestion {
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
  difficulty_upgraded: boolean;
}

async function importUpgradedQuestions() {
  console.log('Starting import of UPGRADED questions...\n');

  const jsonPath = path.join(__dirname, '../app/topicjson/STANDARDS_CODE_REVIEWER_UPGRADED.json');
  const rawData: UpgradedQuestion[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`Loaded ${rawData.length} upgraded questions`);

  const uniqueTopics = [...new Set(rawData.map(q => q.topic))];
  console.log(`Found ${uniqueTopics.length} unique topics`);

  const topicIdMap: { [key: string]: string } = {};

  console.log('\n--- Ensuring Architecture Subject Exists ---');
  const architectureSubject = {
    id: 'architecture',
    name: 'Architecture',
    description: 'Philippine Architecture Licensure Examination topics covering standards, codes, and professional practice',
    icon: '🏛️',
    created_at: new Date().toISOString()
  };

  const { error: subjectError } = await supabase
    .from('subjects')
    .upsert(architectureSubject);

  if (subjectError) {
    console.error('Error inserting Architecture subject:', subjectError);
  } else {
    console.log('✓ Architecture subject ready');
  }

  console.log('\n--- Updating Topics ---');
  for (const topicName of uniqueTopics) {
    const topicId = `standards-code-reviewer-${topicName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;
    topicIdMap[topicName] = topicId;

    const topic = {
      id: topicId,
      subject_id: 'architecture',
      name: `Standards Code Reviewer - ${topicName}`,
      description: `Questions from Standards Code Reviewer exam covering ${topicName}`,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('topics')
      .upsert(topic);

    if (error) {
      console.error(`Error upserting topic "${topicName}":`, error);
    } else {
      console.log(`✓ Updated topic: ${topicName}`);
    }
  }

  console.log('\n--- Updating Questions with Improved Difficulty ---');
  console.log('This may take a while...\n');

  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;
  let upgradedCount = 0;

  for (let i = 0; i < rawData.length; i += batchSize) {
    const batch = rawData.slice(i, i + batchSize);
    
    const questions = batch.map(q => {
      const topicId = topicIdMap[q.topic];
      const questionId = `standards-code-reviewer-q${q.id}`;

      if (q.difficulty_upgraded) {
        upgradedCount++;
      }

      return {
        id: questionId,
        topic_id: topicId,
        question: q.question,
        answer: q.answer,
        options: [q.choices.A, q.choices.B, q.choices.C, q.choices.D],
        type: 'multiple-choice',
        difficulty: 'hard', // Set all to hard difficulty
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
      console.log(`✓ Batch ${i / batchSize + 1}: ${successCount}/${rawData.length} questions`);
    }
  }

  console.log('\n--- Import Summary ---');
  console.log(`Topics updated: ${uniqueTopics.length}`);
  console.log(`Questions successfully imported: ${successCount}`);
  console.log(`Questions with improved distractors: ${upgradedCount}`);
  console.log(`Questions with errors: ${errorCount}`);
  console.log(`All questions set to: HARD difficulty`);
  console.log('\n✓ Import complete! Questions are now board-exam level difficulty.');
}

importUpgradedQuestions().catch(console.error);
