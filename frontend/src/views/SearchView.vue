<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchTrendingGames, importRawgGame, searchRawgGames } from '../api/games'

const query = ref('')
const results = ref([])
const trending = ref([])
const loading = ref(false)
const trendingLoading = ref(false)
const importingId = ref(null)
const message = ref('')
const error = ref('')
const hasSearched = ref(false)

const displayGames = computed(() => (hasSearched.value ? results.value : trending.value))
const sectionTitle = computed(() => (hasSearched.value ? '搜索结果' : '近期热门'))
const sectionSubtitle = computed(() =>
  hasSearched.value ? `${results.value.length} 个匹配结果` : '近一年半发售与即将发售的高热度游戏',
)

async function loadTrending() {
  trendingLoading.value = true
  error.value = ''
  try {
    trending.value = await fetchTrendingGames()
  } catch (err) {
    error.value = err.message
  } finally {
    trendingLoading.value = false
  }
}

async function search() {
  const text = query.value.trim()
  if (!text) return
  loading.value = true
  error.value = ''
  message.value = ''
  hasSearched.value = true
  try {
    results.value = await searchRawgGames(text)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function importGame(rawgId) {
  importingId.value = rawgId
  error.value = ''
  message.value = ''
  try {
    const game = await importRawgGame(rawgId)
    message.value = `已导入 ${game.name}`
  } catch (err) {
    error.value = err.message
  } finally {
    importingId.value = null
  }
}

onMounted(loadTrending)
</script>

<template>
  <section class="page-head">
    <div>
      <p class="eyebrow">RAWG Search</p>
      <h1>搜索并导入</h1>
    </div>
  </section>

  <form class="search-bar" @submit.prevent="search">
    <input v-model="query" type="search" placeholder="输入游戏名，例如 Elden Ring" />
    <button type="submit" :disabled="loading">{{ loading ? '搜索中' : '搜索' }}</button>
  </form>

  <p v-if="error" class="notice error">{{ error }}</p>
  <p v-if="message" class="notice success">{{ message }}</p>

  <section class="discover-panel">
    <div class="section-title">
      <div>
        <h2>{{ sectionTitle }}</h2>
        <p>{{ sectionSubtitle }}</p>
      </div>
      <button v-if="hasSearched" type="button" class="ghost-button" @click="hasSearched = false">
        看热门
      </button>
    </div>

    <p v-if="trendingLoading && !hasSearched" class="notice">正在整理近期热门游戏...</p>
    <p v-else-if="!displayGames.length" class="notice">暂无可展示的游戏。</p>

    <section v-else class="search-results">
      <article v-for="game in displayGames" :key="game.rawg_id" class="result-card">
        <img v-if="game.background_image" :src="game.background_image" :alt="game.name" />
        <div v-else class="result-placeholder">NO COVER</div>
        <div class="result-info">
          <h2>{{ game.name }}</h2>
          <p>{{ game.released || '未知发售日' }}</p>
          <div class="tag-row">
            <span v-for="platform in game.platforms.slice(0, 4)" :key="platform">{{ platform }}</span>
          </div>
          <div class="tag-row muted">
            <span v-for="genre in game.genres.slice(0, 4)" :key="genre">{{ genre }}</span>
          </div>
        </div>
        <button type="button" :disabled="importingId === game.rawg_id" @click="importGame(game.rawg_id)">
          {{ importingId === game.rawg_id ? '导入中' : '导入' }}
        </button>
      </article>
    </section>
  </section>
</template>
