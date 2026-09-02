# Weekly Report Generator & Team Dashboard

Full-stack app for weekly team reporting with a manager review/correction workflow
and a team analytics dashboard.

## Stack
- Frontend: React (Vite), Zustand, TanStack Query, Recharts
- Backend: FastAPI, Beanie (async Mongo ODM), JWT auth
- Database: MongoDB
- AI Assistant: Claude API (manager-only chat over team report summaries)

## 1. Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB running locally, OR a MongoDB Atlas connection string

## 2. Installing dependencies

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # fill in MONGO_URI, JWT_SECRET, CLAUDE_API_KEY
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env             # set VITE_API_BASE_URL=http://localhost:8000
```

## 3. Running the backend
```bash
cd backend
python seed.py          # one-time: seeds 5 users + sample reports
uvicorn app.main:app --reload --port 8000
```
API docs available at http://localhost:8000/docs

## 4. Running the frontend
```bash
cd frontend
npm run dev
```
App available at http://localhost:5173

## 5. Running the database
- Local: `mongod --dbpath <your-data-dir>` (default port 27017)
- Or use MongoDB Atlas — paste the connection string into `backend/.env` as `MONGO_URI`

## Seeded test accounts
| Role    | Email                | Password   |
|---------|-----------------------|------------|
| Manager | manager@demo.com      | Password123 |
| Member  | member1@demo.com      | Password123 |
| Member  | member2@demo.com      | Password123 |

## Running tests
```bash
cd backend
pytest tests/
```

## Deployed instance
- Frontend: <your Vercel/Netlify link>
- Backend: <your Render/Railway link>

## Project structure
See `backend/app/` and `frontend/src/` — each is organized by
routers/services/models (backend) and pages/components/api (frontend).
