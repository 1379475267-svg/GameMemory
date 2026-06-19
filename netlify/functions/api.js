import {
  fetchRawgDetail,
  fetchRawgMedia,
  fetchRawgSearch,
  fetchRawgTrending,
  fetchSteamGridArtwork,
  getSupabaseClient,
  normalizeGame,
  toSupabasePatch,
} from '../../api/_utils.js'
import { createGameComment, listGameComments, uploadCommentImage } from '../lib/comments.js'

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

function clientIp(event) {
  const headers = event.headers || {}
  return headers['client-ip'] || headers['x-forwarded-for']?.split(',')[0]?.trim() || ''
}

function mediaPayload(game) {
  return {
    screenshots: game.screenshots || [],
    trailers: game.trailers || [],
    stores: game.stores || [],
    developers: game.developers || [],
    publishers: game.publishers || [],
    website: game.website || '',
  }
}

const OFFICIAL_FIELDS = [
  'name',
  'slug',
  'background_image',
  'description',
  'released',
  'metacritic',
  'platforms',
  'genres',
  'rawg_rating',
  'website',
  'developers',
  'publishers',
  'stores',
  'screenshots',
  'trailers',
]

export async function handler(event) {
  const method = event.httpMethod
  const path = event.path.replace(/^\/(?:\.netlify\/functions\/api|api)\/?/, '').replace(/\/$/, '')
  const parts = path ? path.split('/') : []

  try {
    if (method === 'OPTIONS') return noContent()

    if (parts[0] === 'health') {
      return json(200, {
        status: 'ok',
        service: 'GameMemory Netlify API',
        rawg_api_key_configured: Boolean(process.env.RAWG_API_KEY),
        steamgriddb_api_key_configured: Boolean(process.env.STEAMGRIDDB_API_KEY),
        supabase_configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      })
    }

    if (parts[0] === 'games' && parts[1] === 'search') {
      const query = (event.queryStringParameters?.q || '').trim()
      if (!query) return json(400, { detail: 'Search query is required.' })
      return json(200, await fetchRawgSearch(query))
    }

    if (parts[0] === 'games' && parts[1] === 'trending') {
      return json(200, await fetchRawgTrending())
    }

    if (parts[0] === 'comments') {
      if (parts[1] === 'upload-image') {
        if (method !== 'POST') return json(405, { detail: 'Method not allowed.' })
        return json(201, await uploadCommentImage(parseJsonBody(event)))
      }

      if (method === 'GET') {
        return json(200, await listGameComments(event.queryStringParameters?.gameId))
      }

      if (method === 'POST') {
        return json(201, await createGameComment(parseJsonBody(event), { clientIp: clientIp(event) }))
      }

      return json(405, { detail: 'Method not allowed.' })
    }

    if (parts[0] === 'games' && parts[1] === 'import_rawg') {
      if (method !== 'POST') return json(405, { detail: 'Method not allowed.' })

      const body = parseJsonBody(event)
      const rawgId = Number(body.rawg_id)
      if (!rawgId) return json(400, { detail: 'rawg_id is required.' })

      const supabase = getSupabaseClient()
      const gameData = await fetchRawgDetail(rawgId)
      const existing = await supabase.from('games').select('*').eq('rawg_id', rawgId).maybeSingle()
      if (existing.error) throw existing.error

      if (existing.data) {
        const officialPatch = Object.fromEntries(OFFICIAL_FIELDS.map((field) => [field, gameData[field] ?? null]))
        const { data, error } = await supabase
          .from('games')
          .update({ ...officialPatch, updated_at: new Date().toISOString() })
          .eq('id', existing.data.id)
          .select('*')
          .single()
        if (error) throw error
        return json(200, normalizeGame(data))
      }

      const { data, error } = await supabase
        .from('games')
        .insert({
          ...gameData,
          rawg_id: rawgId,
          status: 'backlog',
          platforms: gameData.platforms || [],
          genres: gameData.genres || [],
        })
        .select('*')
        .single()
      if (error) throw error
      return json(201, normalizeGame(data))
    }

    if (parts[0] === 'games' && parts.length === 1) {
      const supabase = getSupabaseClient()

      if (method === 'GET') {
        const status = event.queryStringParameters?.status
        let query = supabase.from('games').select('*').order('updated_at', { ascending: false })
        if (status) query = query.eq('status', status)
        const { data, error } = await query
        if (error) throw error
        return json(200, data.map(normalizeGame))
      }

      if (method === 'POST') {
        const body = parseJsonBody(event)
        const { data, error } = await supabase.from('games').insert(body).select('*').single()
        if (error) throw error
        return json(201, normalizeGame(data))
      }

      return json(405, { detail: 'Method not allowed.' })
    }

    if (parts[0] === 'games' && parts[1]) {
      const supabase = getSupabaseClient()
      const id = parts[1]

      if (parts[2] === 'media') {
        const existing = await supabase.from('games').select('*').eq('id', id).single()
        if (existing.error) throw existing.error

        const game = existing.data
        const needsOfficial = !(game.developers?.length || game.publishers?.length || game.stores?.length || game.website)
        const needsVisual = !(game.screenshots?.length || game.trailers?.length)

        if (needsOfficial) {
          const detail = await fetchRawgDetail(game.rawg_id)
          const patch = {
            website: detail.website || '',
            developers: detail.developers || [],
            publishers: detail.publishers || [],
            stores: detail.stores || [],
            screenshots: detail.screenshots || [],
            trailers: detail.trailers || [],
            updated_at: new Date().toISOString(),
          }
          const updated = await supabase.from('games').update(patch).eq('id', id).select('*').single()
          if (updated.error) throw updated.error
          return json(200, mediaPayload(updated.data))
        }

        if (needsVisual) {
          const media = await fetchRawgMedia(game.rawg_id)
          const updated = await supabase
            .from('games')
            .update({ ...media, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('*')
            .single()
          if (updated.error) throw updated.error
          return json(200, mediaPayload(updated.data))
        }

        return json(200, mediaPayload(game))
      }

      if (parts[2] === 'artwork') {
        const existing = await supabase.from('games').select('*').eq('id', id).single()
        if (existing.error) throw existing.error

        const game = existing.data
        if (method === 'PATCH') {
          const body = parseJsonBody(event)
          const assets = body.assets || {}
          const selectedAssets = {
            poster: assets.poster || null,
            hero: assets.hero || null,
            logo: assets.logo || null,
          }
          const updated = await supabase
            .from('games')
            .update({ steamgrid_assets: selectedAssets, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('*')
            .single()
          if (updated.error) throw updated.error
          return json(200, {
            steamgriddb_id: updated.data.steamgriddb_id,
            assets: updated.data.steamgrid_assets || {},
            candidates: {},
          })
        }

        if (method !== 'GET') return json(405, { detail: 'Method not allowed.' })

        if (game.steamgrid_assets && Object.keys(game.steamgrid_assets).length) {
          const freshArtwork = await fetchSteamGridArtwork(game.name).catch(() => ({ candidates: {} }))
          return json(200, {
            steamgriddb_id: game.steamgriddb_id,
            assets: game.steamgrid_assets,
            candidates: freshArtwork.candidates || {},
          })
        }

        const artwork = await fetchSteamGridArtwork(game.name)
        const updated = await supabase
          .from('games')
          .update({
            steamgriddb_id: artwork.steamgriddb_id,
            steamgrid_assets: artwork.assets,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select('*')
          .single()
        if (updated.error) throw updated.error

        return json(200, {
          steamgriddb_id: updated.data.steamgriddb_id,
          assets: updated.data.steamgrid_assets || {},
          candidates: artwork.candidates || {},
        })
      }

      if (method === 'GET') {
        const { data, error } = await supabase.from('games').select('*').eq('id', id).single()
        if (error) throw error
        return json(200, normalizeGame(data))
      }

      if (method === 'PATCH') {
        const body = parseJsonBody(event)
        const patch = toSupabasePatch(body)
        const { data, error } = await supabase
          .from('games')
          .update({ ...patch, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select('*')
          .single()
        if (error) throw error
        return json(200, normalizeGame(data))
      }

      if (method === 'DELETE') {
        const { error } = await supabase.from('games').delete().eq('id', id)
        if (error) throw error
        return noContent()
      }

      return json(405, { detail: 'Method not allowed.' })
    }

    if (parts[0] === 'stats') {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from('games').select('*')
      if (error) throw error

      const scored = data.filter((game) => game.overall_score)
      const tagCounts = new Map()
      data.forEach((game) => {
        ;(game.experience_tags || []).forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        })
      })
      const topGame = [...scored].sort((a, b) => b.overall_score - a.overall_score || a.name.localeCompare(b.name))[0]

      return json(200, {
        total_games: data.length,
        completed_games: data.filter((game) => game.status === 'completed').length,
        average_score: scored.length
          ? scored.reduce((sum, game) => sum + Number(game.overall_score), 0) / scored.length
          : null,
        top_tags: [...tagCounts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([tag, count]) => ({ tag, count })),
        top_game: topGame ? normalizeGame(topGame) : null,
      })
    }

    return json(404, { detail: 'API route not found.' })
  } catch (error) {
    if (error.statusCode) {
      return json(error.statusCode, { detail: error.message || 'Request failed.' })
    }

    const isImportOrExternal =
      parts[0] === 'games' && ['search', 'trending', 'import_rawg'].includes(parts[1]) || parts[2] === 'media' || parts[2] === 'artwork'
    return json(isImportOrExternal ? 502 : 500, {
      detail: isImportOrExternal ? '外部游戏资料暂时不可用，请稍后再试。' : '服务暂时不可用，请稍后再试。',
    })
  }
}
