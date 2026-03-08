# STANDARDS_CODE_REVIEWER Import Guide

## Overview
This script imports 6,614 questions across 11 topics from the STANDARDS_CODE_REVIEWER.json file into your Supabase database.

## Topics to be imported:
1. History of Architecture
2. Structural
3. Building Technology
4. Theory & Planning
5. Standard Codes
6. Professional Practice
7. Electrical
8. Plumbing
9. Mechanical
10. Acoustics & Lighting
11. Furniture Design

## Prerequisites

### 1. Set up Supabase credentials
Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase project settings at: https://app.supabase.com

### 2. Ensure database schema is set up
Make sure you've run the `supabase-setup.sql` script in your Supabase SQL Editor to create the necessary tables.

## Running the Import

Execute the import script with:

```bash
npm run import-standards
```

## What the script does:

1. **Creates 11 topic entries** in the `topics` table with IDs like:
   - `standards-code-reviewer-history-of-architecture`
   - `standards-code-reviewer-structural`
   - etc.

2. **Inserts 6,614 questions** in batches of 100 to the `questions` table
   - Each question is linked to its topic via `topic_id`
   - Questions are formatted as multiple-choice with 4 options (A, B, C, D)
   - All questions are set to 'medium' difficulty by default

## Expected Output

The script will show progress like:
```
Starting import of STANDARDS_CODE_REVIEWER data...
Loaded 6614 questions from JSON file
Found 11 unique topics: [...]

--- Inserting Topics ---
✓ Inserted topic: History of Architecture (ID: standards-code-reviewer-history-of-architecture)
...

--- Inserting Questions ---
✓ Inserted batch 1: 100/6614 questions
✓ Inserted batch 2: 200/6614 questions
...

--- Import Summary ---
Topics inserted: 11
Questions successfully inserted: 6614
Questions with errors: 0

Import complete!
```

## Troubleshooting

- **Missing credentials error**: Make sure `.env.local` exists with valid Supabase credentials
- **Database errors**: Verify the database schema is set up correctly
- **Duplicate key errors**: The script uses `upsert`, so re-running it will update existing records

## After Import

Once imported, you can:
- View topics in your app at `/topics`
- Create review cards from these questions
- Generate answer keys for exams
- Use the questions in your review sessions
