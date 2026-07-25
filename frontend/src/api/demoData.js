const coverPath = (filename) => `${import.meta.env.BASE_URL}covers/${filename}`

const DEMO_GAMES = [
  {
    id: 1,
    rawg_id: 124562,
    name: 'Clair Obscur: Expedition 33',
    slug: 'clair-obscur-expedition-33',
    background_image: coverPath('clair-obscur.jpg'),
    description:
      'A turn-based RPG with cinematic presentation, painterly environments, and a dramatic expedition story. This demo record shows how GameMemory combines official metadata with personal notes.',
    released: '2025-04-24',
    metacritic: 92,
    platforms: ['PC', 'PlayStation 5', 'Xbox Series S/X'],
    genres: ['RPG', 'Adventure'],
    rawg_rating: 4.65,
    website: 'https://www.expedition33.com/',
    developers: ['Sandfall Interactive'],
    publishers: ['Kepler Interactive'],
    stores: [
      { name: 'Steam', domain: 'store.steampowered.com', url: 'https://store.steampowered.com/' },
      { name: 'PlayStation Store', domain: 'store.playstation.com', url: 'https://store.playstation.com/' },
    ],
    screenshots: [
      { id: 1, image: 'https://media.rawg.io/media/screenshots/36f/36f941f72e2b2a41629f5fb3bd448688.jpg' },
      { id: 2, image: 'https://media.rawg.io/media/screenshots/290/29096848622521df7555850000236cb6.jpg' },
      { id: 3, image: 'https://media.rawg.io/media/screenshots/807/807685454ea8fb87363eedd49677f49b.jpg' },
    ],
    trailers: [
      {
        id: 1,
        name: 'Launch Trailer',
        preview: 'https://media.rawg.io/media/screenshots/2ee/2eea4d4cce2836f689d9d39d2a4a94d5.jpg',
        video: 'https://www.youtube.com/',
      },
    ],
    steamgriddb_id: 1001,
    steamgrid_assets: {
      poster: { url: 'https://cdn2.steamgriddb.com/grid/a0abf0396a718b8982fce0b80181d8cb.png' },
      hero: { url: 'https://cdn2.steamgriddb.com/hero/d1fcdf15cb97c47d0ed1e1e10773ae36.png' },
      logo: { url: 'https://cdn2.steamgriddb.com/logo/69f5d5c1249e17f4ac1d5b716db47105.png' },
    },
    status: 'playing',
    play_platform: 'PC',
    overall_score: 9,
    graphics_score: 9,
    story_score: 9,
    gameplay_score: 8,
    immersion_score: 9,
    music_score: 10,
    experience_tags: ['电影感', '美术惊艳', '剧情驱动'],
    review: '视觉风格非常强，适合放在个人档案馆里作为展示型详情页。',
    created_at: '2026-06-02T00:00:00Z',
    updated_at: '2026-06-02T00:00:00Z',
  },
  {
    id: 2,
    rawg_id: 326243,
    name: 'Elden Ring',
    slug: 'elden-ring',
    background_image: coverPath('elden-ring.jpg'),
    description:
      'A fantasy action RPG about exploration, danger, and discovery. Demo data includes gallery, artwork, scores, and personal tags.',
    released: '2022-02-25',
    metacritic: 95,
    platforms: ['PC', 'PlayStation 5', 'Xbox Series S/X', 'PlayStation 4'],
    genres: ['Action', 'RPG'],
    rawg_rating: 4.39,
    website: 'https://en.bandainamcoent.eu/elden-ring/elden-ring',
    developers: ['FromSoftware'],
    publishers: ['Bandai Namco Entertainment', 'FromSoftware'],
    stores: [
      { name: 'Steam', domain: 'store.steampowered.com', url: 'https://store.steampowered.com/' },
      { name: 'Xbox Store', domain: 'xbox.com', url: 'https://www.xbox.com/' },
    ],
    screenshots: [
      { id: 4, image: 'https://media.rawg.io/media/screenshots/36f/36f941f72e2b2a41629f5fb3bd448688.jpg' },
      { id: 5, image: 'https://media.rawg.io/media/screenshots/290/29096848622521df7555850000236cb6.jpg' },
      { id: 6, image: 'https://media.rawg.io/media/screenshots/de9/de9b28bdd0bdb9937c7f82e55f845bb6.jpg' },
    ],
    trailers: [],
    steamgriddb_id: 5277816,
    steamgrid_assets: {
      poster: { url: 'https://cdn2.steamgriddb.com/grid/a0abf0396a718b8982fce0b80181d8cb.png' },
      hero: { url: 'https://cdn2.steamgriddb.com/hero/d1fcdf15cb97c47d0ed1e1e10773ae36.png' },
      logo: { url: 'https://cdn2.steamgriddb.com/logo/69f5d5c1249e17f4ac1d5b716db47105.png' },
    },
    status: 'completed',
    play_platform: 'PlayStation 5',
    overall_score: 10,
    graphics_score: 9,
    story_score: 8,
    gameplay_score: 10,
    immersion_score: 10,
    music_score: 9,
    experience_tags: ['开放世界', '探索感', '高难度'],
    review: '第一次走出宁姆格福时的空间感很难忘。',
    created_at: '2026-06-02T00:00:00Z',
    updated_at: '2026-06-02T00:00:00Z',
  },
  {
    id: 3,
    rawg_id: 987001,
    name: 'Hades II',
    slug: 'hades-ii',
    background_image: coverPath('hades-ii.jpg'),
    description: 'A stylish roguelike action game with fast combat, mythological characters, and strong replay rhythm.',
    released: '2025-09-25',
    metacritic: null,
    platforms: ['PC', 'Nintendo Switch'],
    genres: ['Action', 'Roguelike'],
    rawg_rating: 4.45,
    website: 'https://www.supergiantgames.com/',
    developers: ['Supergiant Games'],
    publishers: ['Supergiant Games'],
    stores: [{ name: 'Steam', domain: 'store.steampowered.com', url: 'https://store.steampowered.com/' }],
    screenshots: [],
    trailers: [],
    steamgriddb_id: 1003,
    steamgrid_assets: {},
    status: 'backlog',
    play_platform: '',
    overall_score: null,
    graphics_score: null,
    story_score: null,
    gameplay_score: null,
    immersion_score: null,
    music_score: null,
    experience_tags: ['期待', '动作'],
    review: '',
    created_at: '2026-06-02T00:00:00Z',
    updated_at: '2026-06-02T00:00:00Z',
  },
]

