<script setup>
import { statusLabel } from '../constants'

defineProps({
  game: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink class="game-card" :to="`/games/${game.id}`">
    <div class="cover-frame">
      <img v-if="game.background_image" :src="game.background_image" :alt="game.name" />
      <div v-else class="cover-placeholder">NO COVER</div>
      <span class="status-badge">{{ statusLabel(game.status) }}</span>
    </div>
    <div class="card-body">
      <h3>{{ game.name }}</h3>
      <p>{{ game.released || '未知发售日' }}</p>
      <div class="tag-row">
        <span v-for="genre in game.genres.slice(0, 3)" :key="genre">{{ genre }}</span>
      </div>
      <div class="score-line">
        <strong>{{ game.overall_score || '-' }}</strong>
        <small>我的评分</small>
      </div>
    </div>
  </RouterLink>
</template>
