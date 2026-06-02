<script setup>
import { onMounted, ref, watch } from 'vue'
import GameCard from '../components/GameCard.vue'
import StatusFilter from '../components/StatusFilter.vue'
import { fetchGames } from '../api/games'

const games = ref([])
const selectedStatus = ref('')
const loading = ref(false)
const error = ref('')

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
    <RouterLink class="primary-action" to="/search">导入游戏</RouterLink>
  </section>

  <StatusFilter v-model="selectedStatus" />

  <p v-if="error" class="notice error">{{ error }}</p>
  <p v-else-if="loading" class="notice">正在读取本地档案...</p>
  <p v-else-if="!games.length" class="notice">还没有游戏档案。</p>

  <section v-else class="game-grid">
    <GameCard v-for="game in games" :key="game.id" :game="game" />
  </section>
</template>
