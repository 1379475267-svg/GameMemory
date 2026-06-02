import { fetchRawgDetail, getSupabaseClient, normalizeGame, parseBody, sendJson } from '../../_utils.js'

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

export default async function handler(request, response) {
  try {
    if (request.method !== 'POST') {
      return sendJson(response, 405, { detail: 'Method not allowed.' })
    }

    const body = await parseBody(request)
    const rawgId = Number(body.rawg_id)
    if (!rawgId) {
      return sendJson(response, 400, { detail: 'rawg_id is required.' })
    }

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
      return sendJson(response, 200, normalizeGame(data))
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

    return sendJson(response, 201, normalizeGame(data))
  } catch (error) {
    return sendJson(response, 502, { detail: error.message || 'Import failed.' })
  }
}