const TRENDING_GAMES = [
  ...DEMO_GAMES,
  {
    id: 4,
    rawg_id: 990004,
    name: 'Hollow Knight: Silksong',
    background_image: coverPath('silksong.jpg'),
    released: '2025-09-04',
    platforms: ['PC', 'Nintendo Switch', 'PlayStation 5'],
    genres: ['Action', 'Platformer'],
    rawg_rating: 4.7,
    metacritic: null,
  },
  {
    id: 5,
    rawg_id: 990005,
    name: 'Split Fiction',
    background_image: coverPath('split-fiction.jpg'),
    released: '2025-03-06',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series S/X'],
    genres: ['Adventure', 'Co-op'],
    rawg_rating: 4.4,
    metacritic: 91,
  },
]

const STORAGE_KEY = 'gamememory-demo-games-v2'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function loadGames() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored)
  const initial = clone(DEMO_GAMES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

function delay(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(clone(value)), 160)
  })
}

export function demoFetchGames(status = '') {
  const games = loadGames()
  return delay(status ? games.filter((game) => game.status === status) : games)
}

export function demoFetchGame(id) {
  const game = loadGames().find((item) => String(item.id) === String(id))
  if (!game) throw new Error('Demo game not found.')
  return delay(game)
}

export function demoUpdateGame(id, payload) {
  const games = loadGames()
  const index = games.findIndex((item) => String(item.id) === String(id))
  if (index === -1) throw new Error('Demo game not found.')
  games[index] = { ...games[index], ...payload, updated_at: new Date().toISOString() }
  saveGames(games)
  return delay(games[index])
}

export function demoDeleteGame(id) {
  saveGames(loadGames().filter((item) => String(item.id) !== String(id)))
  return delay(null)
}

export function demoSearchRawgGames(query) {
  const text = query.trim().toLowerCase()
  return delay(TRENDING_GAMES.filter((game) => game.name.toLowerCase().includes(text)))
}

