import { getSupabaseClient, normalizeGame, parseBody, sendJson } from '../_utils.js'

export default async function handler(request, response) {
  try {
    const supabase = getSupabaseClient()

    if (request.method === 'GET') {
      const status = request.query.status
      let query = supabase.from('games').select('*').order('updated_at', { ascending: false })
      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return sendJson(response, 200, data.map(normalizeGame))
    }

    if (request.method === 'POST') {
      const body = await parseBody(request)
      const { data, error } = await supabase.from('games').insert(body).select('*').single()
      if (error) throw error
      return sendJson(response, 201, normalizeGame(data))
    }

    return sendJson(response, 405, { detail: 'Method not allowed.' })
  } catch (error) {
    return sendJson(response, 500, { detail: error.message || 'Request failed.' })
  }
}
