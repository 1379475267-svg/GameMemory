<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteGame, fetchGame, fetchGameArtwork, fetchGameMedia, updateGame, updateGameArtwork } from '../api/games'
import GameComments from '../components/GameComments.vue'
import RatingEditor from '../components/RatingEditor.vue'
import TagEditor from '../components/TagEditor.vue'
import { editableStatusOptions, scoreFields, statusLabel } from '../constants'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const game = ref(null)
const media = ref(null)
const artwork = ref(null)
const form = ref(null)
const loading = ref(false)
const mediaLoading = ref(false)
const saving = ref(false)
const savingArtwork = ref(false)
const error = ref('')
const mediaError = ref('')
const artworkMessage = ref('')
const message = ref('')

const heroImage = computed(() => {
  return artwork.value?.assets?.hero?.url || media.value?.screenshots?.[0]?.image || game.value?.background_image || ''
})

const posterImage = computed(() => {
  return artwork.value?.assets?.poster?.url || game.value?.background_image || ''
})

const logoImage = computed(() => {
  return artwork.value?.assets?.logo?.url || ''
})

const scoreModel = computed({
  get() {
    return scoreFields.reduce((result, field) => {
      result[field.key] = form.value?.[field.key] ?? null
      return result
    }, {})
  },
  set(value) {
    form.value = { ...form.value, ...value }
  },
})