export function demoFetchTrendingGames() {
  return delay(TRENDING_GAMES)
}

export function demoImportRawgGame(rawgId) {
  const games = loadGames()
  const existing = games.find((item) => item.rawg_id === rawgId)
  if (existing) return delay(existing)

  const source = TRENDING_GAMES.find((item) => item.rawg_id === rawgId)
  if (!source) throw new Error('Demo import target not found.')

  const imported = {
    ...source,
    id: Math.max(...games.map((game) => game.id), 0) + 1,
    status: 'backlog',
    play_platform: '',
    overall_score: null,
    graphics_score: null,
    story_score: null,
    gameplay_score: null,
    immersion_score: null,
    music_score: null,
    experience_tags: [],
    review: '',
    screenshots: source.screenshots || [],
    trailers: source.trailers || [],
    stores: source.stores || [],
    developers: source.developers || [],
    publishers: source.publishers || [],
    steamgrid_assets: source.steamgrid_assets || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  games.unshift(imported)
  saveGames(games)
  return delay(imported)
}

export function demoImportSteamGames(steamGames = [], appids = []) {
  const games = loadGames()
  const selected = new Set(appids.map(Number))
  const selectedGames = steamGames.filter((game) => selected.has(Number(game.steam_appid)))
  let importedCount = 0
  let updatedCount = 0

  selectedGames.forEach((steamGame) => {
    const existingIndex = games.findIndex(
      (game) => Number(game.steam_appid) === Number(steamGame.steam_appid),
    )
    const timestamps = {
      updated_at: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      games[existingIndex] = {
        ...games[existingIndex],
        ...timestamps,
        playtime_forever: steamGame.playtime_forever || 0,
        playtime_2weeks: steamGame.playtime_2weeks || 0,
      }
      updatedCount += 1
      return
    }

    games.unshift({
      id: Math.max(0, ...games.map((game) => Number(game.id) || 0)) + 1,
      rawg_id: null,
      steam_appid: steamGame.steam_appid,
      name: steamGame.name,
      slug: `steam-${steamGame.steam_appid}`,
      background_image: steamGame.background_image || '',
      description: '',
      released: null,
      metacritic: null,
      platforms: ['PC'],
      genres: [],
      status: 'backlog',
      play_platform: 'PC',
      overall_score: null,
      experience_tags: [],
      review: '',
      screenshots: [],
      trailers: [],
      stores: steamGame.store_url
        ? [{ name: 'Steam', domain: 'store.steampowered.com', url: steamGame.store_url }]
        : [],
      developers: [],
      publishers: [],
      steamgrid_assets: {},
      playtime_forever: steamGame.playtime_forever || 0,
      playtime_2weeks: steamGame.playtime_2weeks || 0,
      created_at: new Date().toISOString(),
      ...timestamps,
    })
    importedCount += 1
  })

  saveGames(games)
  return delay({
    imported_count: importedCount,
    updated_count: updatedCount,
    games: selectedGames,
  })
}

export function demoFetchGameMedia(id) {
  return demoFetchGame(id).then((game) => ({
    screenshots: game.screenshots || [],
    trailers: game.trailers || [],
    stores: game.stores || [],
    developers: game.developers || [],
    publishers: game.publishers || [],
    website: game.website || '',
  }))
}

export function demoFetchGameArtwork(id) {
  return demoFetchGame(id).then((game) => ({
    steamgriddb_id: game.steamgriddb_id,
    assets: game.steamgrid_assets || {},
  }))
}

export function demoFetchStats() {
  const games = loadGames()
  const scored = games.filter((game) => game.overall_score)
  const tags = new Map()
  games.forEach((game) => {
    ;(game.experience_tags || []).forEach((tag) => tags.set(tag, (tags.get(tag) || 0) + 1))
  })
  const topGame = [...scored].sort((a, b) => b.overall_score - a.overall_score)[0] || null

  return delay({
    total_games: games.length,
    completed_games: games.filter((game) => game.status === 'completed').length,
    average_score: scored.length
      ? scored.reduce((sum, game) => sum + Number(game.overall_score), 0) / scored.length
      : null,
    top_tags: [...tags.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count })),
    top_game: topGame,
  })
}
