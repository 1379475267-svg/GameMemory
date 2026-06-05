import { createGameComment, listGameComments } from '../lib/comments.js'

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function noContent() {
  return { statusCode: 204, body: '' }
}

function parseJsonBody(event) {
  if (!event.body) return {}
  return JSON.parse(event.body)
}

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return noContent()

    if (event.httpMethod === 'GET') {
      const comments = await listGameComments(event.queryStringParameters?.gameId)
      return json(200, comments)
    }

    if (event.httpMethod === 'POST') {
      const comment = await createGameComment(parseJsonBody(event))
      return json(201, comment)
    }

    return json(405, { detail: 'Method not allowed.' })
  } catch (error) {
    return json(error.statusCode || 500, { detail: error.message || 'Request failed.' })
  }
}
