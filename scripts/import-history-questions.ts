import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const historyQuestions = [
  {
    "id": 1,
    "topic": "History of Architecture",
    "question": "The beginner of the great hypostyle hall at karnak and the founder of the 19th dynasty.",
    "choices": {
      "A": "Domencio de Cortona",
      "B": "Manila Peninsula",
      "C": "Tympanum",
      "D": "Rameses I"
    },
    "answer_letter": "D",
    "answer": "Rameses I"
  },
  // ... rest of your questions would go here
];

async function importQuestions() {
  try {
    console.log('Starting import...');
    
    // Group questions by topic
    const topicMap = new Map<string, any[]>();
    historyQuestions.forEach(q => {
      if (!topicMap.has(q.topic)) {
        topicMap.set(q.topic, []);
      }
      topicMap.get(q.topic)!.push(q);
    });

    // Import each topic
    for (const [topicName, questions] of topicMap.entries()) {
      const topicId = topicName.toLowerCase().replace(/\s+/g, '-');
      
      // Insert topic
      const { error: topicError } = await supabase
        .from('topics')
        .upsert({
          id: topicId,
          name: topicName,
          description: `${questions.length} questions about ${topicName}`,
          created_at: new Date().toISOString()
        });

      if (topicError) {
        console.error(`Error inserting topic ${topicName}:`, topicError);
        continue;
      }

      console.log(`✓ Topic created: ${topicName}`);

      // Insert questions for this topic
      const dbQuestions = questions.map(q => ({
        id: `${topicId}-${q.id}`,
        topic_id: topicId,
        question: q.question,
        answer: q.answer,
        options: q.choices,
        type: 'multiple-choice',
        difficulty: 'medium',
        correct_answer: q.answer_letter,
        explanation: null,
        created_at: new Date().toISOString()
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .upsert(dbQuestions);

      if (questionsError) {
        console.error(`Error inserting questions for ${topicName}:`, questionsError);
      } else {
        console.log(`✓ Imported ${questions.length} questions for ${topicName}`);
      }
    }

    console.log('\n✅ Import completed successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importQuestions();
