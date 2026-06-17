import { apiRequest } from './client'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export function fetchGameComments(gameId) {
  if (DEMO_MODE) return Promise.resolve([])
  return apiRequest(`/comments/?gameId=${encodeURIComponent(gameId)}`)
}

export function createGameComment(payload) {
  if (DEMO_MODE) {
    return Promise.resolve({
      id: crypto.randomUUID(),
      status: 'approved',
      created_at: new Date().toISOString(),
      ...payload,
    })
  }

  return apiRequest('/comments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function uploadCommentImage(payload) {
  if (DEMO_MODE) {
    return Promise.resolve({
      image_url: payload.data,
      image_path: '',
      file_name: payload.file_name,
    })
  }

  return apiRequest('/comments/upload-image/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
