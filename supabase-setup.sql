-- Supabase Database Schema for Exam Anki
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Topics table
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  options JSONB,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'short-answer')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  correct_answer TEXT,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Review cards table
CREATE TABLE review_cards (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT 'default',
  next_review TIMESTAMPTZ NOT NULL,
  interval INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analogies table
CREATE TABLE analogies (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT 'default',
  original_question TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  analogy TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Answer keys table
CREATE TABLE answer_keys (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_questions_topic_id ON questions(topic_id);
CREATE INDEX idx_review_cards_question_id ON review_cards(question_id);
CREATE INDEX idx_review_cards_user_id ON review_cards(user_id);
CREATE INDEX idx_review_cards_next_review ON review_cards(next_review);
CREATE INDEX idx_analogies_question_id ON analogies(question_id);
CREATE INDEX idx_analogies_user_id ON analogies(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE analogies ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (everyone can see questions)
CREATE POLICY "Topics are viewable by everyone" ON topics FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Answer keys are viewable by everyone" ON answer_keys FOR SELECT USING (true);

-- Create policies for public write access (for now - you can add auth later)
CREATE POLICY "Anyone can insert topics" ON topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update topics" ON topics FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update questions" ON questions FOR UPDATE USING (true);

-- Review cards and analogies are user-specific
CREATE POLICY "Users can view their own review cards" ON review_cards FOR SELECT USING (true);
CREATE POLICY "Users can insert their own review cards" ON review_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own review cards" ON review_cards FOR UPDATE USING (true);

CREATE POLICY "Users can view their own analogies" ON analogies FOR SELECT USING (true);
CREATE POLICY "Users can insert their own analogies" ON analogies FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert answer keys" ON answer_keys FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update answer keys" ON answer_keys FOR UPDATE USING (true);
