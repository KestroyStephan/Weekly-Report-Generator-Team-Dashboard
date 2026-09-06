# Weekly Report Generator & Team Dashboard

A modern full-stack web application designed for team-wide structured weekly reporting, a multi-stage manager review & correction workflow, consolidated team analytics, and an integrated RAG AI Voice Assistant.

---

## 🛠️ Technology Stack
- **Frontend**: React 18 (Vite), React Router v6, TanStack Query, Zustand, Recharts, Lucide Icons, Vanilla CSS Design System with dark pine green tokens (`#042316`).
- **Backend**: Python FastAPI, Beanie ODM (Async MongoDB), Pydantic v2, PyJWT Auth (bcrypt password hashing).
- **Database**: MongoDB (Local or Atlas).
- **AI Assistant & Voice**: Local Ollama (**Llama 3.1 / Llama 3** engine), Web Speech Synthesis (Text-to-Speech 🔊), Web Speech Recognition (Mic Dictation 🎤).

---

## 📋 Features Implemented

### 1. User Authentication & RBAC
- Role-Based Access Control (`member`, `manager`, `admin`).
- Secure JWT session handling, login/logout, and password setup link flow (`/setup-password`).

### 2. Personal Weekly Report Page
- Standardized document layout across the team.
- Task-level tracking: Task description, priority, status, planned vs. actual %, time spent, deliverable.
- Key Blocker & Key Achievement flagging.
- Time spent breakdown by activity type (Development, Testing, Meetings, Documentation, Other).

### 3. Review & Correction Workflow
- 4-Stage State Machine: `Draft` $\rightarrow$ `Submitted` $\rightarrow$ `Needs Correction` $\rightarrow$ `Approved`.
- Manager feedback comments with resubmission loop (`Needs Correction` $\rightarrow$ edit $\rightarrow$ `Submitted`).
- Complete version history snapshot timeline per report.

### 4. Team Analytics Dashboard & Projects
- 4 Visual Recharts: Task completion trend over time, submission status by member, workload by project, time spent breakdown.
- Filterable team reports feed and side-by-side section reviews.
- Project Management CRUD (`ProjectManagementPage`).
- User Management CRUD with password reset controls (`UserManagementPage`).

### 5. ProgressHub Assistant (AI Chatbot & Voice)
- **Local Llama 3 Engine**: RAG over weekly report summaries and user roles.
- **Voice Assistance**: Text-to-Speech (`Listen Summary` 🔊) & Speech-to-Text Microphone input (🎤).
- **Concise Response Intent Routing**: Fast 1-2 sentence direct answers without markdown bold artifacts (`**`).

---

## 1. Prerequisites
- **Node.js**: v18+
- **Python**: 3.10+
- **MongoDB**: Running locally on port `27017` or Atlas connection string.
- **Ollama**: (Optional for AI Chatbot) Installed locally with `llama3.1` or `llama3`.

---

## 2. Environment Setup

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## 3. Seed Database & Run Application

### Step 1: Seed MongoDB Data (One-Time)
```bash
cd backend
python seed.py
```
*Seeds 5 users across 4 weeks of realistic report history in all workflow statuses.*

### Step 2: Start Backend API
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
- API Documentation: `http://localhost:8000/docs`

### Step 3: Start Local Ollama AI Engine (Optional)
```bash
ollama serve
```

### Step 4: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🔑 Seeded Demo Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager@demo.com` | `Password123` | Analytics Dashboard, Manager Review Queue, Projects |
| **Admin** | `admin@demo.com` | `Password123` | Full Access + User & Role Management |
| **Member** | `member1@demo.com` | `Password123` | Personal Reports (`Sarah Chen`), Report History |
| **Member** | `member2@demo.com` | `Password123` | Personal Reports (`Marcus Vance`), Report History |
| **Member** | `member3@demo.com` | `Password123` | Personal Reports (`Elena Rostova`), Report History |

---

## 🧪 Running Automated Tests
```bash
cd backend
pytest
```

---

## 🗺️ Project Structure Overview
```
├── backend/
│   ├── app/
│   │   ├── models/       # Beanie ODM documents (User, Report, Project)
│   │   ├── routers/      # REST API Endpoints (Auth, Users, Reports, AI)
│   │   ├── services/     # Business logic & AI Service (Llama 3 RAG)
│   │   └── schemas/      # Pydantic validation schemas
│   ├── tests/            # Pytest RBAC test suite
│   └── seed.py           # Database seeder script
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API clients
│   │   ├── components/   # UI components (Layout, Reports, Dashboard, Chat)
│   │   ├── pages/        # 11 React application pages
│   │   └── store/        # Zustand state stores (Auth, UI)
```

