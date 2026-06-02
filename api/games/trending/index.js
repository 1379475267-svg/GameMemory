import { fetchRawgTrending, sendJson } from '../../_utils.js'

export default async function handler(request, response) {
  try {
    return sendJson(response, 200, await fetchRawgTrending())
  } catch (error) {
    return sendJson(response, 502, { detail: error.message || 'RAWG trending request failed.' })
  }
}
