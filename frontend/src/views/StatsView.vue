<script setup>
import { onMounted, ref } from 'vue'
import GameCard from '../components/GameCard.vue'
import { fetchStats } from '../api/games'

const stats = ref(null)
const loading = ref(false)
const error = ref('')

async function loadStats() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await fetchStats()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <section class="page-head">
    <div>
      <p class="eyebrow">Stats</p>
      <h1>统计</h1>
    </div>
  </section>

  <p v-if="error" class="notice error">{{ error }}</p>
  <p v-else-if="loading" class="notice">正在计算档案数据...</p>

  <section v-else-if="stats" class="stats-layout">
    <div class="stat-card">
      <span>游戏数量</span>
      <strong>{{ stats.total_games }}</strong>
    </div>
    <div class="stat-card">
      <span>已通关</span>
      <strong>{{ stats.completed_games }}</strong>
    </div>
    <div class="stat-card">
      <span>平均评分</span>
      <strong>{{ stats.average_score ? Number(stats.average_score).toFixed(1) : '-' }}</strong>
    </div>

    <div class="panel span-two">
      <h2>最常用标签</h2>
      <div class="tag-row large">
        <span v-for="item in stats.top_tags" :key="item.tag">{{ item.tag }} x {{ item.count }}</span>
      </div>
      <p v-if="!stats.top_tags.length" class="muted-text">暂无标签。</p>
    </div>

    <div class="panel">
      <h2>评分最高</h2>
      <GameCard v-if="stats.top_game" :game="stats.top_game" />
      <p v-else class="muted-text">暂无评分。</p>
    </div>
  </section>
</template>
