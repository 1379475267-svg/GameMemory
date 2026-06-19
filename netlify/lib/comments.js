import { getSupabaseClient } from '../../api/_utils.js'
import { randomUUID } from 'node:crypto'

const COMMENT_FIELDS = 'id, game_id, rawg_id, nickname, content, image_url, rating, status, created_at'
const COMMENT_IMAGE_BUCKET = 'comment-images'
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const COMMENT_WINDOW_MS = 10 * 60 * 1000
const COMMENT_LIMIT = 5
const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])
const commentAttempts = new Map()

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
    image_url: row.image_url || '',
    rating: row.rating,
    status: row.status,
    created_at: row.created_at,
  }
}

function normalizeIncomingComment(payload) {
  if (String(payload.website || '').trim()) throw fail(400, 'Comment could not be submitted.')

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

  const imageUrl = String(payload.image_url || '').trim()
  const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/$/, '')
  if (imageUrl && !imageUrl.startsWith(`${supabaseUrl}/storage/v1/object/public/${COMMENT_IMAGE_BUCKET}/`)) {
    throw fail(400, 'image_url is invalid.')
  }

  const status = process.env.COMMENT_MODERATION_MODE === 'manual' ? 'pending' : 'approved'

  return {
    game_id: gameId,
    rawg_id: rawgId,
    nickname,
    content,
    image_url: imageUrl,
    rating,
    status,
  }
}

function checkCommentRateLimit(clientKey) {
  if (!clientKey) return

  const now = Date.now()
  const recent = (commentAttempts.get(clientKey) || []).filter((time) => now - time < COMMENT_WINDOW_MS)
  if (recent.length >= COMMENT_LIMIT) {
    throw fail(429, '留言太频繁了，请稍后再试。')
  }

  recent.push(now)
  commentAttempts.set(clientKey, recent)
}

function parseImagePayload(payload) {
  const gameId = String(payload.game_id || '').trim()
  const fileName = String(payload.file_name || 'memory-wall-image').trim()
  const contentType = String(payload.content_type || '').trim().toLowerCase()
  const data = String(payload.data || '').trim()

  if (!gameId) throw fail(400, 'game_id is required.')
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw fail(400, 'Only JPG, PNG, and WebP images are supported.')
  }
  if (!data) throw fail(400, 'Image data is required.')

  const base64 = data.includes(',') ? data.split(',').pop() : data
  const buffer = Buffer.from(base64, 'base64')
  if (!buffer.length) throw fail(400, 'Image data is invalid.')
  if (buffer.length > MAX_IMAGE_BYTES) throw fail(400, 'Image must be 2MB or smaller.')

  return {
    gameId,
    fileName,
    contentType,
    buffer,
    extension: ALLOWED_IMAGE_TYPES.get(contentType),
  }
}

async function ensureCommentImageBucket(supabase) {
  const { data, error } = await supabase.storage.listBuckets()
  if (error) throw error

  if (data.some((bucket) => bucket.name === COMMENT_IMAGE_BUCKET)) return

  const created = await supabase.storage.createBucket(COMMENT_IMAGE_BUCKET, {
    public: true,
    allowedMimeTypes: [...ALLOWED_IMAGE_TYPES.keys()],
    fileSizeLimit: MAX_IMAGE_BYTES,
  })
  if (created.error) throw created.error
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

export async function createGameComment(payload, context = {}) {
  checkCommentRateLimit(`${context.clientIp || 'anonymous'}:${payload?.game_id || ''}`)
  const comment = normalizeIncomingComment(payload || {})
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('game_comments').insert(comment).select(COMMENT_FIELDS).single()

  if (error) throw error
  return normalizeComment(data)
}

export async function uploadCommentImage(payload) {
  const image = parseImagePayload(payload || {})
  const supabase = getSupabaseClient()
  await ensureCommentImageBucket(supabase)

  const safeGameId = image.gameId.replace(/[^a-zA-Z0-9_-]/g, '-')
  const path = `${safeGameId}/${Date.now()}-${randomUUID()}.${image.extension}`
  const { error } = await supabase.storage.from(COMMENT_IMAGE_BUCKET).upload(path, image.buffer, {
    contentType: image.contentType,
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(COMMENT_IMAGE_BUCKET).getPublicUrl(path)
  return {
    image_url: data.publicUrl,
    image_path: path,
    file_name: image.fileName,
  }
}
