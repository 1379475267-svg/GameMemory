# GameMemory

GameMemory is a personal game experience archive. The backend is a Django REST Framework API with SQLite storage. RAWG API credentials are kept in the backend environment and are never exposed to the frontend.

## Backend Setup

```powershell
cd backend
.\.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```

Health check:

```text
GET http://127.0.0.1:8000/api/health/
```

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Core API

```text
GET    /api/games/                  List local games
POST   /api/games/                  Create a local game record
GET    /api/games/?status=playing   Filter local games by status
GET    /api/games/{id}/             Read one local game
PATCH  /api/games/{id}/             Update personal review fields
DELETE /api/games/{id}/             Delete one local game
GET    /api/games/search/?q=name    Search RAWG through the backend
POST   /api/games/import_rawg/      Import one RAWG game by rawg_id
GET    /api/stats/                  Read archive statistics
```

RAWG search and import require `RAWG_API_KEY` in `backend/.env`.
