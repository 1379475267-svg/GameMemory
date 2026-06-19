# GameMemory

<p>
  <a href="README.md"><img alt="English README" src="https://img.shields.io/badge/Language-English-blue?style=for-the-badge"></a>
  <a href="README.zh.md"><img alt="中文 README" src="https://img.shields.io/badge/语言-中文-red?style=for-the-badge"></a>
</p>

> 一个个人全栈游戏档案馆：搜索、导入、评分、打标签、写评价、分享记忆，并导出自己的游戏收藏。

![Vue 3](https://img.shields.io/badge/Vue%203-Frontend-42b883)
![Vite](https://img.shields.io/badge/Vite-Build-646cff)
![Netlify](https://img.shields.io/badge/Netlify-Production%20Host-00c7b7)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Storage-3ecf8e)
![Django](https://img.shields.io/badge/Django-Local%20Backend-0c4b33)
![RAWG](https://img.shields.io/badge/RAWG-Game%20Data-fd6c35)
![SteamGridDB](https://img.shields.io/badge/SteamGridDB-Artwork-66c2ff)

## 项目概览

**GameMemory** 是一个个人全栈游戏档案馆。它可以通过 RAWG 搜索游戏、导入官方资料、用 SteamGridDB 素材增强详情页、记录游玩状态和评分、编写主观评价、查看游戏库统计，并在游戏详情页留下公开的“游戏记忆墙”留言。

当前生产版本使用：

- **Vue 3 + Vite** 构建前端
- **Netlify Functions** 提供生产 API
- **Supabase PostgreSQL** 存储游戏和留言数据
- **Supabase Storage** 存储记忆墙图片
- **RAWG API** 提供游戏搜索、元数据、截图和预告片
- **SteamGridDB API** 提供封面、横幅和 Logo 素材

仓库里也保留了早期的 **Django + Django REST Framework + SQLite** 后端，主要用于本地学习和实验。当前线上部署不使用 Django 后端。

## 在线演示

- 生产站点：[打开 GameMemory](https://1gamememory1.netlify.app)
- API 健康检查：[打开 API 健康检查](https://1gamememory1.netlify.app/api/health)
- 静态 UI 演示：[打开静态 UI 演示](https://1379475267-svg.github.io/GameMemory/)

Netlify 版本连接真实的 serverless API 和 Supabase 数据库。GitHub Pages 版本只是静态界面预览。

## 截图

### 搜索与导入

![搜索与导入](docs/screenshots/search.png)

### 游戏库

![游戏库](docs/screenshots/library.png)

### 游戏详情

![游戏详情](docs/screenshots/detail.png)

### 统计

![统计](docs/screenshots/stats.png)

## 功能

- 使用 RAWG API 搜索游戏。
- 在搜索页展示近期高热度游戏。
- 将游戏导入存储在 Supabase 的档案库。
- 以暗色档案卡片浏览游戏。
- 按状态筛选，按关键词搜索，按标签筛选，并支持排序。
- 将当前游戏库视图导出为 JSON 或 CSV。
- 查看官方资料、截图、商店、预告片和 SteamGridDB 素材。
- 为详情页选择 SteamGridDB 封面、横幅和 Logo。
- 编辑游玩平台、总评分、画质评分、剧情评分、玩法评分、沉浸感评分、音乐评分、体验标签和文字评价。
- 删除游戏档案。
- 查看统计：游戏总数、已通关数量、平均分、热门标签和最高评分游戏。
- 在每个游戏详情页留下匿名记忆墙留言。
- 为每条记忆墙留言附加一张图片，图片通过服务端 API 上传到 Supabase Storage。
- 可通过 `COMMENT_MODERATION_MODE=manual` 开启手动留言审核。

## 游戏记忆墙

每个游戏详情页都包含 **Memory Wall / 游戏记忆墙**。

访客可以提交：

- 昵称
- 可选的 1 到 10 分评分
- 留言内容
- 可选图片附件

图片上传规则：

- 每条留言最多一张图片
- 支持 JPG、PNG、WebP
- 前端允许选择最大 5 MB 的图片，并在上传前自动压缩
- 服务端最终上传限制为 2 MB
- 图片由 Netlify Functions 使用服务端 Supabase 凭据上传
- 前端代码永远不会拿到 Supabase service role key

第一次上传图片时，函数可以自动创建 Supabase Storage bucket：

```text
comment-images
```

## 技术栈

| 模块 | 技术 | 说明 |
|---|---|---|
| 前端 | Vue 3, Vite, Vue Router | 主用户界面 |
| 生产 API | Netlify Functions | `/api/*` 下的 serverless API |
| 生产数据库 | Supabase PostgreSQL | 存储游戏、评价和记忆墙留言 |
| 生产存储 | Supabase Storage | 存储留言图片 |
| 本地后端 | Django, Django REST Framework | legacy / 本地学习后端 |
| 本地数据库 | SQLite | Django 后端使用 |
| 游戏数据 | RAWG API | 搜索、元数据、截图、预告片 |
| 游戏素材 | SteamGridDB API | 封面、横幅、Logo |

## 架构

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
  |
  |---- Supabase PostgreSQL
  |
  `---- Supabase Storage
```

生产环境中，浏览器不会直接访问 Supabase 表。数据库写入和图片上传都通过 Netlify Functions 完成。

## 项目结构

```text
GameMemory/
|-- api/                         # Vercel 风格 serverless API 模块
|-- backend/                     # Django + DRF 本地后端
|-- docs/                        # 截图和文档资源
|-- frontend/                    # Vue 3 + Vite 前端
|-- netlify/                     # 生产 Netlify Functions
|-- supabase/                    # 生产数据库 schema
|-- netlify.toml
|-- package.json
|-- render.yaml
|-- vercel.json
|-- README.md
`-- README.zh.md
```

## 生产部署

推荐部署方式：

| 服务 | 用途 |
|---|---|
| Netlify | Vue 前端和 serverless API |
| Supabase | PostgreSQL 数据库和 Storage |
| RAWG / SteamGridDB | 外部游戏数据和素材 API |

### 1. Supabase 设置

创建 Supabase 项目，打开 **SQL Editor**，运行：

```text
supabase/schema.sql
```

该 schema 会创建：

- `public.games`
- `public.game_comments`
- 所需索引
- Row Level Security policies
- service role 权限

必需的 Supabase 环境变量：

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` 非常敏感，只能放在服务端环境变量里。

### 2. Netlify 设置

把这个 GitHub 仓库导入 Netlify。

构建设置：

```text
Base directory:        留空
Build command:         npm run build
Publish directory:     frontend/dist
Functions directory:   netlify/functions
```

必需的 Netlify 环境变量：

```text
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
COMMENT_MODERATION_MODE=manual
```

`COMMENT_MODERATION_MODE` 是可选项。设为 `manual` 时，新记忆墙留言会以 `pending` 状态写入，而不是立即展示。

### 3. 验证生产环境

打开 [你的 Netlify API 健康检查](https://your-netlify-site.netlify.app/api/health)。

预期返回结构：

```json
{
  "status": "ok",
  "service": "GameMemory Netlify API",
  "rawg_api_key_configured": true,
  "steamgriddb_api_key_configured": true,
  "supabase_configured": true
}
```

然后测试：

1. 搜索一个游戏。
2. 导入游戏。
3. 打开游戏详情页。
4. 编辑自己的评价。
5. 如果有素材候选，选择详情页素材。
6. 添加一条记忆墙留言。
7. 添加一条带图片的记忆墙留言。
8. 刷新页面，确认数据仍然存在。

## 本地开发

### 仅运行前端

```powershell
cd frontend
npm install
npm run dev
```

前端地址：[打开本地前端](http://127.0.0.1:5173)

本地 Vite 开发时，前端默认访问 Django API：[打开本地 API](http://127.0.0.1:8000/api)。

### Django 后端

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```

填写 `backend/.env`：

```text
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

后端健康检查：[打开本地后端健康检查](http://127.0.0.1:8000/api/health/)

### Netlify 风格构建

在仓库根目录运行：

```powershell
npm install
npm run build
```

根目录 build 脚本会安装前端依赖并构建 `frontend/dist`。

## 生产 API 路由

生产环境中，API 路由由 `netlify/functions/api.js` 处理。

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
PATCH  /api/games/:id/artwork
GET    /api/comments?gameId=1
POST   /api/comments
POST   /api/comments/upload-image
GET    /api/stats
```

## 环境变量

### 生产环境

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RAWG_API_KEY
STEAMGRIDDB_API_KEY
COMMENT_MODERATION_MODE
```

### 本地 Django 后端

```text
DJANGO_SECRET_KEY
DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS
RAWG_API_KEY
STEAMGRIDDB_API_KEY
```

## 安全说明

- 不要提交真实 API key 或环境变量文件。
- 生产密钥应保存在部署平台的环境变量中。
- `SUPABASE_SERVICE_ROLE_KEY` 只能在服务端使用。
- 前端不会直接访问 Supabase 表。
- 留言图片上传前会校验文件类型和大小。
- 记忆墙留言包含基础频率限制和 honeypot 字段。
- 如果任何密钥暴露，请立即轮换并更新部署平台环境变量。

## 常见问题

### Netlify 上出现 `vite: not found`

Netlify 默认安装根目录依赖，但 Vite 安装在 `frontend` 目录。

使用根目录构建脚本：

```text
npm install --prefix frontend && npm run build --prefix frontend
```

这个命令已经配置在根目录 `package.json` 中。

### 加载游戏库时出现 `TypeError: fetch failed`

通常是 `SUPABASE_URL` 配置不正确。

正确格式：[你的 Supabase 项目 URL](https://your-project-id.supabase.co)

不要包含 `/rest/v1/`。

### `permission denied for table games`

在 Supabase SQL Editor 中运行：

```sql
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
```

### 图片留言保存失败

检查：

- `public.game_comments` 中存在 `image_url`
- Netlify 配置了 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`
- 上传图片是 JPG、PNG 或 WebP
- 图片压缩后不超过 2 MB
- `comment-images` Storage bucket 存在，或 service role key 有权限创建它

### Health check 为 true，但游戏仍然加载失败

`/api/health` 只检查环境变量是否存在，不证明 Supabase URL 和 service role key 一定有效。

可以使用 [games API 路由](https://1gamememory1.netlify.app/api/games) 验证真实数据库访问。

## Roadmap

- [x] Vue 3 + Vite 前端
- [x] Django + DRF 本地后端
- [x] RAWG 搜索和导入
- [x] SQLite 本地档案库
- [x] Supabase 生产数据库
- [x] Netlify 生产部署
- [x] SteamGridDB 素材集成
- [x] 近期热门游戏
- [x] 个人评价编辑器
- [x] 统计页
- [x] 记忆墙留言
- [x] 记忆墙图片附件
- [x] 更好的素材选择控件
- [x] 标签搜索和高级筛选
- [x] 档案数据导出
- [x] 更友好的生产错误提示
- [x] 可选留言审核流程
- [ ] 用户登录和私有档案

## 作者

**Haoran Fei**

作为个人全栈游戏档案馆和学习项目构建。

## 许可证

暂未指定许可证。
