# Database Migration Instructions

## Important: Run This SQL Migration First!

Before the new features will work, you need to run the SQL migration to add the subjects table and update the topics table.

### Steps:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/xepmvjvqbpbenupyepme

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the Migration**
   - Copy the entire contents of `supabase-subjects-migration.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify the Migration**
   - Check that the `subjects` table was created
   - Check that the `topics` table now has a `subject_id` column
   - Verify that the Architecture subject was inserted

5. **Re-run the Import Script (Optional)**
   If you want to ensure all topics are properly linked to the Architecture subject:
   ```powershell
   $env:NEXT_PUBLIC_SUPABASE_URL="https://xepmvjvqbpbenupyepme.supabase.co"
   $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcG12anZxYnBiZW51cHllcG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MzM4OTksImV4cCI6MjA4ODUwOTg5OX0.LjBVaXIwl9DW7zqjufA_OodgglF8AfY9DBN3VcW1VJE"
   npm run import-standards
   ```

## What Changed

### 1. Subject Selection Screen ✅
- New landing page at `/select-subject`
- Users must select a subject (e.g., Architecture) before choosing topics
- Navigation flow: Home → Subject → Topic → Review

### 2. Dynamic Human Analogies ✅
- Human analogies now generate uniquely for each question
- Based on the question content and correct answer
- Changes every single question - never reuses the same analogy

### 3. Encouraging Message ✅
- When users get an answer wrong, they see: "It's okay love ko! Kaya yan, lovelove kin<33"
- Displayed in pink text above the answer feedback

### 4. Board Exam Difficulty Guide ✅
- Comprehensive guide in `BOARD_EXAM_DIFFICULTY_GUIDE.md`
- Explains how to create Philippine board exam level questions
- Includes examples of good vs bad questions
- Guidelines for creating effective distractors

## New Database Schema

### Subjects Table
```sql
subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

### Updated Topics Table
```sql
topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id),  -- NEW COLUMN
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

## Testing Locally

1. Make sure the migration is run in Supabase
2. Start the dev server:
   ```powershell
   npm run dev
   ```
3. Visit http://localhost:3000
4. Click "Start Review"
5. You should see the Subject Selection page
6. Select "Architecture"
7. Choose a topic
8. Start reviewing questions
9. Get one wrong to see the encouraging message
10. Check that the human analogy changes for each question

## Deployment

The code has been pushed to your repository. Vercel will automatically deploy the changes.

Once deployed:
- Make sure you've run the SQL migration in Supabase
- Visit your deployed site
- Test the new subject selection flow
- Verify all features are working

## Future Subjects

To add more subjects in the future:

1. Insert a new subject into the `subjects` table
2. Create topics linked to that subject (with `subject_id`)
3. Import questions for those topics
4. The subject will automatically appear on the selection screen

Example:
```sql
INSERT INTO subjects (id, name, description, icon, created_at)
VALUES (
  'civil-engineering',
  'Civil Engineering',
  'Philippine Civil Engineering Licensure Examination topics',
  '🏗️',
  NOW()
);
```
