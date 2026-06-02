# GameMemory

> Personal Game Experience Archive
> 涓汉娓告垙浣撻獙璁板綍搴?
![Vue](https://img.shields.io/badge/Vue%203-Frontend-42b883)
![Vite](https://img.shields.io/badge/Vite-Build-646cff)
![Django](https://img.shields.io/badge/Django-Backend-0c4b33)
![DRF](https://img.shields.io/badge/DRF-API-red)
![SQLite](https://img.shields.io/badge/SQLite-Local%20Database-336791)
![RAWG](https://img.shields.io/badge/RAWG-Game%20Data-fd6c35)
![SteamGridDB](https://img.shields.io/badge/SteamGridDB-Artwork-66c2ff)

---

## Project Overview / 椤圭洰姒傝

**GameMemory** is a personal game archive for recording what you played, how you felt, and which games left a mark.

It lets you search games through the RAWG Video Games Database API, import official game metadata into a local SQLite database, then add your own play status, scores, tags, platform, and written review.

The app also enriches detail pages with RAWG screenshots and SteamGridDB artwork, so each game page feels closer to a small private museum entry than a plain database row.

**GameMemory** 鏄竴涓釜浜烘父鎴忎綋楠屾。妗堥锛岀敤鏉ヨ褰曚綘鐜╄繃浠€涔堛€佺帺鍒板摢閲屻€佺粰浜嗗灏戝垎锛屼互鍙婅繖娆炬父鎴忕粰浣犵殑涓昏鎰熷彈銆?
椤圭洰閫氳繃 Django 鍚庣璋冪敤 RAWG API 鎼滅储娓告垙锛屽苟灏嗗皝闈€佺畝浠嬨€佸彂鍞棩鏈熴€佸钩鍙般€佺被鍨嬬瓑瀹樻柟璧勬枡淇濆瓨鍒版湰鍦?SQLite 鏁版嵁搴撱€備箣鍚庝綘鍙互涓烘瘡涓父鎴忚ˉ鍏呮父鐜╃姸鎬併€佽瘎鍒嗐€佷綋楠屾爣绛俱€佹父鐜╁钩鍙板拰鏂囧瓧璇勪环銆?
璇︽儏椤佃繕浼氱粨鍚?RAWG 鎴浘涓?SteamGridDB 楂樿川閲忚瑙夌礌鏉愶紝璁╂瘡涓父鎴忔。妗堟洿鍍忎竴涓浜烘敹钘忔潯鐩€?
---

## Online Demo / 鍦ㄧ嚎棰勮

GitHub Pages demo:

```text
https://1379475267-svg.github.io/GameMemory/
```

The online demo is a static Vue build with built-in sample data. It is designed to preview the interface, page flow, visual style, animations, detail pages, search page, and statistics page.

Because GitHub Pages cannot run the Django backend, the online demo does not call RAWG or SteamGridDB directly and does not use real API keys. To use real search, import, caching, and local database features, run the backend locally.

鍦ㄧ嚎棰勮鏄竴涓甫绀轰緥鏁版嵁鐨勯潤鎬?Vue Demo锛岀敤鏉ュ睍绀虹晫闈€侀〉闈㈡祦绋嬨€佽瑙夐鏍笺€佸姩鏁堛€佽鎯呴〉銆佹悳绱㈤〉鍜岀粺璁￠〉銆?
鐢变簬 GitHub Pages 涓嶈兘杩愯 Django 鍚庣锛屽湪绾?Demo 涓嶄細鐩存帴璋冪敤 RAWG 鎴?SteamGridDB锛屼篃涓嶄細浣跨敤鐪熷疄 API key銆傜湡瀹炴悳绱€佸鍏ャ€佹湰鍦扮紦瀛樺拰鏁版嵁搴撳姛鑳介渶瑕佸湪鏈湴鍚姩鍚庣銆?
---

## Core Features / 鏍稿績鍔熻兘

### Game Discovery / 娓告垙鍙戠幇

- Search games by name through RAWG.
- Browse recent high-interest games on the search page.
- Import selected games into the local archive.
- API keys are stored only in the Django backend.

- 閫氳繃 RAWG 鎸夊悕绉版悳绱㈡父鎴忋€?- 鎼滅储椤甸粯璁ゅ睍绀鸿繎鏈熼珮鐑害娓告垙銆?- 浠庣粨鏋滀腑閫夋嫨娓告垙骞跺鍏ユ湰鍦版暟鎹簱銆?- API key 鍙繚瀛樺湪 Django 鍚庣锛屼笉杩涘叆鍓嶇浠ｇ爜銆?
### Personal Archive / 涓汉妗ｆ

- View imported games as dark archive-style cards.
- Filter the library by play status.
- Open a game detail page with official metadata and personal notes.
- Delete games from the local archive.

- 浣跨敤娣辫壊鍗＄墖寮忕晫闈㈡祻瑙堝凡瀵煎叆娓告垙銆?- 鎸夋父鐜╃姸鎬佺瓫閫夋父鎴忓簱銆?- 鍦ㄨ鎯呴〉鏌ョ湅瀹樻柟璧勬枡鍜屼釜浜鸿瘎浠枫€?- 鏀寔鍒犻櫎鏈湴娓告垙妗ｆ銆?
### Review System / 璇勪环绯荤粺

- Play status: backlog, playing, completed, paused, dropped.
- Play platform.
- Overall score.
- Graphics, story, gameplay, immersion, and music scores.
- Experience tags.
- Written review.

- 娓哥帺鐘舵€侊細鎯崇帺銆佹父鐜╀腑銆佸凡閫氬叧銆佹殏鍋溿€佸純鍧戙€?- 娓哥帺骞冲彴銆?- 鎬昏瘎鍒嗐€?- 鐢昏川銆佸墽鎯呫€佺帺娉曘€佹矇娴告劅銆侀煶涔愯瘎鍒嗐€?- 浣撻獙鏍囩銆?- 鏂囧瓧璇勪环銆?
### Visual Enhancement / 瑙嗚澧炲己

- RAWG screenshots for detail page galleries.
- RAWG trailers and store links where available.
- SteamGridDB hero artwork, poster artwork, and transparent logos.
- Soft page reveal, hover lift, image zoom, and slow hero background motion.

- 浣跨敤 RAWG 鎴浘鐢熸垚璇︽儏椤靛奖鍍忕敾寤娿€?- 鏀寔 RAWG 棰勫憡鐗囧拰鍟嗗簵閾炬帴銆?- 浣跨敤 SteamGridDB 鐨勬í骞呭浘銆佺珫鐗堝皝闈㈠拰閫忔槑 Logo銆?- 鍖呭惈椤甸潰娣″叆銆佸崱鐗囦笂娴€佸浘鐗囨斁澶с€佽鎯呴〉鑳屾櫙缂撴參缂╂斁绛夊姩鏁堛€?
### Statistics / 缁熻

- Total game count.
- Completed game count.
- Average score.
- Most used experience tags.
- Highest-rated game.

- 娓告垙鎬绘暟銆?- 宸查€氬叧鏁伴噺銆?- 骞冲潎璇勫垎銆?- 鏈€甯哥敤浣撻獙鏍囩銆?- 璇勫垎鏈€楂樻父鎴忋€?
---

## Tech Stack / 鎶€鏈爤

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

## Project Structure / 椤圭洰缁撴瀯

```text
GameMemory/
鈹溾攢鈹€ backend/
鈹?  鈹溾攢鈹€ manage.py
鈹?  鈹溾攢鈹€ requirements.txt
鈹?  鈹溾攢鈹€ .env.example
鈹?  鈹溾攢鈹€ gamememory/
鈹?  鈹?  鈹溾攢鈹€ settings.py
鈹?  鈹?  鈹斺攢鈹€ urls.py
鈹?  鈹溾攢鈹€ core/
鈹?  鈹?  鈹溾攢鈹€ views.py
鈹?  鈹?  鈹溾攢鈹€ urls.py
鈹?  鈹?  鈹斺攢鈹€ tests.py
鈹?  鈹斺攢鈹€ games/
鈹?      鈹溾攢鈹€ models.py
鈹?      鈹溾攢鈹€ serializers.py
鈹?      鈹溾攢鈹€ views.py
鈹?      鈹溾攢鈹€ urls.py
鈹?      鈹溾攢鈹€ tests.py
鈹?      鈹斺攢鈹€ services/
鈹?          鈹溾攢鈹€ rawg.py
鈹?          鈹斺攢鈹€ steamgriddb.py
鈹?鈹溾攢鈹€ frontend/
鈹?  鈹溾攢鈹€ package.json
鈹?  鈹溾攢鈹€ vite.config.js
鈹?  鈹斺攢鈹€ src/
鈹?      鈹溾攢鈹€ App.vue
鈹?      鈹溾攢鈹€ main.js
鈹?      鈹溾攢鈹€ api/
鈹?      鈹溾攢鈹€ components/
鈹?      鈹溾攢鈹€ router/
鈹?      鈹溾攢鈹€ views/
鈹?      鈹斺攢鈹€ assets/
鈹?鈹溾攢鈹€ README.md
鈹斺攢鈹€ .gitignore
```

---

## Environment Variables / 鐜鍙橀噺

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

`backend/.env` 宸茶 `.gitignore` 鎺掗櫎锛屼笉瑕佹妸鐪熷疄 API key 鎻愪氦鍒?GitHub銆?
---

## Run Locally / 鏈湴杩愯

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

### Static Demo Build / 闈欐€?Demo 鏋勫缓

```powershell
cd frontend
$env:VITE_DEMO_MODE='true'
$env:VITE_BASE_PATH='/GameMemory/'
npm run build:pages
```

---

## Production Deployment / 鐢熶骇閮ㄧ讲

Recommended deployment split:

```text
Vercel             Vue 3 + Vite frontend
Render             Django REST API backend
Render PostgreSQL  Production database
RAWG / SteamGridDB External game data and artwork APIs
```

鎺ㄨ崘閮ㄧ讲缁撴瀯锛?
```text
Vercel             Vue 3 + Vite 鍓嶇
Render             Django REST API 鍚庣
Render PostgreSQL  绾夸笂鏁版嵁搴?RAWG / SteamGridDB 澶栭儴娓告垙璧勬枡涓庣礌鏉?API
```

### 1. Deploy Backend on Render / 閮ㄧ讲 Render 鍚庣

This repository includes `render.yaml`, so Render can create the backend web service and PostgreSQL database from a Blueprint.

鏈」鐩凡鍖呭惈 `render.yaml`锛屽彲浠ュ湪 Render 閲岄€氳繃 Blueprint 鑷姩鍒涘缓鍚庣鏈嶅姟鍜?PostgreSQL 鏁版嵁搴撱€?
Steps:

1. Push the repository to GitHub.
2. Open Render and choose **New +** -> **Blueprint**.
3. Select this repository.
4. Render will detect `render.yaml`.
5. Fill the secret environment variables:

```text
## Production Deployment / 生产部署

### Option A: Vercel + Supabase / 方案 A：Vercel + Supabase

```text
Vercel              Vue 3 + Vite frontend
Vercel Functions    Serverless API
Supabase            PostgreSQL database
RAWG / SteamGridDB  External game data and artwork APIs
```

This is the recommended no-credit-card deployment path.

这是推荐的免绑卡真实线上部署方案。

#### 1. Create Supabase Project / 创建 Supabase 项目

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run the SQL in:

```text
supabase/schema.sql
```

4. Open **Project Settings** -> **API** and copy:

```text
Project URL
service_role key
```

The service role key must only be stored in Vercel environment variables.

`service_role key` 只能放在 Vercel 环境变量中，不能放进前端代码。

#### 2. Deploy to Vercel / 部署到 Vercel

Import this GitHub repository into Vercel using the repository root.

导入 GitHub 仓库时，项目根目录使用仓库根目录，不要只选 `frontend`。

Vercel settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: frontend/dist
```

Add environment variables:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAWG_API_KEY=your-rawg-api-key
STEAMGRIDDB_API_KEY=your-steamgriddb-api-key
```

The frontend will call same-origin `/api` by default in production, so `VITE_API_BASE_URL` is not required on Vercel.

生产环境中，前端默认请求同域 `/api`，所以 Vercel 上通常不需要设置 `VITE_API_BASE_URL`。

#### 3. Local Vercel API Development / 本地调试 Vercel API

```powershell
npm install
npm run dev
```

This runs `vercel dev` from the repository root.

---

### Option B: Vercel + Render + PostgreSQL / 方案 B：Vercel + Render + PostgreSQL

This option keeps the Django backend online, but Render may require card verification.

这个方案会保留线上 Django 后端，但 Render 可能要求绑定信用卡。

```text
Vercel             Vue 3 + Vite frontend
Render             Django REST API backend
Render PostgreSQL  Production database
RAWG / SteamGridDB External game data and artwork APIs
```

This repository includes `render.yaml`, so Render can create the backend web service and PostgreSQL database from a Blueprint.

本项目已包含 `render.yaml`，可以在 Render 里通过 Blueprint 自动创建后端服务和 PostgreSQL 数据库。

---


```powershell
cd frontend
npm run build
```

Current validation status:

- Backend tests: 6 passing
- Frontend production build: passing

---

## Security Notes / 瀹夊叏璇存槑

- RAWG and SteamGridDB API keys are read only by Django.
- The frontend never receives or stores API keys.
- Imported game data is cached in SQLite.
- Local database files are ignored by Git.
- Virtual environments, build output, screenshots, and local IDE files are ignored.

- RAWG 涓?SteamGridDB 鐨?API key 鍙敱 Django 鍚庣璇诲彇銆?- 鍓嶇涓嶄細淇濆瓨鎴栨毚闇?API key銆?- 瀵煎叆鍚庣殑娓告垙璧勬枡浼氱紦瀛樺湪 SQLite銆?- 鏈湴鏁版嵁搴撴枃浠朵笉浼氳繘鍏?Git銆?- 铏氭嫙鐜銆佹瀯寤轰骇鐗┿€佹埅鍥惧拰鏈湴 IDE 鏂囦欢閮藉凡蹇界暐銆?
---

## Roadmap / 鍚庣画璁″垝

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

## Who Is This For / 閫傚悎浜虹兢

- Players who want a private game diary.
- People who like rating and tagging game experiences.
- Users who want to keep official game metadata and personal notes together.
- Learners who want a full-stack Vue + Django reference project.

- 鎯冲缓绔嬩釜浜烘父鎴忔棩璁扮殑鐜╁銆?- 鍠滄缁欐父鎴忚瘎鍒嗐€佹墦鏍囩銆佸啓浣撻獙鐨勪汉銆?- 鎯虫妸瀹樻柟璧勬枡鍜屼釜浜鸿瘎浠锋斁鍦ㄤ竴璧风鐞嗙殑鐢ㄦ埛銆?- 鎯冲弬鑰?Vue + Django 鍏ㄦ爤椤圭洰缁撴瀯鐨勫涔犺€呫€?
---

## Author / 浣滆€?
**Haoran Fei / 璐规旦鐒?*

Built as a personal full-stack game archive project.

杩欐槸涓€涓敤浜庝釜浜烘父鎴忚褰曚笌鍏ㄦ爤寮€鍙戠粌涔犵殑椤圭洰銆?
---

## License / 寮€婧愯鍙?
MIT License planned.

This project is shared for learning, demonstration, and personal archive use.
