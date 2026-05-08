import { supabaseStorage } from '../lib/supabase-storage';

async function ensureFiveOptions() {
  console.log('Checking all questions for 5 options...');
  
  const questions = await supabaseStorage.getQuestions();
  let updatedCount = 0;
  
  const updatedQuestions = questions.map(question => {
    if (question.options && question.options.length < 5) {
      console.log(`Question "${question.question.substring(0, 50)}..." has only ${question.options.length} options`);
      
      const additionalOptions = [];
      const optionsNeeded = 5 - question.options.length;
      
      for (let i = 0; i < optionsNeeded; i++) {
        additionalOptions.push(`Additional option ${String.fromCharCode(65 + question.options.length + i)}`);
      }
      
      updatedCount++;
      return {
        ...question,
        options: [...question.options, ...additionalOptions]
      };
    }
    return question;
  });
  
  if (updatedCount > 0) {
    console.log(`Updating ${updatedCount} questions to have 5 options...`);
    await supabaseStorage.saveQuestions(updatedQuestions);
    console.log('✓ All questions now have 5 options');
  } else {
    console.log('✓ All questions already have 5 options');
  }
}

ensureFiveOptions().catch(console.error);
