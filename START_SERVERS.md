# Starting the Exam Anki Application

## Quick Start

You need to run **TWO** servers:

### 1. Backend API Server (Port 3001)

```bash
cd server
npm install
npm start
```

This starts the backend API that saves your progress automatically.

### 2. Frontend Next.js App (Port 3000)

```bash
npm run dev
```

This starts the main application interface.

## Access the Application

Once both servers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Features

✅ **Auto-Save**: All progress is automatically saved to the backend
✅ **Persistent Storage**: Data is stored in SQLite database
✅ **Offline Fallback**: Works with localStorage if backend is unavailable
✅ **Real-time Sync**: Changes sync immediately to the database

## Development Mode

For development with auto-reload:

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
npm run dev
```

## Troubleshooting

If you get connection errors:
1. Make sure the backend server is running on port 3001
2. Check that no other application is using ports 3000 or 3001
3. The app will still work with localStorage if backend is unavailable
