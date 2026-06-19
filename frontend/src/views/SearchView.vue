<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSteamLibrary, fetchTrendingGames, importRawgGame, importSteamLibrary, searchRawgGames } from '../api/games'

const router = useRouter()
const query = ref('')
const steamId = ref('')
const steamLibrary = ref(null)
const selectedSteamAppids = ref([])
const results = ref([])
const trending = ref([])
const loading = ref(false)
const steamLoading = ref(false)
const steamImporting = ref(false)
const trendingLoading = ref(false)
const importingId = ref(null)
const importedGames = ref({})
const message = ref('')
const error = ref('')
const hasSearched = ref(false)

const displayGames = computed(() => (hasSearched.value ? results.value : trending.value))
const sectionTitle = computed(() => (hasSearched.value ? '搜索结果' : '近期热门'))
const sectionSubtitle = computed(() =>
  hasSearched.value ? `${results.value.length} 个匹配结果` : '近一年半发售与即将发售的高热度游戏',
)
const steamGames = computed(() => steamLibrary.value?.games || [])
const visibleSteamGames = computed(() => steamGames.value.slice(0, 80))
const steamTotalHours = computed(() => {
  const minutes = steamGames.value.reduce((sum, game) => sum + game.playtime_forever, 0)
  return formatHours(minutes)
})
const selectedSteamCount = computed(() => selectedSteamAppids.value.length)

function formatHours(minutes) {
  if (!minutes) return '0 小时'
  const hours = minutes / 60
  return `${hours >= 10 ? Math.round(hours) : hours.toFixed(1)} 小时`
}

function isSteamSelected(appid) {
  return selectedSteamAppids.value.includes(appid)
}

function toggleSteamGame(appid) {
  selectedSteamAppids.value = isSteamSelected(appid)
    ? selectedSteamAppids.value.filter((item) => item !== appid)
    : [...selectedSteamAppids.value, appid]
}

function selectAllVisibleSteamGames() {
  selectedSteamAppids.value = visibleSteamGames.value.map((game) => game.steam_appid)
}

function clearSteamSelection() {
  selectedSteamAppids.value = []
}

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
    importedGames.value = { ...importedGames.value, [rawgId]: game }
    message.value = `已导入 ${game.name}`
  } catch (err) {
    error.value = err.message
  } finally {
    importingId.value = null
  }
}

async function loadSteamLibrary() {
  const cleanSteamId = steamId.value.trim()
  if (!cleanSteamId) return
  steamLoading.value = true
  error.value = ''
  message.value = ''
  steamLibrary.value = null
  selectedSteamAppids.value = []
  try {
    steamLibrary.value = await fetchSteamLibrary(cleanSteamId)
    selectAllVisibleSteamGames()
  } catch (err) {
    error.value = err.message
  } finally {
    steamLoading.value = false
  }
}

async function importSelectedSteamGames() {
  if (!steamLibrary.value || !selectedSteamAppids.value.length) return
  steamImporting.value = true
  error.value = ''
  message.value = ''
  try {
    const result = await importSteamLibrary(steamLibrary.value.steam_id, selectedSteamAppids.value)
    message.value = `Steam 导入完成：新增 ${result.imported_count} 个，更新 ${result.updated_count} 个。`
  } catch (err) {
    error.value = err.message
  } finally {
    steamImporting.value = false
  }
}

function openImportedGame(rawgId) {
  const game = importedGames.value[rawgId]
  if (game?.id) router.push(`/games/${game.id}`)
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

  <section class="steam-import-panel">
    <div class="section-title">
      <div>
        <h2>Steam 库导入</h2>
        <p>输入 SteamID64，读取公开游戏库并导入总时长和近两周时长。</p>
      </div>
    </div>

    <form class="steam-import-form" @submit.prevent="loadSteamLibrary">
      <input v-model="steamId" inputmode="numeric" type="text" placeholder="SteamID64，例如 7656119..." />
      <button type="submit" :disabled="steamLoading">{{ steamLoading ? '读取中' : '读取 Steam 库' }}</button>
    </form>

    <div v-if="steamLibrary" class="steam-library">
      <div class="steam-summary">
        <span>{{ steamLibrary.total_count }} 个游戏</span>
        <span>总时长 {{ steamTotalHours }}</span>
        <span>已选择 {{ selectedSteamCount }} 个</span>
      </div>

      <div class="steam-actions">
        <button type="button" class="ghost-button" @click="selectAllVisibleSteamGames">选择前 {{ visibleSteamGames.length }} 个</button>
        <button type="button" class="ghost-button" @click="clearSteamSelection">清空选择</button>
        <button type="button" :disabled="steamImporting || !selectedSteamCount" @click="importSelectedSteamGames">
          {{ steamImporting ? '导入中' : '导入所选' }}
        </button>
      </div>

      <p v-if="steamGames.length > visibleSteamGames.length" class="muted-text">
        当前先显示按游玩时长排序的前 {{ visibleSteamGames.length }} 个游戏，避免一次加载过长列表。
      </p>

      <div class="steam-game-list">
        <label v-for="game in visibleSteamGames" :key="game.steam_appid" class="steam-game-row">
          <input
            type="checkbox"
            :checked="isSteamSelected(game.steam_appid)"
            @change="toggleSteamGame(game.steam_appid)"
          />
          <img :src="game.background_image" :alt="game.name" />
          <span>
            <strong>{{ game.name }}</strong>
            <small>
              总时长 {{ formatHours(game.playtime_forever) }}
              <template v-if="game.playtime_2weeks"> · 近两周 {{ formatHours(game.playtime_2weeks) }}</template>
            </small>
          </span>
        </label>
      </div>
    </div>
  </section>

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
        <button
          v-if="importedGames[game.rawg_id]"
          type="button"
          class="ghost-button"
          @click="openImportedGame(game.rawg_id)"
        >
          查看档案
        </button>
        <button v-else type="button" :disabled="importingId === game.rawg_id" @click="importGame(game.rawg_id)">
          {{ importingId === game.rawg_id ? '导入中' : '导入' }}
        </button>
      </article>
    </section>
  </section>
</template>
