-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add subject_id column to topics table
ALTER TABLE topics ADD COLUMN IF NOT EXISTS subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects
CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert subjects" ON subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update subjects" ON subjects FOR UPDATE USING (true);

-- Insert Architecture subject
INSERT INTO subjects (id, name, description, icon, created_at)
VALUES (
  'architecture',
  'Architecture',
  'Philippine Architecture Licensure Examination topics covering standards, codes, and professional practice',
  '🏛️',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Update existing topics to link to Architecture subject
UPDATE topics 
SET subject_id = 'architecture' 
WHERE subject_id IS NULL;
