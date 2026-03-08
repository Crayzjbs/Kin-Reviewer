# Exam Anki - Smart Review System

A Next.js-based Anki-style exam review application with spaced repetition and AI-powered learning analogies.

## Features

- **Spaced Repetition Algorithm**: Smart review scheduling based on the SM-2 algorithm
- **Topic Management**: Organize your study materials by topics
- **Question Bank**: Create and manage exam questions with multiple formats:
  - Multiple Choice
  - True/False
  - Short Answer
- **Answer Key Storage**: Store and reference exam answer keys
- **AI-Powered Analogies**: Get human-friendly analogies when you make mistakes to help understand concepts better
- **Auto-Generate Questions**: Generate practice questions from your topics
- **Progress Tracking**: Monitor your review statistics and performance

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Create Topics
Start by creating topics for your study materials (e.g., "CCNA Routing", "Network Security", etc.)

### 2. Add Questions
Add questions to your topics with:
- Question text
- Correct answer
- Question type (Multiple Choice, True/False, Short Answer)
- Difficulty level

### 3. Review Sessions
Start a review session to practice your questions. The app uses spaced repetition to show you cards at optimal intervals.

### 4. Learn from Mistakes
When you answer incorrectly, the app generates a human-friendly analogy to help you understand the concept better.

### 5. Track Progress
Monitor your statistics on the dashboard to see your progress over time.

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage (client-side)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard/Home page
│   ├── topics/            # Topic management
│   ├── questions/         # Question management
│   ├── review/            # Review session
│   ├── answer-keys/       # Answer key storage
│   ├── analogies/         # View saved analogies
│   └── generate/          # Auto-generate questions
├── lib/                   # Utility libraries
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   ├── storage.ts        # LocalStorage management
│   ├── spaced-repetition.ts  # SM-2 algorithm
│   └── analogy-generator.ts  # Analogy generation
└── components/           # Reusable components (future)
```

## Spaced Repetition

The app uses a modified SM-2 algorithm for spaced repetition:
- **Again**: Review in 1 day
- **Hard**: Slightly increase interval
- **Good**: Standard interval increase
- **Easy**: Significantly increase interval

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication
- Cloud sync
- Advanced AI analogy generation using LLMs
- Import/Export functionality
- Study statistics and analytics
- Mobile app version

## License

MIT
