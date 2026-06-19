import { createClient } from '@supabase/supabase-js'

const RAWG_BASE_URL = 'https://api.rawg.io/api'
const STEAMGRIDDB_BASE_URL = 'https://www.steamgriddb.com/api/v2'

export function sendJson(response, status, data) {
  response.status(status).json(data)
}

export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase environment variables are not configured.')
  }

  return createClient(url, serviceRoleKey)
}

export async function parseBody(request) {
  if (!request.body) return {}
  if (typeof request.body === 'object') return request.body
  return JSON.parse(request.body)
}

export function normalizeGame(row) {
  return {
    id: row.id,
    rawg_id: row.rawg_id,
    name: row.name,
    slug: row.slug || '',
    background_image: row.background_image || '',
    description: row.description || '',
    released: row.released,
    metacritic: row.metacritic,
    platforms: row.platforms || [],
    genres: row.genres || [],
    rawg_rating: row.rawg_rating,
    website: row.website || '',
    developers: row.developers || [],
    publishers: row.publishers || [],
    stores: row.stores || [],
    screenshots: row.screenshots || [],
    trailers: row.trailers || [],
    steamgriddb_id: row.steamgriddb_id,
    steamgrid_assets: row.steamgrid_assets || {},
    status: row.status || 'backlog',
    play_platform: row.play_platform || '',
    overall_score: row.overall_score,
    graphics_score: row.graphics_score,
    story_score: row.story_score,
    gameplay_score: row.gameplay_score,
    immersion_score: row.immersion_score,
    music_score: row.music_score,
    experience_tags: row.experience_tags || [],
    review: row.review || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function rawgRequest(path, params = {}) {
  if (!process.env.RAWG_API_KEY) {
    throw new Error('RAWG API key is not configured.')
  }

  const url = new URL(`${RAWG_BASE_URL}${path}`)
  url.searchParams.set('key', process.env.RAWG_API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`RAWG API returned HTTP ${response.status}.`)
  }

  return response.json()
}

export function normalizeRawgSearchResult(item) {
  return {
    rawg_id: item.id,
    name: item.name || '',
    slug: item.slug || '',
    background_image: item.background_image || '',
    released: item.released,
    platforms: (item.platforms || [])
      .map((entry) => entry.platform?.name)
      .filter(Boolean),
    genres: (item.genres || []).map((entry) => entry.name).filter(Boolean),
    rawg_rating: item.rating,
    metacritic: item.metacritic,
  }
}

export async function fetchRawgSearch(query) {
  const data = await rawgRequest('/games', {
    search: query,
    page_size: 12,
    search_precise: 'true',
  })
  return (data.results || []).map(normalizeRawgSearchResult)
}

export async function fetchRawgTrending() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - 540)
  const end = new Date(today)
  end.setDate(end.getDate() + 180)

  const data = await rawgRequest('/games', {
    page_size: 12,
    ordering: '-added',
    dates: `${start.toISOString().slice(0, 10)},${end.toISOString().slice(0, 10)}`,
  })

  return (data.results || []).map(normalizeRawgSearchResult)
}

export async function fetchRawgMedia(rawgId) {
  const media = {
    screenshots: [],
    trailers: [],
  }

  try {
    const screenshots = await rawgRequest(`/games/${rawgId}/screenshots`, { page_size: 8 })
    media.screenshots = (screenshots.results || [])
      .filter((item) => item.image)
      .map((item) => ({ id: item.id, image: item.image }))
  } catch {
    media.screenshots = []
  }

  try {
    const movies = await rawgRequest(`/games/${rawgId}/movies`, { page_size: 4 })
    media.trailers = (movies.results || [])
      .filter((item) => item.preview || item.data?.max || item.data?.['480'])
      .map((item) => ({
        id: item.id,
        name: item.name || 'Trailer',
        preview: item.preview,
        video: item.data?.max || item.data?.['480'] || '',
      }))
  } catch {
    media.trailers = []
  }

  return media
}

export async function fetchRawgDetail(rawgId) {
  const item = await rawgRequest(`/games/${rawgId}`)
  const media = await fetchRawgMedia(rawgId)
  return {
    ...normalizeRawgSearchResult(item),
    description: item.description_raw || item.description || '',
    website: item.website || '',
    developers: (item.developers || []).map((entry) => entry.name).filter(Boolean),
    publishers: (item.publishers || []).map((entry) => entry.name).filter(Boolean),
    stores: (item.stores || [])
      .filter((entry) => entry.store?.name)
      .map((entry) => ({
        name: entry.store.name,
        domain: entry.store.domain,
        url: entry.url || '',
      })),
    screenshots: media.screenshots,
    trailers: media.trailers,
  }
}

export async function steamGridRequest(path, params = {}) {
  if (!process.env.STEAMGRIDDB_API_KEY) {
    throw new Error('SteamGridDB API key is not configured.')
  }

  const url = new URL(`${STEAMGRIDDB_BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.STEAMGRIDDB_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`SteamGridDB returned HTTP ${response.status}.`)
  }

  return response.json()
}

function chooseSteamGridMatch(gameName, results) {
  const normalized = gameName.trim().toLowerCase()
  return (
    results.find((item) => item.name?.trim().toLowerCase() === normalized) ||
    results.find((item) => item.verified) ||
    results[0]
  )
}

function normalizeSteamGridAsset(item) {
  return {
    id: item.id,
    url: item.url,
    thumb: item.thumb,
    style: item.style,
    width: item.width,
    height: item.height,
  }
}

async function steamGridAssets(path, params = {}) {
  const data = await steamGridRequest(path, params)
  return (data.data || [])
    .filter((item) => item.url && !item.nsfw && !item.humor)
    .map(normalizeSteamGridAsset)
    .slice(0, 8)
}

function preferredSteamGridAsset(items) {
  return items.find((item) => item.style === 'official') || items[0] || null
}

export async function fetchSteamGridArtwork(gameName) {
  const search = await steamGridRequest(`/search/autocomplete/${encodeURIComponent(gameName)}`)
  if (!search.data?.length) {
    return {
      steamgriddb_id: null,
      assets: { poster: null, hero: null, logo: null },
    }
  }

  const match = chooseSteamGridMatch(gameName, search.data)
  const steamgriddbId = match.id
  const [posters, heroes, logos] = await Promise.all([
    steamGridAssets(`/grids/game/${steamgriddbId}`, { dimensions: '600x900' }),
    steamGridAssets(`/heroes/game/${steamgriddbId}`),
    steamGridAssets(`/logos/game/${steamgriddbId}`),
  ])

  return {
    steamgriddb_id: steamgriddbId,
    assets: {
      poster: preferredSteamGridAsset(posters),
      hero: preferredSteamGridAsset(heroes),
      logo: preferredSteamGridAsset(logos),
    },
    candidates: {
      posters,
      heroes,
      logos,
    },
  }
}

export function toSupabasePatch(payload) {
  const allowed = [
    'status',
    'play_platform',
    'overall_score',
    'graphics_score',
    'story_score',
    'gameplay_score',
    'immersion_score',
    'music_score',
    'experience_tags',
    'review',
  ]
  return Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)))
}
