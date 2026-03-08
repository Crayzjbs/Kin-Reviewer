# Exam Anki Backend Server

Backend API server for the Exam Anki review system with automatic progress saving.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

- `GET /api/topics` - Get all topics
- `POST /api/topics` - Save topics
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Save questions
- `GET /api/review-cards` - Get all review cards
- `POST /api/review-cards` - Save review cards
- `GET /api/analogies` - Get all analogies
- `POST /api/analogies` - Save analogies
- `GET /api/answer-keys` - Get all answer keys
- `POST /api/answer-keys` - Save answer keys

## Database

Uses SQLite with `better-sqlite3` for fast, reliable local storage.
Database file: `exam-anki.db`

## Auto-Save

The frontend automatically syncs all changes to the backend:
- Question imports
- Review progress
- Answer submissions
- Analogies generated
- Topic and answer key management

Data is saved both locally (localStorage) and to the backend for persistence.
