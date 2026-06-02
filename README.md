# GameMemory

> Personal Game Experience Archive
> 个人游戏体验记录库

![Vue](https://img.shields.io/badge/Vue%203-Frontend-42b883)
![Vite](https://img.shields.io/badge/Vite-Build-646cff)
![Django](https://img.shields.io/badge/Django-Backend-0c4b33)
![DRF](https://img.shields.io/badge/DRF-API-red)
![SQLite](https://img.shields.io/badge/SQLite-Local%20Database-336791)
![RAWG](https://img.shields.io/badge/RAWG-Game%20Data-fd6c35)
![SteamGridDB](https://img.shields.io/badge/SteamGridDB-Artwork-66c2ff)

---

## Project Overview / 项目概览

**GameMemory** is a personal game archive for recording what you played, how you felt, and which games left a mark.

It lets you search games through the RAWG Video Games Database API, import official game metadata into a local SQLite database, then add your own play status, scores, tags, platform, and written review.

The app also enriches detail pages with RAWG screenshots and SteamGridDB artwork, so each game page feels closer to a small private museum entry than a plain database row.

**GameMemory** 是一个个人游戏体验档案馆，用来记录你玩过什么、玩到哪里、给了多少分，以及这款游戏给你的主观感受。

项目通过 Django 后端调用 RAWG API 搜索游戏，并将封面、简介、发售日期、平台、类型等官方资料保存到本地 SQLite 数据库。之后你可以为每个游戏补充游玩状态、评分、体验标签、游玩平台和文字评价。

详情页还会结合 RAWG 截图与 SteamGridDB 高质量视觉素材，让每个游戏档案更像一个私人收藏条目。

---

## Online Demo / 在线预览

GitHub Pages demo:

```text
https://1379475267-svg.github.io/GameMemory/
```

The online demo is a static Vue build with built-in sample data. It is designed to preview the interface, page flow, visual style, animations, detail pages, search page, and statistics page.

Because GitHub Pages cannot run the Django backend, the online demo does not call RAWG or SteamGridDB directly and does not use real API keys. To use real search, import, caching, and local database features, run the backend locally.

在线预览是一个带示例数据的静态 Vue Demo，用来展示界面、页面流程、视觉风格、动效、详情页、搜索页和统计页。

由于 GitHub Pages 不能运行 Django 后端，在线 Demo 不会直接调用 RAWG 或 SteamGridDB，也不会使用真实 API key。真实搜索、导入、本地缓存和数据库功能需要在本地启动后端。

---

## Core Features / 核心功能

### Game Discovery / 游戏发现

- Search games by name through RAWG.
- Browse recent high-interest games on the search page.
- Import selected games into the local archive.
- API keys are stored only in the Django backend.

- 通过 RAWG 按名称搜索游戏。
- 搜索页默认展示近期高热度游戏。
- 从结果中选择游戏并导入本地数据库。
- API key 只保存在 Django 后端，不进入前端代码。

### Personal Archive / 个人档案

- View imported games as dark archive-style cards.
- Filter the library by play status.
- Open a game detail page with official metadata and personal notes.
- Delete games from the local archive.

- 使用深色卡片式界面浏览已导入游戏。
- 按游玩状态筛选游戏库。
- 在详情页查看官方资料和个人评价。
- 支持删除本地游戏档案。

### Review System / 评价系统

- Play status: backlog, playing, completed, paused, dropped.
- Play platform.
- Overall score.
- Graphics, story, gameplay, immersion, and music scores.
- Experience tags.
- Written review.

- 游玩状态：想玩、游玩中、已通关、暂停、弃坑。
- 游玩平台。
- 总评分。
- 画质、剧情、玩法、沉浸感、音乐评分。
- 体验标签。
- 文字评价。

### Visual Enhancement / 视觉增强

- RAWG screenshots for detail page galleries.
- RAWG trailers and store links where available.
- SteamGridDB hero artwork, poster artwork, and transparent logos.
- Soft page reveal, hover lift, image zoom, and slow hero background motion.

- 使用 RAWG 截图生成详情页影像画廊。
- 支持 RAWG 预告片和商店链接。
- 使用 SteamGridDB 的横幅图、竖版封面和透明 Logo。
- 包含页面淡入、卡片上浮、图片放大、详情页背景缓慢缩放等动效。

### Statistics / 统计

- Total game count.
- Completed game count.
- Average score.
- Most used experience tags.
- Highest-rated game.

- 游戏总数。
- 已通关数量。
- 平均评分。
- 最常用体验标签。
- 评分最高游戏。

---

## Tech Stack / 技术栈

| Layer | Technology | Usage |
|---|---|---|
| Frontend | Vue 3 | User interface and page state |
| Frontend | Vite | Development server and build tool |
| Frontend | Vue Router | Library, search, detail, and stats pages |
| Backend | Django | Backend application framework |
| Backend | Django REST Framework | REST API |
| Database | SQLite | Local personal archive storage |
| External API | RAWG Video Games Database API | Game search, metadata, screenshots, trailers |
| External API | SteamGridDB API | High-quality game artwork |

---

## Project Structure / 项目结构

```text
GameMemory/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── gamememory/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── core/
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   └── games/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── tests.py
│       └── services/
│           ├── rawg.py
│           └── steamgriddb.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.vue
│       ├── main.js
│       ├── api/
│       ├── components/
│       ├── router/
│       ├── views/
│       └── assets/
│
├── README.md
└── .gitignore
```

---

## Environment Variables / 环境变量

Create `backend/.env` from `backend/.env.example`:

```powershell
cd backend
Copy-Item .env.example .env
```

Then fill in:

```text
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

`backend/.env` is ignored by Git. Do not commit real API keys.

`backend/.env` 已被 `.gitignore` 排除，不要把真实 API key 提交到 GitHub。

---

## Run Locally / 本地运行

### 1. Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000
```

Health check:

```text
GET http://127.0.0.1:8000/api/health/
```

### 2. Frontend

Open another PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

### Static Demo Build / 静态 Demo 构建

```powershell
cd frontend
$env:VITE_DEMO_MODE='true'
$env:VITE_BASE_PATH='/GameMemory/'
npm run build:pages
```

---

## Production Deployment / 生产部署

Recommended deployment split:

```text
Vercel             Vue 3 + Vite frontend
Render             Django REST API backend
Render PostgreSQL  Production database
RAWG / SteamGridDB External game data and artwork APIs
```

推荐部署结构：

```text
Vercel             Vue 3 + Vite 前端
Render             Django REST API 后端
Render PostgreSQL  线上数据库
RAWG / SteamGridDB 外部游戏资料与素材 API
```

### 1. Deploy Backend on Render / 部署 Render 后端

This repository includes `render.yaml`, so Render can create the backend web service and PostgreSQL database from a Blueprint.

本项目已包含 `render.yaml`，可以在 Render 里通过 Blueprint 自动创建后端服务和 PostgreSQL 数据库。

Steps:

1. Push the repository to GitHub.
2. Open Render and choose **New +** -> **Blueprint**.
3. Select this repository.
4. Render will detect `render.yaml`.
5. Fill the secret environment variables:

```text
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

Render will generate `DJANGO_SECRET_KEY` and connect `DATABASE_URL` from PostgreSQL automatically.

Render 会自动生成 `DJANGO_SECRET_KEY`，并从 PostgreSQL 服务注入 `DATABASE_URL`。

After deploy, your backend URL will look like:

```text
https://gamememory-api.onrender.com
```

Health check:

```text
https://gamememory-api.onrender.com/api/health/
```

### 2. Deploy Frontend on Vercel / 部署 Vercel 前端

In Vercel:

1. Import this GitHub repository.
2. Set the project root directory to:

```text
frontend
```

3. Use the default Vite settings:

```text
Build Command: npm run build
Output Directory: dist
```

4. Add an environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

Replace `your-render-backend` with your actual Render service domain.

把 `your-render-backend` 替换成你自己的 Render 后端域名。

### 3. Connect Frontend and Backend / 连接前后端

After Vercel deploys, copy the Vercel app URL, for example:

```text
https://gamememory.vercel.app
```

Then update these Render environment variables:

```text
DJANGO_ALLOWED_HOSTS=your-render-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://gamememory.vercel.app
CSRF_TRUSTED_ORIGINS=https://gamememory.vercel.app
```

Restart the Render backend after changing environment variables.

修改环境变量后，重启 Render 后端服务。

### 4. Notes / 注意事项

- Real API keys belong only in Render environment variables.
- Vercel should only receive `VITE_API_BASE_URL`.
- PostgreSQL is used only when `DATABASE_URL` exists.
- Local development still falls back to SQLite.
- The GitHub Pages demo remains a static preview and does not use the production backend.

- 真实 API key 只放在 Render 环境变量里。
- Vercel 前端只需要 `VITE_API_BASE_URL`。
- 只有存在 `DATABASE_URL` 时，Django 才会使用 PostgreSQL。
- 本地开发仍然默认使用 SQLite。
- GitHub Pages 仍然只是静态预览，不连接生产后端。

---

## Core API / 核心接口

```text
GET    /api/health/                 Backend health check

GET    /api/games/                  List local games
POST   /api/games/                  Create a local game record
GET    /api/games/?status=playing   Filter local games by status
GET    /api/games/{id}/             Read one local game
PATCH  /api/games/{id}/             Update personal review fields
DELETE /api/games/{id}/             Delete one local game

GET    /api/games/search/?q=name    Search RAWG through the backend
GET    /api/games/trending/         Recent high-interest RAWG games
POST   /api/games/import_rawg/      Import one RAWG game by rawg_id
GET    /api/games/{id}/media/       RAWG screenshots, trailers, stores
GET    /api/games/{id}/artwork/     SteamGridDB poster, hero, logo

GET    /api/stats/                  Read archive statistics
```

---

## Pages / 页面

| Page | Path | Description |
|---|---|---|
| Library / 游戏库 | `/` | Imported games with status filtering |
| Search / 搜索导入 | `/search` | Search RAWG and browse recent popular games |
| Detail / 游戏详情 | `/games/:id` | Official metadata, visual media, and personal review |
| Stats / 统计 | `/stats` | Archive summary and score/tag statistics |

---

## Validation / 验证

Backend:

```powershell
cd backend
.\.venv\Scripts\python manage.py test
```

Frontend:

```powershell
cd frontend
npm run build
```

Current validation status:

- Backend tests: 6 passing
- Frontend production build: passing

---

## Security Notes / 安全说明

- RAWG and SteamGridDB API keys are read only by Django.
- The frontend never receives or stores API keys.
- Imported game data is cached in SQLite.
- Local database files are ignored by Git.
- Virtual environments, build output, screenshots, and local IDE files are ignored.

- RAWG 与 SteamGridDB 的 API key 只由 Django 后端读取。
- 前端不会保存或暴露 API key。
- 导入后的游戏资料会缓存在 SQLite。
- 本地数据库文件不会进入 Git。
- 虚拟环境、构建产物、截图和本地 IDE 文件都已忽略。

---

## Roadmap / 后续计划

- [x] Django REST backend
- [x] Vue 3 + Vite frontend
- [x] Local SQLite game archive
- [x] RAWG search and import
- [x] Personal review editor
- [x] Status filtering
- [x] Statistics page
- [x] RAWG screenshot gallery
- [x] SteamGridDB visual artwork
- [x] Recent high-interest games on the search page
- [ ] Better artwork selection controls
- [ ] Local screenshot cache or image proxy
- [ ] Export archive data
- [ ] Search and filter by tag
- [ ] Optional public deployment guide

---

## Who Is This For / 适合人群

- Players who want a private game diary.
- People who like rating and tagging game experiences.
- Users who want to keep official game metadata and personal notes together.
- Learners who want a full-stack Vue + Django reference project.

- 想建立个人游戏日记的玩家。
- 喜欢给游戏评分、打标签、写体验的人。
- 想把官方资料和个人评价放在一起管理的用户。
- 想参考 Vue + Django 全栈项目结构的学习者。

---

## Author / 作者

**Haoran Fei / 费浩然**

Built as a personal full-stack game archive project.

这是一个用于个人游戏记录与全栈开发练习的项目。

---

## License / 开源许可

MIT License planned.

This project is shared for learning, demonstration, and personal archive use.
