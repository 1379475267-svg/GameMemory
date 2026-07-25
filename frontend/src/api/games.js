import { apiRequest } from './client'
import {
  demoDeleteGame,
  demoFetchGame,
  demoFetchGameArtwork,
  demoFetchGameMedia,
  demoFetchGames,
  demoFetchStats,
  demoFetchTrendingGames,
  demoImportRawgGame,
  demoSearchRawgGames,
  demoUpdateGame,
} from './demoData'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
let runtimeDemoMode = DEMO_MODE

async function withDemoFallback(remoteRequest, demoRequest) {
  if (runtimeDemoMode) return demoRequest()

  try {
    return await remoteRequest()
  } catch (error) {
    // Keep the portfolio demo usable when the hosted database or API is
    // temporarily unavailable. Once a request fails, use one consistent local
    // data source for the rest of the session instead of mixing remote and
    // local records.
    runtimeDemoMode = true
    console.warn('GameMemory API unavailable; switched to local demo data.', error)
    return demoRequest()
  }
}

export function fetchGames(status = '') {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return withDemoFallback(
    () => apiRequest(`/games/${query}`),
    () => demoFetchGames(status),
  )
}

export function fetchGame(id) {
  return withDemoFallback(() => apiRequest(`/games/${id}/`), () => demoFetchGame(id))
}

export function fetchGameMedia(id) {
  return withDemoFallback(() => apiRequest(`/games/${id}/media/`), () => demoFetchGameMedia(id))
}

export function fetchGameArtwork(id) {
  return withDemoFallback(() => apiRequest(`/games/${id}/artwork/`), () => demoFetchGameArtwork(id))
}

export function updateGameArtwork(id, assets) {
  return withDemoFallback(
    () => apiRequest(`/games/${id}/artwork/`, {
      method: 'PATCH',
      body: JSON.stringify({ assets }),
    }),
    () => Promise.resolve({ assets, candidates: {} }),
  )
}

export function updateGame(id, payload) {
  return withDemoFallback(
    () => apiRequest(`/games/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
    () => demoUpdateGame(id, payload),
  )
}

export function deleteGame(id) {
  return withDemoFallback(
    () => apiRequest(`/games/${id}/`, { method: 'DELETE' }),
    () => demoDeleteGame(id),
  )
}

export function searchRawgGames(query) {
  return withDemoFallback(
    () => apiRequest(`/games/search/?q=${encodeURIComponent(query)}`),
    () => demoSearchRawgGames(query),
  )
}

export function fetchTrendingGames() {
  return withDemoFallback(() => apiRequest('/games/trending/'), () => demoFetchTrendingGames())
}

export function importRawgGame(rawgId) {
  return withDemoFallback(
    () => apiRequest('/games/import_rawg/', {
      method: 'POST',
      body: JSON.stringify({ rawg_id: rawgId }),
    }),
    () => demoImportRawgGame(rawgId),
  )
}

export function fetchSteamLibrary(steamId) {
  return withDemoFallback(
    () => apiRequest(`/steam/library/?steamId=${encodeURIComponent(steamId)}`),
    () => Promise.resolve({
      steam_id: steamId,
      total_count: 0,
      games: [],
    }),
  )
}

export function importSteamLibrary(steamId, appids = []) {
  return withDemoFallback(
    () => apiRequest('/steam/import/', {
      method: 'POST',
      body: JSON.stringify({ steam_id: steamId, appids }),
    }),
    () => Promise.resolve({
      imported_count: 0,
      updated_count: 0,
      games: [],
    }),
  )
}

export function fetchStats() {
  return withDemoFallback(() => apiRequest('/stats/'), () => demoFetchStats())
}
