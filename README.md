# GameMemory

> A personal full-stack game archive for searching, importing, rating, tagging, and reviewing games.  
> 一个用于搜索、导入、评分、打标签和记录游戏体验的个人全栈游戏档案馆。

![Vue 3](https://img.shields.io/badge/Vue%203-Frontend-42b883)
![Vite](https://img.shields.io/badge/Vite-Build-646cff)
![Netlify](https://img.shields.io/badge/Netlify-Production%20Host-00c7b7)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)
![Django](https://img.shields.io/badge/Django-Local%20Backend-0c4b33)
![RAWG](https://img.shields.io/badge/RAWG-Game%20Data-fd6c35)
![SteamGridDB](https://img.shields.io/badge/SteamGridDB-Artwork-66c2ff)

## Overview / 项目简介

**GameMemory** is a personal full-stack game archive for building a private game library. It allows users to search games, import official metadata, record play status, rate different aspects of a game, add tags, and write personal reviews.

The production version is deployed on **Netlify**. The frontend is built with **Vue 3 + Vite**, the production API is implemented with **Netlify Functions**, and the online database is powered by **Supabase PostgreSQL**.

The repository also keeps the original **Django + Django REST Framework** backend for local development and learning purposes. The Django backend is not used by the current production deployment.

**GameMemory** 是一个个人全栈游戏档案馆，用于建立自己的游戏体验记录库。用户可以搜索游戏、导入官方资料、记录游玩状态、给不同维度评分、添加体验标签，并写下主观评价。

当前线上版本部署在 **Netlify**。前端使用 **Vue 3 + Vite**，线上 API 使用 **Netlify Functions**，线上数据库使用 **Supabase PostgreSQL**。

仓库中也保留了最初的 **Django + Django REST Framework** 后端，主要用于本地开发和学习。当前线上部署不使用 Django 后端。

## Live Demo / 在线演示

### Production Version / 线上真实版

```text
https://1gamememory1.netlify.app
```

This version connects to the real serverless API and Supabase database.

该版本连接真实的 Serverless API 和 Supabase 数据库。

### API Health Check / API 健康检查

```text
https://1gamememory1.netlify.app/api/health
```

### Static UI Demo / 静态界面演示

```text
https://1379475267-svg.github.io/GameMemory/
```

This version is a static UI demo built for interface preview only. It uses sample data and does not connect to the production API or Supabase database. Features such as real search, import, edit, delete, and statistics should be tested on the Netlify production version.

该版本是用于预览界面的静态演示版，使用示例数据，不连接真实线上 API 和 Supabase 数据库。真实搜索、导入、编辑、删除和统计功能请在 Netlify 线上版本中测试。

## Screenshots / 界面截图

### Search and Import / 搜索导入

![Search and Import](docs/screenshots/search.png)

### Game Library / 游戏库

![Game Library](docs/screenshots/library.png)

### Game Detail / 游戏详情

![Game Detail](docs/screenshots/detail.png)

### Statistics / 统计页面

![Statistics](docs/screenshots/stats.png)

## Features / 功能特性

- Search games through the RAWG API.  
  通过 RAWG API 搜索游戏。
- Display recent high-interest games on the search page.  
  在搜索页展示近期高关注度游戏。
- Import selected games into the personal archive.  
  将选中的游戏导入个人游戏库。
- Store imported game metadata in Supabase PostgreSQL.  
  将导入后的游戏资料存储到 Supabase PostgreSQL 中。
- Browse imported games with dark archive-style cards.  
  使用深色档案馆风格卡片浏览已导入游戏。
- Filter games by play status: backlog, playing, completed, paused, dropped.  
  按游玩状态筛选游戏：想玩、游玩中、已通关、暂停、弃坑。
- View official metadata and personal notes on the detail page.  
  在详情页查看官方资料和个人记录。
- Edit play platform, overall score, graphics score, story score, gameplay score, immersion score, music score, tags, and review text.  
  编辑游玩平台、综合评分、画质评分、剧情评分、玩法评分、沉浸感评分、音乐评分、标签和文字评价。
- Delete games from the archive.  
  从游戏库中删除游戏。
- Show statistics such as total games, completed games, average score, top tags, and highest-rated game.  
  展示游戏总数、已通关数量、平均评分、高频标签和最高评分游戏等统计数据。
- Enrich game detail pages with RAWG media and SteamGridDB artwork.  
  使用 RAWG 媒体资源和 SteamGridDB 美术素材增强详情页视觉效果。

## Tech Stack / 技术栈

| Area / 模块 | Technology / 技术 | Description / 说明 |
|---|---|---|
| Frontend / 前端 | Vue 3, Vite, Vue Router | Main user interface / 主要用户界面 |
| Production API / 线上 API | Netlify Functions | Serverless API under `/api/*` / 基于 `/api/*` 的无服务器接口 |
| Production Database / 线上数据库 | Supabase PostgreSQL | Stores imported games and personal reviews / 存储游戏资料和个人评价 |
| Local Backend / 本地后端 | Django, Django REST Framework | Original local backend for development and learning / 用于本地开发和学习的早期后端 |
| Local Database / 本地数据库 | SQLite | Used by the Django backend / Django 后端本地使用 |
| Game Data / 游戏数据 | RAWG API | Search, metadata, screenshots, trailers / 搜索、资料、截图、预告片 |
| Artwork / 美术素材 | SteamGridDB API | Posters, heroes, logos / 海报、横幅、Logo 等素材 |

## Architecture / 项目架构

```text
Browser
  |
  | Vue 3 + Vite frontend
  v
Netlify Site
  |
  | /api/*
  v
Netlify Functions
  |        \
  |         \---- RAWG API / SteamGridDB API
  v
Supabase PostgreSQL
```

In production, the browser does not access Supabase directly. All database operations are handled by Netlify Functions using server-side environment variables.

在线上环境中，浏览器不会直接访问 Supabase 数据表。所有数据库操作都通过 Netlify Functions 在服务端完成，并使用服务端环境变量中的密钥。

## Project Structure / 项目结构

```text
GameMemory/
|-- api/                         # Vercel-style serverless API modules
|-- backend/                     # Django + DRF local backend
|   |-- core/
|   |-- games/
|   |-- gamememory/
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/                    # Vue 3 + Vite frontend
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
|-- vercel.json                  # Alternative Vercel deployment config
`-- README.md
```

Notes:

- `netlify/functions/api.js` is used by the current production deployment.
- `backend/` is kept for local development and learning.
- `api/`, `vercel.json`, and `render.yaml` are kept as alternative or legacy deployment-related files.

说明：

- 当前线上部署使用 `netlify/functions/api.js`。
- `backend/` 保留用于本地开发和学习。
- `api/`、`vercel.json` 和 `render.yaml` 属于备用或历史部署相关文件。

## Production Deployment / 线上部署

The recommended production deployment path is:

```text
Netlify             Vue frontend and serverless API
Supabase            PostgreSQL database
RAWG / SteamGridDB  External game data and artwork APIs
```

推荐的线上部署路线是：

```text
Netlify             Vue 前端和 Serverless API
Supabase            PostgreSQL 数据库
RAWG / SteamGridDB  外部游戏资料和美术素材 API
```

### 1. Supabase Setup / 配置 Supabase

Create a Supabase project, open **SQL Editor**, and run the SQL script:

```text
supabase/schema.sql
```

The script creates the `public.games` table and prepares the database permissions required by the server-side API.

创建 Supabase 项目后，打开 **SQL Editor**，运行：

```text
supabase/schema.sql
```

该脚本会创建 `public.games` 表，并配置服务端 API 所需的数据库权限。

Important values from Supabase:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

需要从 Supabase 获取的重要信息：

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` is highly sensitive. It must only be stored in server-side environment variables, such as Netlify environment variables. Never expose it to frontend code.

`SUPABASE_SERVICE_ROLE_KEY` 权限很高，只能存放在服务端环境变量中，例如 Netlify 环境变量，不能暴露到前端代码里。

### 2. Netlify Setup / 配置 Netlify

Import this GitHub repository into Netlify.

Use these build settings:

```text
Base directory:        leave empty
Build command:         npm run build
Publish directory:     frontend/dist
Functions directory:   netlify/functions
```

These settings are also defined in `netlify.toml`.

将本仓库导入 Netlify 后，使用以下构建设置：

```text
Base directory:        留空
Build command:         npm run build
Publish directory:     frontend/dist
Functions directory:   netlify/functions
```

这些设置也已经写入 `netlify.toml`。

Add the following environment variables in Netlify:

```text
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

在 Netlify 中添加以下环境变量：

```text
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

After adding or changing environment variables, trigger a new Netlify deploy.

添加或修改环境变量后，需要重新触发一次 Netlify 部署。

### 3. Verify Production / 验证线上环境

Open:

```text
https://your-netlify-site.netlify.app/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "GameMemory Netlify API",
  "rawg_api_key_configured": true,
  "steamgriddb_api_key_configured": true,
  "supabase_configured": true
}
```

Then test the core workflow:

1. Search for `elden ring`.  
   搜索 `elden ring`。
2. Import one game.  
   导入一个游戏。
3. Open the game library.  
   打开游戏库。
4. Edit rating, tags, and review text.  
   编辑评分、标签和文字评价。
5. Refresh the page and check whether changes are saved.  
   刷新页面，检查修改是否保存。
6. Open the statistics page.  
   打开统计页。

## Local Development / 本地开发

### Frontend Only / 仅运行前端

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

In development, the frontend defaults to the Django API:

```text
http://127.0.0.1:8000/api
```

前端开发环境默认连接本地 Django API：

```text
http://127.0.0.1:8000/api
```

### Django Backend / Django 本地后端

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

### Netlify-Style Local Build / 按 Netlify 方式本地构建

From the repository root:

```powershell
npm install
npm run build
```

The root build command installs frontend dependencies and builds `frontend/dist`.

在仓库根目录执行上述命令后，会安装前端依赖并构建 `frontend/dist`。

## Production API Routes / 线上 API 路由

In production, all API routes are handled by `netlify/functions/api.js`.

在线上环境中，所有 API 路由都由 `netlify/functions/api.js` 统一处理。

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

## Environment Variables / 环境变量

### Production / 线上环境

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RAWG_API_KEY
STEAMGRIDDB_API_KEY
```

### Local Django Backend / 本地 Django 后端

```text
DJANGO_SECRET_KEY
DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS
RAWG_API_KEY
STEAMGRIDDB_API_KEY
```

## Security Notes / 安全说明

- Do not commit real API keys or environment files to the repository.  
  不要将真实 API key 或环境变量文件提交到仓库中。
- Production secrets should be stored in deployment platform environment variables.  
  线上密钥应存放在部署平台的环境变量中。
- `SUPABASE_SERVICE_ROLE_KEY` must only be used on the server side.  
  `SUPABASE_SERVICE_ROLE_KEY` 只能在服务端使用。
- The frontend does not access Supabase tables directly. Database operations are handled by Netlify Functions.  
  前端不会直接访问 Supabase 数据表，数据库操作由 Netlify Functions 在服务端完成。
- If any secret key is accidentally exposed, rotate it immediately and update the deployment environment variables.  
  如果任何密钥被意外暴露，应立即轮换密钥，并更新部署平台中的环境变量。

## Troubleshooting / 常见问题

### `vite: not found` on Netlify

Reason:

Netlify installs root dependencies by default, but Vite is installed inside `frontend`.

原因：

Netlify 默认安装根目录依赖，而 Vite 安装在 `frontend` 目录中。

Solution:

Use the root build script:

```text
npm install --prefix frontend && npm run build --prefix frontend
```

This is already configured in the root `package.json`.

该命令已经配置在根目录 `package.json` 中。

### `TypeError: fetch failed` when loading the library

This is usually caused by an incorrect `SUPABASE_URL`.

这个问题通常是 `SUPABASE_URL` 填写错误导致的。

Correct format:

```text
https://your-project-id.supabase.co
```

Do not include `/rest/v1/`.

不要在末尾添加 `/rest/v1/`。

### `permission denied for table games`

Run this in Supabase SQL Editor:

```sql
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
```

在 Supabase SQL Editor 中运行以上 SQL，给服务端使用的 `service_role` 补充表权限。

### Health check is true but games still fail

`/api/health` only checks whether environment variables exist. It does not prove that the Supabase URL and service role key are valid.

`/api/health` 只检查环境变量是否存在，不代表 Supabase URL 和 service role key 一定有效。

Use this route to verify real database access:

```text
/api/games
```

可以通过访问 `/api/games` 来验证真实数据库访问是否正常。

## Roadmap / 后续计划

- [x] Vue 3 + Vite frontend  
  Vue 3 + Vite 前端
- [x] Django + DRF local backend  
  Django + DRF 本地后端
- [x] RAWG search and import  
  RAWG 搜索与导入
- [x] SQLite local archive  
  SQLite 本地游戏库
- [x] Supabase production database  
  Supabase 线上数据库
- [x] Netlify production deployment  
  Netlify 线上部署
- [x] SteamGridDB artwork integration  
  SteamGridDB 美术素材集成
- [x] Recent high-interest games  
  近期高关注度游戏展示
- [x] Personal review editor  
  个人评价编辑器
- [x] Statistics page  
  统计页
- [ ] Better artwork selection controls  
  更完善的封面和素材选择控制
- [ ] Tag search and advanced filters  
  标签搜索和高级筛选
- [ ] Export archive data  
  导出游戏档案数据
- [ ] Friendlier production error messages  
  更友好的线上错误提示
- [ ] Loading states and success messages  
  加载状态和成功提示
- [ ] User authentication and private archives  
  用户登录和私有游戏库

## Author / 作者

**Haoran Fei**

Built as a personal full-stack game archive and learning project.

这是一个用于学习全栈开发、Serverless 部署和个人游戏体验记录的项目。

## License / 开源协议

No license has been specified yet.

暂未指定开源协议。
