import { fetchRawgSearch, sendJson } from '../../_utils.js'

export default async function handler(request, response) {
  try {
    const query = (request.query.q || '').trim()
    if (!query) {
      return sendJson(response, 400, { detail: 'Search query is required.' })
    }
    return sendJson(response, 200, await fetchRawgSearch(query))
  } catch (error) {
    return sendJson(response, 502, { detail: error.message || 'RAWG search failed.' })
  }
}
