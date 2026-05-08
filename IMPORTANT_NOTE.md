# Important: Board Exam Questions Format

## All Questions Must Have 5 Options (A-E)

The board exam level questions in this application follow professional certification exam standards, which require **exactly 5 answer choices** for all multiple-choice questions.

### Current Status

- ✅ **New questions generated** via `/generate` page have 5 options (A-E)
- ⚠️ **Existing questions** in your database may only have 4 options (A-D)

### Why 5 Options?

Professional certification and licensure exams (CCNA, CompTIA, Medical Boards, etc.) use 5-option multiple choice to:
- Reduce guessing probability (20% vs 25% with 4 options)
- Allow for more nuanced distractors
- Test deeper understanding
- Match industry standards

### What You're Seeing

If you see questions with only options A-D, these are **older questions** that were created before the board exam upgrade. The review page correctly displays all options from the question data - it's not hiding option E.

### Solutions

**Option 1: Generate New Questions**
- Go to `/generate` page
- Select topic and difficulty
- All new questions will have 5 options

**Option 2: Manually Edit Existing Questions**
- Go to `/questions` page
- Edit questions to add a 5th option
- Ensure the option is plausible and fits the board exam standards

**Option 3: Run Migration Script** (Advanced)
- Use `scripts/ensure-five-options.ts` to automatically add placeholder 5th options
- Then manually review and improve the added options

### Verification

To check if a question has 5 options:
1. View the question in review mode
2. Count the answer choices
3. Should see A, B, C, D, and E

All questions generated using the board exam templates (`lib/board-exam-questions.ts`) are guaranteed to have 5 options.
