import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const adapter = new JSONFile(join(__dirname, 'db.json'));
const db = new Low(adapter, {
  topics: [],
  questions: [],
  reviewCards: [],
  analogies: [],
  answerKeys: []
});

await db.read();

app.get('/api/topics', async (req, res) => {
  await db.read();
  res.json(db.data.topics);
});

app.post('/api/topics', async (req, res) => {
  await db.read();
  const topics = req.body;
  
  for (const topic of topics) {
    const index = db.data.topics.findIndex(t => t.id === topic.id);
    if (index >= 0) {
      db.data.topics[index] = topic;
    } else {
      db.data.topics.push(topic);
    }
  }
  
  await db.write();
  res.json({ success: true });
});

app.get('/api/questions', async (req, res) => {
  await db.read();
  res.json(db.data.questions);
});

app.post('/api/questions', async (req, res) => {
  await db.read();
  const questions = req.body;
  
  for (const question of questions) {
    const index = db.data.questions.findIndex(q => q.id === question.id);
    if (index >= 0) {
      db.data.questions[index] = question;
    } else {
      db.data.questions.push(question);
    }
  }
  
  await db.write();
  res.json({ success: true });
});

app.get('/api/review-cards', async (req, res) => {
  await db.read();
  
  const cardsWithQuestions = db.data.reviewCards.map(card => {
    const question = db.data.questions.find(q => q.id === card.questionId);
    return {
      ...card,
      question: question || null
    };
  });
  
  res.json(cardsWithQuestions);
});

app.post('/api/review-cards', async (req, res) => {
  await db.read();
  const cards = req.body;
  
  for (const card of cards) {
    const index = db.data.reviewCards.findIndex(c => c.id === card.id);
    if (index >= 0) {
      db.data.reviewCards[index] = card;
    } else {
      db.data.reviewCards.push(card);
    }
  }
  
  await db.write();
  res.json({ success: true });
});

app.get('/api/analogies', async (req, res) => {
  await db.read();
  res.json(db.data.analogies);
});

app.post('/api/analogies', async (req, res) => {
  await db.read();
  const analogies = req.body;
  
  for (const analogy of analogies) {
    const index = db.data.analogies.findIndex(a => a.id === analogy.id);
    if (index >= 0) {
      db.data.analogies[index] = analogy;
    } else {
      db.data.analogies.push(analogy);
    }
  }
  
  await db.write();
  res.json({ success: true });
});

app.get('/api/answer-keys', async (req, res) => {
  await db.read();
  res.json(db.data.answerKeys);
});

app.post('/api/answer-keys', async (req, res) => {
  await db.read();
  const keys = req.body;
  
  for (const key of keys) {
    const index = db.data.answerKeys.findIndex(k => k.id === key.id);
    if (index >= 0) {
      db.data.answerKeys[index] = key;
    } else {
      db.data.answerKeys.push(key);
    }
  }
  
  await db.write();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Exam Anki API server running on http://localhost:${PORT}`);
});
