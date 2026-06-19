<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import GameCard from '../components/GameCard.vue'
import StatusFilter from '../components/StatusFilter.vue'
import { fetchGames } from '../api/games'

const games = ref([])
const selectedStatus = ref('')
const searchText = ref('')
const selectedTag = ref('')
const sortBy = ref('steam-playtime')
const loading = ref(false)
const error = ref('')

function exportFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function exportJson() {
  const payload = {
    exported_at: new Date().toISOString(),
    count: filteredGames.value.length,
    games: filteredGames.value,
  }
  exportFile('gamememory-library.json', JSON.stringify(payload, null, 2), 'application/json')
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(' / ') : value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

function exportCsv() {
  const columns = [
    ['name', '名称'],
    ['status', '状态'],
    ['released', '发售日'],
    ['overall_score', '总评分'],
    ['play_platform', '游玩平台'],
    ['steam_appid', 'Steam AppID'],
    ['steam_playtime_forever', 'Steam 总时长(分钟)'],
    ['steam_playtime_2weeks', 'Steam 近两周(分钟)'],
    ['platforms', '平台'],
    ['genres', '类型'],
    ['experience_tags', '体验标签'],
    ['review', '评价'],
  ]
  const rows = filteredGames.value.map((game) => columns.map(([key]) => csvCell(game[key])).join(','))
  const csv = [columns.map(([, label]) => csvCell(label)).join(','), ...rows].join('\n')
  exportFile('gamememory-library.csv', `\ufeff${csv}`, 'text/csv;charset=utf-8')
}

const allTags = computed(() => {
  const tags = games.value.flatMap((game) => game.experience_tags || [])
  return [...new Set(tags)].sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

const filteredGames = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  const tag = selectedTag.value
  const items = games.value.filter((game) => {
    const matchesKeyword =
      !keyword ||
      game.name?.toLowerCase().includes(keyword) ||
      (game.genres || []).some((genre) => genre.toLowerCase().includes(keyword)) ||
      (game.platforms || []).some((platform) => platform.toLowerCase().includes(keyword))
    const matchesTag = !tag || (game.experience_tags || []).includes(tag)
    return matchesKeyword && matchesTag
  })

  return [...items].sort((a, b) => {
    if (sortBy.value === 'steam-playtime') {
      return (b.steam_playtime_forever || 0) - (a.steam_playtime_forever || 0) || a.name.localeCompare(b.name, 'zh-CN')
    }
    if (sortBy.value === 'score') return (b.overall_score || 0) - (a.overall_score || 0) || a.name.localeCompare(b.name)
    if (sortBy.value === 'released') return String(b.released || '').localeCompare(String(a.released || ''))
    if (sortBy.value === 'name') return a.name.localeCompare(b.name, 'zh-CN')
    return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)
  })
})

async function loadGames() {
  loading.value = true
  error.value = ''
  try {
    games.value = await fetchGames(selectedStatus.value)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadGames)
watch(selectedStatus, loadGames)
</script>

<template>
  <section class="page-head">
    <div>
      <p class="eyebrow">Library</p>
      <h1>我的游戏库</h1>
    </div>
    <div class="page-actions">
      <button type="button" class="ghost-button" :disabled="!filteredGames.length" @click="exportJson">导出 JSON</button>
      <button type="button" class="ghost-button" :disabled="!filteredGames.length" @click="exportCsv">导出 CSV</button>
      <RouterLink class="primary-action" to="/search">导入游戏</RouterLink>
    </div>
  </section>

  <StatusFilter v-model="selectedStatus" />

  <section class="library-tools">
    <input v-model="searchText" type="search" placeholder="搜索游戏名、平台或类型" />
    <select v-model="selectedTag">
      <option value="">全部标签</option>
      <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
    </select>
    <select v-model="sortBy">
      <option value="steam-playtime">Steam 时长最高</option>
      <option value="updated">最近更新</option>
      <option value="score">评分最高</option>
      <option value="released">发售时间</option>
      <option value="name">名称排序</option>
    </select>
  </section>

  <p v-if="error" class="notice error">{{ error }}</p>
  <p v-else-if="loading" class="notice">正在读取本地档案...</p>
  <p v-else-if="!games.length" class="notice">还没有游戏档案，先去导入一款游戏吧。</p>
  <p v-else-if="!filteredGames.length" class="notice">没有匹配的游戏，换个关键词或标签试试。</p>

  <section v-else class="game-grid">
    <GameCard v-for="game in filteredGames" :key="game.id" :game="game" />
  </section>
</template>
