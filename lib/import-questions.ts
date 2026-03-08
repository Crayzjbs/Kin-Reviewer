import { Question, Topic } from './types';
import { storage } from './storage';
import { generateId } from './utils';

interface ImportQuestion {
  id: number;
  topic: string;
  question: string;
  answer_letter: string;
  answer_text: string;
  answer_full: string;
  is_dragdrop: boolean;
}

export function importQuestionsFromJSON(jsonData: string, overrideTopicName?: string): { success: number; errors: string[] } {
  const lines = jsonData.trim().split('\n');
  const errors: string[] = [];
  let successCount = 0;

  const existingTopics = storage.getTopics();
  const existingQuestions = storage.getQuestions();
  const topicMap = new Map<string, string>();
  
  existingTopics.forEach(topic => {
    topicMap.set(topic.name, topic.id);
  });

  const newTopics: Topic[] = [];
  const newQuestions: Question[] = [...existingQuestions];

  lines.forEach((line, index) => {
    try {
      if (!line.trim()) return;
      
      const data: ImportQuestion = JSON.parse(line);
      
      const topicNameToUse = overrideTopicName || data.topic;
      let topicId = topicMap.get(topicNameToUse);
      if (!topicId) {
        const newTopic: Topic = {
          id: generateId(),
          name: topicNameToUse,
          description: overrideTopicName ? `${overrideTopicName} questions` : `CCNA ${data.topic} questions`,
          createdAt: new Date(),
        };
        newTopics.push(newTopic);
        topicId = newTopic.id;
        topicMap.set(topicNameToUse, topicId);
      }

      const questionType = data.answer_letter.length > 1 ? 'multiple-choice' : 'multiple-choice';

      const question: Question = {
        id: generateId(),
        topicId: topicId,
        type: questionType,
        question: data.question,
        answer: data.answer_letter,
        options: parseOptions(data.question),
        correctAnswer: data.answer_letter,
        explanation: data.answer_full || data.answer_text,
        difficulty: 'medium',
        createdAt: new Date(),
      };

      newQuestions.push(question);
      successCount++;
    } catch (error) {
      errors.push(`Line ${index + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  });

  if (newTopics.length > 0) {
    storage.saveTopics([...existingTopics, ...newTopics]);
  }
  
  storage.saveQuestions(newQuestions);

  return { success: successCount, errors };
}

function parseOptions(questionText: string): string[] {
  const optionPattern = /^([A-Z])\.\s+(.+)$/gm;
  const options: string[] = [];
  let match;

  while ((match = optionPattern.exec(questionText)) !== null) {
    options.push(match[2].trim());
  }

  if (options.length === 0) {
    return ['Option A', 'Option B', 'Option C', 'Option D'];
  }

  return options;
}
