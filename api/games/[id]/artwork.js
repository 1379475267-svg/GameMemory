import { fetchSteamGridArtwork, getSupabaseClient, sendJson } from '../../_utils.js'

export default async function handler(request, response) {
  try {
    const supabase = getSupabaseClient()
    const id = request.query.id
    const existing = await supabase.from('games').select('*').eq('id', id).single()
    if (existing.error) throw existing.error

    const game = existing.data
    if (game.steamgrid_assets && Object.keys(game.steamgrid_assets).length) {
      return sendJson(response, 200, {
        steamgriddb_id: game.steamgriddb_id,
        assets: game.steamgrid_assets,
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

    return sendJson(response, 200, {
      steamgriddb_id: updated.data.steamgriddb_id,
      assets: updated.data.steamgrid_assets || {},
    })
  } catch (error) {
    return sendJson(response, 502, { detail: error.message || 'Artwork request failed.' })
  }
}
