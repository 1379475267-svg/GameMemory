import { getSupabaseClient, normalizeGame, parseBody, sendJson, toSupabasePatch } from '../_utils.js'

export default async function handler(request, response) {
  try {
    const supabase = getSupabaseClient()
    const id = request.query.id

    if (request.method === 'GET') {
      const { data, error } = await supabase.from('games').select('*').eq('id', id).single()
      if (error) throw error
      return sendJson(response, 200, normalizeGame(data))
    }

    if (request.method === 'PATCH') {
      const body = await parseBody(request)
      const patch = toSupabasePatch(body)
      const { data, error } = await supabase
        .from('games')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return sendJson(response, 200, normalizeGame(data))
    }

    if (request.method === 'DELETE') {
      const { error } = await supabase.from('games').delete().eq('id', id)
      if (error) throw error
      response.status(204).end()
      return
    }

    return sendJson(response, 405, { detail: 'Method not allowed.' })
  } catch (error) {
    return sendJson(response, 500, { detail: error.message || 'Request failed.' })
  }
}
