import { getSupabaseClient } from '../../api/_utils.js'

const COMMENT_FIELDS = 'id, game_id, rawg_id, nickname, content, rating, status, created_at'

function fail(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function textLength(value) {
  return [...value].length
}

function normalizeComment(row) {
  return {
    id: row.id,
    game_id: row.game_id,
    rawg_id: row.rawg_id,
    nickname: row.nickname,
    content: row.content,
    rating: row.rating,
    status: row.status,
    created_at: row.created_at,
  }
}

function normalizeIncomingComment(payload) {
  const gameId = String(payload.game_id || '').trim()
  const nickname = String(payload.nickname || '').trim()
  const content = String(payload.content || '').trim()

  if (!gameId) throw fail(400, 'game_id is required.')
  if (!nickname) throw fail(400, 'nickname is required.')
  if (textLength(nickname) > 20) throw fail(400, 'nickname must be 20 characters or fewer.')
  if (!content) throw fail(400, 'content is required.')
  if (textLength(content) > 300) throw fail(400, 'content must be 300 characters or fewer.')

  const rawgId =
    payload.rawg_id === undefined || payload.rawg_id === null || payload.rawg_id === ''
      ? null
      : Number(payload.rawg_id)
  if (rawgId !== null && !Number.isInteger(rawgId)) throw fail(400, 'rawg_id must be an integer.')

  const rating =
    payload.rating === undefined || payload.rating === null || payload.rating === '' ? null : Number(payload.rating)
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 10)) {
    throw fail(400, 'rating must be an integer from 1 to 10.')
  }

  return {
    game_id: gameId,
    rawg_id: rawgId,
    nickname,
    content,
    rating,
    status: 'approved',
  }
}

export async function listGameComments(gameId) {
  const cleanGameId = String(gameId || '').trim()
  if (!cleanGameId) throw fail(400, 'gameId is required.')

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('game_comments')
    .select(COMMENT_FIELDS)
    .eq('game_id', cleanGameId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(normalizeComment)
}

export async function createGameComment(payload) {
  const comment = normalizeIncomingComment(payload || {})
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('game_comments').insert(comment).select(COMMENT_FIELDS).single()

  if (error) throw error
  return normalizeComment(data)
}
