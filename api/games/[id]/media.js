import { fetchRawgDetail, fetchRawgMedia, getSupabaseClient, sendJson } from '../../_utils.js'

export default async function handler(request, response) {
  try {
    const supabase = getSupabaseClient()
    const id = request.query.id
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
      return sendJson(response, 200, mediaPayload(updated.data))
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
      return sendJson(response, 200, mediaPayload(updated.data))
    }

    return sendJson(response, 200, mediaPayload(game))
  } catch (error) {
    return sendJson(response, 502, { detail: error.message || 'Media request failed.' })
  }
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
