# GameMemory

> Personal game archive for searching, importing, rating, tagging, and reviewing games.

![Vue 3](https://img.shields.io/badge/Vue%203-Frontend-42b883)
![Vite](https://img.shields.io/badge/Vite-Build-646cff)
![Django](https://img.shields.io/badge/Django-Local%20Backend-0c4b33)
![Netlify](https://img.shields.io/badge/Netlify-Production%20Host-00c7b7)
![Supabase](https://img.shields.io/badge/Supabase-Production%20Database-3ecf8e)
![RAWG](https://img.shields.io/badge/RAWG-Game%20Data-fd6c35)
![SteamGridDB](https://img.shields.io/badge/SteamGridDB-Artwork-66c2ff)

## Overview

GameMemory is a personal game experience archive. It lets you search games through the RAWG Video Games Database API, import official metadata, and then add your own play status, platform, ratings, experience tags, and written review.

The current production version runs on Netlify with a serverless API and stores data in Supabase PostgreSQL. The repository also keeps the original Django + Django REST Framework backend for local development and learning.

中文简介：GameMemory 是一个个人游戏档案馆。你可以搜索游戏、导入封面和官方资料，然后记录自己的游玩状态、评分、标签和主观评价。

## Live Sites

Production:

```text
https://1gamememory1.netlify.app
```

Health check:

```text
https://1gamememory1.netlify.app/api/health
```

GitHub Pages interface demo:

```text
https://1379475267-svg.github.io/GameMemory/
```

The GitHub Pages build is a static demo with sample data. It is useful for previewing the UI, but it does not use the real serverless API or database.

## Features

- Search games through RAWG.
- Show recent high-interest games on the search page.
- Import selected games into the personal archive.
- Cache imported game metadata in the database.
- Browse imported games as dark archive-style cards.
- Filter the library by status: backlog, playing, completed, paused, dropped.
- View official metadata and personal notes on the detail page.
- Edit play platform, overall score, graphics score, story score, gameplay score, immersion score, music score, tags, and review text.
- Delete games from the archive.
- Show statistics: total games, completed games, average score, top tags, and highest-rated game.
- Enrich detail pages with RAWG media and SteamGridDB artwork.

## Tech Stack

| Area | Technology | Notes |
|---|---|---|
| Frontend | Vue 3, Vite, Vue Router | Main user interface |
| Production API | Netlify Functions | Serverless API under `/api/*` |
| Production database | Supabase PostgreSQL | Stores imported games and reviews |
| Local backend | Django, Django REST Framework | Original local API implementation |
| Local database | SQLite | Used by the Django backend |
| Game data | RAWG API | Search, metadata, screenshots, trailers |
| Artwork | SteamGridDB API | Posters, heroes, logos |

## Project Structure

```text
GameMemory/
|-- api/                         # Vercel-style serverless API modules
|-- backend/                     # Django + DRF local backend
|   |-- core/
|   |-- games/
|   |-- gamememory/
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/                    # Vue 3 + Vite app
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- router/
|   |   `-- views/
|   |-- package.json
|   `-- vite.config.js
|-- netlify/
|   `-- functions/api.js         # Netlify production API router
|-- supabase/
|   `-- schema.sql               # Production database schema
|-- netlify.toml                 # Netlify build, functions, redirects
|-- package.json                 # Hosted build command
|-- render.yaml                  # Legacy Render deployment config
|-- vercel.json                  # Vercel deployment config
`-- README.md
```

## Production Deployment

The current recommended production path is:

```text
Netlify             Vue frontend and serverless API
Supabase            PostgreSQL database
RAWG / SteamGridDB  External game data and artwork APIs
```

### 1. Supabase

Create a Supabase project, open SQL Editor, and run:

```text
supabase/schema.sql
```

The schema creates `public.games`, enables row level security, blocks browser-side table access, and grants the server-side `service_role` permission to operate on the table.

Important: copy the project URL and the `service_role` key from Supabase. The service role key is sensitive and must only be stored in Netlify environment variables.

### 2. Netlify

Import this GitHub repository into Netlify.

Use these build settings:

```text
Base directory:     leave empty
Build command:      npm run build
Publish directory:  frontend/dist
Functions directory: netlify/functions
```

The same settings are also encoded in `netlify.toml`.

Add these environment variables:

```text
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

After adding or changing environment variables, trigger a new Netlify deploy.

### 3. Verify Production

Open:

```text
https://your-netlify-site.netlify.app/api/health
```

Expected result:

```json
{
  "status": "ok",
  "service": "GameMemory Netlify API",
  "rawg_api_key_configured": true,
  "steamgriddb_api_key_configured": true,
  "supabase_configured": true
}
```

Then test:

- Search for `elden ring`.
- Import one game.
- Open the library.
- Edit a review.
- Open the statistics page.

## Local Development

### Frontend Only

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

In development, the frontend defaults to the Django API at:

```text
http://127.0.0.1:8000/api
```

### Django Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```

Fill `backend/.env`:

```text
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

Backend health check:

```text
http://127.0.0.1:8000/api/health/
```

### Netlify-Style Local Build

From the repository root:

```powershell
npm install
npm run build
```

The root build command installs frontend dependencies and builds `frontend/dist`.

## API Routes

Production API routes are served by `netlify/functions/api.js`:

```text
GET    /api/health
GET    /api/games
POST   /api/games
GET    /api/games/:id
PATCH  /api/games/:id
DELETE /api/games/:id
GET    /api/games/search?q=elden%20ring
GET    /api/games/trending
POST   /api/games/import_rawg
GET    /api/games/:id/media
GET    /api/games/:id/artwork
GET    /api/stats
```

## Security Notes

- Do not commit real API keys.
- `backend/.env` is ignored by Git.
- Production keys belong in Netlify environment variables.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to frontend code.
- If a key is shared in screenshots, chat logs, or public commits, rotate it and update Netlify.
- Supabase row level security is enabled, and direct browser table access is blocked by policy.

## Troubleshooting

### `vite: not found` on Netlify

Use the root build script:

```text
npm install --prefix frontend && npm run build --prefix frontend
```

This is already configured in the root `package.json`.

### `TypeError: fetch failed` when loading the library

Usually caused by an incorrect `SUPABASE_URL`. It must look like:

```text
https://your-project-id.supabase.co
```

Do not include `/rest/v1/`.

### `permission denied for table games`

Run this in Supabase SQL Editor:

```sql
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
```

### Health check is true but games still fail

`/api/health` only checks whether environment variables exist. It does not prove that the Supabase URL and service role key are valid. Test `/api/games` to verify real database access.

## Roadmap

- [x] Vue 3 + Vite frontend
- [x] Django + DRF local backend
- [x] RAWG search and import
- [x] SQLite local archive
- [x] Supabase production database
- [x] Netlify production deployment
- [x] SteamGridDB artwork integration
- [x] Recent high-interest games
- [x] Personal review editor
- [x] Statistics page
- [ ] Better artwork selection controls
- [ ] Tag search and advanced filters
- [ ] Export archive data
- [ ] Friendlier production error messages
- [ ] Key rotation and deployment checklist

## Author

Haoran Fei

Built as a personal full-stack game archive and learning project.

## License

MIT License planned.
