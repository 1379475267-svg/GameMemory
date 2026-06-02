import { getSupabaseClient, normalizeGame, sendJson } from '../_utils.js'

export default async function handler(request, response) {
  try {
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

    return sendJson(response, 200, {
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
  } catch (error) {
    return sendJson(response, 500, { detail: error.message || 'Stats request failed.' })
  }
}
