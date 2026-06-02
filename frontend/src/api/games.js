import { apiRequest } from './client'

export function fetchGames(status = '') {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return apiRequest(`/games/${query}`)
}

export function fetchGame(id) {
  return apiRequest(`/games/${id}/`)
}

export function fetchGameMedia(id) {
  return apiRequest(`/games/${id}/media/`)
}

export function fetchGameArtwork(id) {
  return apiRequest(`/games/${id}/artwork/`)
}

export function updateGame(id, payload) {
  return apiRequest(`/games/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteGame(id) {
  return apiRequest(`/games/${id}/`, {
    method: 'DELETE',
  })
}

export function searchRawgGames(query) {
  return apiRequest(`/games/search/?q=${encodeURIComponent(query)}`)
}

export function fetchTrendingGames() {
  return apiRequest('/games/trending/')
}

export function importRawgGame(rawgId) {
  return apiRequest('/games/import_rawg/', {
    method: 'POST',
    body: JSON.stringify({ rawg_id: rawgId }),
  })
}

export function fetchStats() {
  return apiRequest('/stats/')
}