async function loadGame() {
  loading.value = true
  error.value = ''
  try {
    game.value = await fetchGame(props.id)
    form.value = {
      status: game.value.status,
      play_platform: game.value.play_platform || '',
      overall_score: game.value.overall_score,
      graphics_score: game.value.graphics_score,
      story_score: game.value.story_score,
      gameplay_score: game.value.gameplay_score,
      immersion_score: game.value.immersion_score,
      music_score: game.value.music_score,
      experience_tags: game.value.experience_tags || [],
      review: game.value.review || '',
    }
    await Promise.all([loadMedia(), loadArtwork()])
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function loadArtwork() {
  try {
    artwork.value = await fetchGameArtwork(props.id)
  } catch {
    artwork.value = {
      assets: game.value?.steamgrid_assets || {},
      candidates: {},
    }
  }
}

function artworkCandidates(type) {
  const key = type === 'poster' ? 'posters' : `${type}s`
  return artwork.value?.candidates?.[key] || []
}

function selectArtwork(type, asset) {
  artwork.value = {
    ...(artwork.value || {}),
    assets: {
      ...(artwork.value?.assets || {}),
      [type]: asset,
    },
  }
  artworkMessage.value = ''
}

async function saveArtwork() {
  savingArtwork.value = true
  artworkMessage.value = ''
  const candidates = artwork.value?.candidates || {}
  try {
    const saved = await updateGameArtwork(props.id, artwork.value?.assets || {})
    artwork.value = { ...saved, candidates }
    game.value = {
      ...game.value,
      steamgrid_assets: artwork.value.assets || {},
    }
    artworkMessage.value = '素材选择已保存'
  } catch (err) {
    artworkMessage.value = err.message
  } finally {
    savingArtwork.value = false
  }
}

async function loadMedia() {
  mediaLoading.value = true
  mediaError.value = ''
  try {
    media.value = await fetchGameMedia(props.id)
  } catch (err) {
    mediaError.value = err.message
    media.value = {
      screenshots: game.value?.screenshots || [],
      trailers: game.value?.trailers || [],
      stores: game.value?.stores || [],
      developers: game.value?.developers || [],
      publishers: game.value?.publishers || [],
      website: game.value?.website || '',
    }
  } finally {
    mediaLoading.value = false
  }
}

async function saveReview() {
  saving.value = true
  error.value = ''
  message.value = ''
  try {
    game.value = await updateGame(props.id, form.value)
    message.value = '评价已保存'
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function removeGame() {
  const confirmed = window.confirm(`删除《${game.value.name}》的本地档案？`)
  if (!confirmed) return
  await deleteGame(props.id)
  router.push('/')
}

onMounted(loadGame)
</script>

<template>
  <p v-if="error" class="notice error">{{ error }}</p>
  <p v-else-if="loading" class="notice">正在打开档案...</p>

  <article v-else-if="game && form" class="detail-layout">
    <section class="detail-hero enriched">
      <img v-if="heroImage" :src="heroImage" :alt="game.name" />
      <div class="hero-copy">
        <p class="eyebrow">{{ statusLabel(game.status) }}</p>
        <img v-if="logoImage" class="steamgrid-logo" :src="logoImage" :alt="`${game.name} logo`" />
        <h1 v-else>{{ game.name }}</h1>
        <p>{{ game.released || '未知发售日' }}</p>
        <div class="tag-row">
          <span v-for="genre in game.genres" :key="genre">{{ genre }}</span>
        </div>
      </div>
      <aside class="hero-score">
        <span>我的评分</span>
        <strong>{{ game.overall_score || '-' }}</strong>
      </aside>
    </section>

    <p v-if="mediaError" class="notice error">{{ mediaError }}</p>

    <section v-if="media?.screenshots?.length" class="panel media-panel">
      <div class="section-title">
        <h2>影像画廊</h2>
        <span>{{ media.screenshots.length }} 张截图</span>
      </div>
      <div class="screenshot-strip">
        <a
          v-for="shot in media.screenshots"
          :key="shot.id || shot.image"
          :href="shot.image"
          target="_blank"
          rel="noreferrer"
        >
          <img :src="shot.image" :alt="`${game.name} screenshot`" />
        </a>
      </div>
    </section>

    <section class="two-column">
      <div class="detail-stack">
        <div v-if="posterImage" class="panel poster-panel">
          <img :src="posterImage" :alt="`${game.name} poster`" />
          <div>
            <p class="eyebrow">SteamGridDB Artwork</p>
            <h2>档案封面</h2>
            <p class="muted-text">高质量社区素材会优先用于详情页视觉展示。</p>
          </div>
        </div>

        <div
          v-if="artworkCandidates('poster').length || artworkCandidates('hero').length || artworkCandidates('logo').length"
          class="panel artwork-panel"
        >
          <div class="section-title">
            <div>
              <h2>素材选择</h2>
              <p>为详情页选择封面、横幅和 Logo。</p>
            </div>
            <button type="button" :disabled="savingArtwork" @click="saveArtwork">
              {{ savingArtwork ? '保存中' : '保存素材' }}
            </button>
          </div>

          <div class="artwork-groups">
            <div v-for="type in ['poster', 'hero', 'logo']" :key="type" class="artwork-group">
              <h3>{{ type === 'poster' ? '封面' : type === 'hero' ? '横幅' : 'Logo' }}</h3>
              <div class="artwork-options">
                <button
                  v-for="asset in artworkCandidates(type)"
                  :key="asset.id"
                  type="button"
                  :class="{ selected: artwork?.assets?.[type]?.id === asset.id }"
                  @click="selectArtwork(type, asset)"
                >
                  <img :src="asset.thumb || asset.url" :alt="`${game.name} ${type}`" />
                </button>
              </div>
            </div>
          </div>
          <p v-if="artworkMessage" class="notice success">{{ artworkMessage }}</p>
        </div>

        <div class="panel">
          <h2>官方资料</h2>
          <dl class="meta-list">
            <div>
              <dt>平台</dt>
              <dd>{{ game.platforms.join(' / ') || '未知' }}</dd>
            </div>
            <div>
              <dt>开发商</dt>
              <dd>{{ (media?.developers || game.developers || []).join(' / ') || '未知' }}</dd>
            </div>
            <div>
              <dt>发行商</dt>
              <dd>{{ (media?.publishers || game.publishers || []).join(' / ') || '未知' }}</dd>
            </div>
            <div>
              <dt>RAWG 评分</dt>
              <dd>{{ game.rawg_rating || '-' }}</dd>
            </div>
            <div>
              <dt>Metacritic</dt>
              <dd>{{ game.metacritic || '-' }}</dd>
            </div>
          </dl>
          <p class="description">{{ game.description || '暂无简介。' }}</p>
        </div>

        <div v-if="media?.trailers?.length || media?.stores?.length || media?.website" class="panel">
          <div class="section-title">
            <h2>外部资料</h2>
            <span v-if="mediaLoading">更新中</span>
          </div>

          <div v-if="media.trailers?.length" class="trailer-grid">
            <a
              v-for="trailer in media.trailers"
              :key="trailer.id || trailer.name"
              class="trailer-card"
              :href="trailer.video || trailer.preview"
              target="_blank"
              rel="noreferrer"
            >
              <img v-if="trailer.preview" :src="trailer.preview" :alt="trailer.name" />
              <span>{{ trailer.name }}</span>
            </a>
          </div>

          <div class="store-links">
            <a v-if="media.website" :href="media.website" target="_blank" rel="noreferrer">官方网站</a>
            <a
              v-for="store in media.stores"
              :key="store.name"
              :href="store.url || `https://${store.domain}`"
              target="_blank"
              rel="noreferrer"
            >
              {{ store.name }}
            </a>
          </div>
        </div>
      </div>

      <form class="panel review-form" @submit.prevent="saveReview">
        <h2>我的评价</h2>
        <label>
          状态
          <select v-model="form.status">
            <option v-for="option in editableStatusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label>
          游玩平台
          <input v-model="form.play_platform" type="text" placeholder="例如 PC / Switch / PS5" />
        </label>

        <RatingEditor v-model="scoreModel" />

        <label>
          体验标签
          <TagEditor v-model="form.experience_tags" />
        </label>

        <label>
          文字评价
          <textarea v-model="form.review" rows="8" placeholder="写下你的主观体验。" />
        </label>

        <div class="form-actions">
          <button type="submit" :disabled="saving">{{ saving ? '保存中' : '保存评价' }}</button>
          <button type="button" class="danger" @click="removeGame">删除档案</button>
        </div>
        <p v-if="message" class="notice success">{{ message }}</p>
      </form>
    </section>

    <GameComments :game-id="game.id" :rawg-id="game.rawg_id" />
  </article>
</template>
