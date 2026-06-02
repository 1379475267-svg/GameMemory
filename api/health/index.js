import { sendJson } from '../_utils.js'

export default function handler(request, response) {
  sendJson(response, 200, {
    status: 'ok',
    service: 'GameMemory Vercel API',
    rawg_api_key_configured: Boolean(process.env.RAWG_API_KEY),
    steamgriddb_api_key_configured: Boolean(process.env.STEAMGRIDDB_API_KEY),
    supabase_configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  })
}
