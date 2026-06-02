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

export function fetchGames(status = '') {
  if (DEMO_MODE) return demoFetchGames(status)
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return apiRequest(`/games/${query}`)
}

export function fetchGame(id) {
  if (DEMO_MODE) return demoFetchGame(id)
  return apiRequest(`/games/${id}/`)
}

export function fetchGameMedia(id) {
  if (DEMO_MODE) return demoFetchGameMedia(id)
  return apiRequest(`/games/${id}/media/`)
}

export function fetchGameArtwork(id) {
  if (DEMO_MODE) return demoFetchGameArtwork(id)
  return apiRequest(`/games/${id}/artwork/`)
}

export function updateGame(id, payload) {
  if (DEMO_MODE) return demoUpdateGame(id, payload)
  return apiRequest(`/games/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteGame(id) {
  if (DEMO_MODE) return demoDeleteGame(id)
  return apiRequest(`/games/${id}/`, {
    method: 'DELETE',
  })
}

export function searchRawgGames(query) {
  if (DEMO_MODE) return demoSearchRawgGames(query)
  return apiRequest(`/games/search/?q=${encodeURIComponent(query)}`)
}

export function fetchTrendingGames() {
  if (DEMO_MODE) return demoFetchTrendingGames()
  return apiRequest('/games/trending/')
}

export function importRawgGame(rawgId) {
  if (DEMO_MODE) return demoImportRawgGame(rawgId)
  return apiRequest('/games/import_rawg/', {
    method: 'POST',
    body: JSON.stringify({ rawg_id: rawgId }),
  })
}

export function fetchStats() {
  if (DEMO_MODE) return demoFetchStats()
  return apiRequest('/stats/')
}
